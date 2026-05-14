const paddockRepo = require('../repositories/paddockRepository');

function getAllPaddocks() {
  return paddockRepo.findAll();
}

function getPaddockById(id) {
  return paddockRepo.findById(id);
}

function createPaddock(paddockData) {
  return paddockRepo.create(paddockData);
}

module.exports = { getAllPaddocks, getPaddockById, createPaddock };
