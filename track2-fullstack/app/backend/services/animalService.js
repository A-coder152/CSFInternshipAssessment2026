const animalRepo = require('../repositories/animalRepository');
const paddockRepo = require('../repositories/paddockRepository');

function getAllAnimals(limit, offset) {
  return animalRepo.findAll(limit, offset);
}

function getAnimalById(id) {
  return animalRepo.findById(id);
}

function createAnimal(animalData) {
  if (animalData.paddock_id) {
    paddockRepo.incrementAnimalCount(animalData.paddock_id);
  }
  return animalRepo.create(animalData);
}

function updateAnimal(id, updates) {
  const animal = animalRepo.findById(id);
  if (!animal) return null;

  // Handle paddock change
  if ('paddock_id' in updates && updates.paddock_id !== animal.paddock_id) {
    if (animal.paddock_id) paddockRepo.decrementAnimalCount(animal.paddock_id);
    if (updates.paddock_id) paddockRepo.incrementAnimalCount(updates.paddock_id);
  }

  const mergedUpdates = { ...animal, ...updates };
  animalRepo.update(id, mergedUpdates);
  return animalRepo.findById(id);
}

function deleteAnimal(id) {
  const animal = animalRepo.findById(id);
  if (!animal) return false;

  if (animal.paddock_id) {
    paddockRepo.decrementAnimalCount(animal.paddock_id);
  }
  return animalRepo.remove(id);
}

function getHealthEvents(animalId) {
  return animalRepo.getHealthEvents(animalId);
}

function createHealthEvent(eventData) {
  return animalRepo.createHealthEvent(eventData);
}

function getWeights(animalId) {
  return animalRepo.getWeights(animalId);
}

function createWeight(weightData) {
  return animalRepo.createWeight(weightData);
}

module.exports = {
  getAllAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal,
  getHealthEvents, createHealthEvent, getWeights, createWeight
};
