const { db } = require('../db');

function findAll(limit, offset) {
  return db.prepare('SELECT * FROM animals LIMIT ? OFFSET ?').all(limit, offset);
}

function findById(id) {
  return db.prepare('SELECT * FROM animals WHERE id = ?').get(id);
}

function create(animalData) {
  const { name, tag_number, breed, date_of_birth, paddock_id } = animalData;
  return db.prepare(
    'INSERT INTO animals (name, tag_number, breed, date_of_birth, paddock_id) VALUES (?, ?, ?, ?, ?)'
  ).run(name, tag_number, breed ?? null, date_of_birth ?? null, paddock_id ?? null);
}

function update(id, updates) {
  return db.prepare(`
    UPDATE animals
    SET name = ?, tag_number = ?, breed = ?, date_of_birth = ?, paddock_id = ?
    WHERE id = ?
  `).run(updates.name, updates.tag_number, updates.breed, updates.date_of_birth, updates.paddock_id, id);
}

function remove(id) {
  return db.prepare('DELETE FROM animals WHERE id = ?').run(id);
}

// Health events
function getHealthEvents(animalId) {
  return db.prepare('SELECT * FROM health_events WHERE animal_id = ? ORDER BY date DESC').all(animalId);
}

function createHealthEvent(eventData) {
  return db.prepare(
    'INSERT INTO health_events (animal_id, event_type, notes, date, vet_name) VALUES (?, ?, ?, ?, ?)'
  ).run(eventData.animal_id, eventData.event_type, eventData.notes ?? null, eventData.date, eventData.vet_name ?? null);
}

// Weights
function getWeights(animalId) {
  return db.prepare('SELECT * FROM weights WHERE animal_id = ? ORDER BY date DESC').all(animalId);
}

function createWeight(weightData) {
  return db.prepare(
    'INSERT INTO weights (animal_id, weight_kg, date, notes) VALUES (?, ?, ?, ?)'
  ).run(weightData.animal_id, weightData.weight_kg, weightData.date, weightData.notes ?? null);
}

module.exports = { 
  findAll, findById, create, update, remove, 
  getHealthEvents, createHealthEvent, getWeights, createWeight 
};
