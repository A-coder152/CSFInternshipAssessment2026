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

module.exports = { findAll, findById, create };
