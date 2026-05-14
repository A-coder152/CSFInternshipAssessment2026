const { after, before, beforeEach, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'farmtracker-test-'));
process.env.FARMTRACKER_DB_PATH = path.join(tempDir, 'farmtracker.db');

const app = require('../server');
const { db } = require('../db');

let server;
let baseUrl;

beforeEach(() => {
  seedTestData();
});

before(async () => {
  server = await new Promise(resolve => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

function seedTestData() {
  db.exec('DELETE FROM health_events; DELETE FROM animals; DELETE FROM paddocks; DELETE FROM weights;');

  const northId = db.prepare(
    'INSERT INTO paddocks (name, capacity, animal_count) VALUES (?, ?, 0)'
  ).run('North Paddock', 50).lastInsertRowid;

  const southId = db.prepare(
    'INSERT INTO paddocks (name, capacity, animal_count) VALUES (?, ?, 0)'
  ).run('South Paddock', 30).lastInsertRowid;

  const insertAnimal = db.prepare(
    'INSERT INTO animals (name, tag_number, breed, date_of_birth, paddock_id) VALUES (?, ?, ?, ?, ?)'
  );

  const bellaId = insertAnimal.run('Bella', 'TAG-001', 'Merino', '2021-03-14', northId).lastInsertRowid;
  insertAnimal.run('Daisy', 'TAG-002', 'Dorper', '2020-07-22', southId);

  db.prepare('UPDATE paddocks SET animal_count = animal_count + 1 WHERE id = ?').run(northId);
  db.prepare('UPDATE paddocks SET animal_count = animal_count + 1 WHERE id = ?').run(southId);

  db.prepare(
    'INSERT INTO health_events (animal_id, event_type, notes, date, vet_name) VALUES (?, ?, ?, ?, ?)'
  ).run(bellaId, 'vaccination', 'Routine vaccination', '2024-01-15', 'Dr. Walsh');
}

async function get(path) {
  const res = await fetch(baseUrl + path);
  return { status: res.status, body: await res.json() };
}

async function post(path, body) {
  const res = await fetch(baseUrl + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

test('GET /api/paddocks returns an array', async () => {
  const { status, body } = await get('/paddocks');
  assert.equal(status, 200);
  assert.ok(Array.isArray(body));
});

test('GET /api/animals returns animals with latest_health_event field', async () => {
  const { status, body } = await get('/animals?page=0&limit=5');
  assert.equal(status, 200);
  assert.ok(Array.isArray(body));
  assert.ok(body.length > 0);
  assert.ok('latest_health_event' in body[0]);
});

test('GET /api/animals/:id returns a single animal', async () => {
  const { body: animals } = await get('/animals?page=0&limit=1');
  const id = animals[0].id;
  const { status, body } = await get(`/animals/${id}`);
  assert.equal(status, 200);
  assert.equal(body.id, id);
});

test('GET /api/animals/:id returns 404 for unknown id', async () => {
  const { status } = await get('/animals/999999');
  assert.equal(status, 404);
});

test('POST /api/animals creates an animal', async () => {
  // First, get an existing paddock ID to use for testing
  const { body: paddocks } = await get('/paddocks');
  assert.ok(paddocks.length > 0, 'Should have at least one paddock for testing');
  const existingPaddockId = paddocks[0].id;

  const { status, body } = await post('/animals', {
    name: 'New Animal',
    tag_number: 'TAG-NEW',
    breed: 'Holstein',
    date_of_birth: '2023-01-01',
    paddock_id: existingPaddockId
  });
  assert.equal(status, 201);
  assert.equal(body.name, 'New Animal');
  assert.equal(body.tag_number, 'TAG-NEW');
  assert.equal(body.breed, 'Holstein');
  assert.equal(body.date_of_birth, '2023-01-01');
  assert.equal(body.paddock_id, existingPaddockId);

  // Verify that the paddock animal count was updated
  const { body: updatedPaddock } = await get(`/paddocks/${existingPaddockId}`);
  assert.equal(updatedPaddock.animal_count, paddocks[0].animal_count + 1);
});

test('POST /api/animals returns 400 for missing name', async () => {
  const { status, body } = await post('/animals', {
    tag_number: 'TAG-MISSING-NAME',
    breed: 'Merino'
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, ['Name is required and must be a non-empty string.']);
});

test('POST /api/animals returns 400 for missing tag_number', async () => {
  const { status, body } = await post('/animals', {
    name: 'Animal Missing Tag',
    breed: 'Merino'
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, ['Tag number is required and must be a non-empty string.']);
});

test('POST /api/animals returns 400 for invalid date_of_birth format', async () => {
  const { status, body } = await post('/animals', {
    name: 'Invalid Date Animal',
    tag_number: 'TAG-INVALID-DATE',
    date_of_birth: '01-01-2023' // Invalid format
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, ['Date of birth must be in YYYY-MM-DD format.']);
});

test('POST /api/animals returns 400 for non-existent paddock_id', async () => {
  const { status, body } = await post('/animals', {
    name: 'No Paddock Animal',
    tag_number: 'TAG-NO-PADDOCK',
    paddock_id: 999999 // Non-existent ID
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, ['Paddock with ID 999999 does not exist.']);
});

test('POST /api/animals returns 400 for invalid paddock_id type', async () => {
  const { status, body } = await post('/animals', {
    name: 'Invalid Paddock Type Animal',
    tag_number: 'TAG-INVALID-PADDOCK-TYPE',
    paddock_id: 'not-a-number' // Invalid type
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, ['Paddock ID must be an integer.']);
});

test('POST /api/animals/:id/health-events creates an event', async () => {
  const { body: animals } = await get('/animals?page=0&limit=1');
  const id = animals[0].id;
  const { status, body } = await post(`/animals/${id}/health-events`, {
    event_type: 'checkup',
    date: '2025-01-10',
    vet_name: 'Dr. Test',
  });
  assert.equal(status, 201);
  assert.equal(body.event_type, 'checkup');
  assert.equal(body.animal_id, id);
});

// Tests for POST /api/animals/:id/weights
test('POST /api/animals/:id/weights creates a weight record', async () => {
  const { body: animals } = await get('/animals?page=0&limit=1');
  const animalId = animals[0].id;

  const { status, body } = await post(`/animals/${animalId}/weights`, {
    weight_kg: 50.5,
    date: '2024-05-01',
    notes: 'First weigh-in'
  });
  assert.equal(status, 201);
  assert.equal(body.animal_id, animalId);
  assert.equal(body.weight_kg, 50.5);
  assert.equal(body.date, '2024-05-01');
  assert.equal(body.notes, 'First weigh-in');
});

test('POST /api/animals/:id/weights returns 400 for missing weight_kg', async () => {
  const { body: animals } = await get('/animals?page=0&limit=1');
  const animalId = animals[0].id;

  const { status, body } = await post(`/animals/${animalId}/weights`, {
    date: '2024-05-02'
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, ['Weight (weight_kg) is required and must be a positive number.']);
});

test('POST /api/animals/:id/weights returns 400 for non-positive weight_kg', async () => {
  const { body: animals } = await get('/animals?page=0&limit=1');
  const animalId = animals[0].id;

  const { status, body } = await post(`/animals/${animalId}/weights`, {
    weight_kg: 0,
    date: '2024-05-02'
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, ['Weight (weight_kg) is required and must be a positive number.']);
});

test('POST /api/animals/:id/weights returns 400 for invalid date format', async () => {
  const { body: animals } = await get('/animals?page=0&limit=1');
  const animalId = animals[0].id;

  const { status, body } = await post(`/animals/${animalId}/weights`, {
    weight_kg: 50,
    date: '02-05-2024' // Invalid format
  });
  assert.equal(status, 400);
  assert.deepEqual(body.errors, ['Date is required and must be in YYYY-MM-DD format.']);
});

test('POST /api/animals/:id/weights returns 404 for non-existent animal_id', async () => {
  const nonExistentAnimalId = 999999;
  const { status, body } = await post(`/animals/${nonExistentAnimalId}/weights`, {
    weight_kg: 50,
    date: '2024-05-01'
  });
  assert.equal(status, 404);
  assert.equal(body.message, 'Animal not found');
});

// Tests for GET /api/animals/:id/weights
test('GET /api/animals/:id/weights returns weight history ordered by date descending', async () => {
  const { body: animals } = await get('/animals?page=0&limit=1');
  const animalId = animals[0].id;

  // Add multiple weights to ensure ordering
  await post(`/animals/${animalId}/weights`, { weight_kg: 50, date: '2024-05-01' });
  await post(`/animals/${animalId}/weights`, { weight_kg: 52, date: '2024-05-03' });
  await post(`/animals/${animalId}/weights`, { weight_kg: 51, date: '2024-05-02' });

  const { status, body } = await get(`/animals/${animalId}/weights`);
  assert.equal(status, 200);
  assert.ok(Array.isArray(body));
  assert.equal(body.length, 3);
  assert.equal(body[0].date, '2024-05-03'); // Latest date first
  assert.equal(body[1].date, '2024-05-02');
  assert.equal(body[2].date, '2024-05-01');
});

test('GET /api/animals/:id/weights returns 404 for non-existent animal_id', async () => {
  const nonExistentAnimalId = 999999;
  const { status, body } = await get(`/animals/${nonExistentAnimalId}/weights`);
  assert.equal(status, 404);
  assert.equal(body.message, 'Animal not found');
});
