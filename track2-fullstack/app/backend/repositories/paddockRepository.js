const { db } = require('../db');

function findAll() {
  return db.prepare('SELECT * FROM paddocks').all();
}

function findById(id) {
  return db.prepare('SELECT * FROM paddocks WHERE id = ?').get(id);
}

function create(paddockData) {
  return db.prepare(
    'INSERT INTO paddocks (name, capacity, animal_count) VALUES (?, ?, ?)'
  ).run(paddockData.name, paddockData.capacity, paddockData.animal_count ?? 0);
}

function incrementAnimalCount(id) {
  return db.prepare('UPDATE paddocks SET animal_count = animal_count + 1 WHERE id = ?').run(id);
}

function decrementAnimalCount(id) {
  return db.prepare('UPDATE paddocks SET animal_count = animal_count - 1 WHERE id = ?').run(id);
}

module.exports = { findAll, findById, create, incrementAnimalCount, decrementAnimalCount };
