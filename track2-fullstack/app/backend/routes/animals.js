const express = require('express');
const router = express.Router();
const animalService = require('../services/animalService');
const { db } = require('../db'); // Still needed for the specific latest event join

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;

  const animals = animalService.getAllAnimals(limit, page);

  const result = animals.map(animal => {
    // Keeping this join logic here for now as it crosses entities
    const latestEvent = db.prepare(`
      SELECT * FROM health_events
      WHERE animal_id = ?
      ORDER BY date DESC
      LIMIT 1
    `).get(animal.id);
    return { ...animal, latest_health_event: latestEvent ?? null };
  });

  res.json(result);
});

router.post('/', (req, res) => {
  const { name, tag_number, breed, date_of_birth, paddock_id } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a non-empty string.');
  }
  if (!tag_number || typeof tag_number !== 'string' || tag_number.trim() === '') {
    errors.push('Tag number is required and must be a non-empty string.');
  }
  if (date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth)) {
    errors.push('Date of birth must be in YYYY-MM-DD format.');
  }

  if (paddock_id !== undefined && paddock_id !== null) {
    if (typeof paddock_id !== 'number' || !Number.isInteger(paddock_id)) {
      errors.push('Paddock ID must be an integer.');
    } else {
      const paddockExists = db.prepare('SELECT id FROM paddocks WHERE id = ?').get(paddock_id);
      if (!paddockExists) {
        errors.push(`Paddock with ID ${paddock_id} does not exist.`);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const result = animalService.createAnimal({ name, tag_number, breed, date_of_birth, paddock_id });
  const animal = animalService.getAnimalById(result.lastInsertRowid);
  res.status(201).json(animal);
});

router.get('/:id', (req, res) => {
  const animal = animalService.getAnimalById(req.params.id);
  if (!animal) return res.status(404).json({ error: 'Animal not found' });
  res.json(animal);
});

router.put('/:id', (req, res) => {
  const updated = animalService.updateAnimal(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Animal not found' });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const deleted = animalService.deleteAnimal(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Animal not found' });
  res.json({ message: 'deleted' });
});

router.get('/:id/health-events', (req, res) => {
  const animal = animalService.getAnimalById(req.params.id);
  if (!animal) return res.status(404).json({ error: 'Animal not found' });

  const events = animalService.getHealthEvents(req.params.id);
  res.json(events);
});

router.post('/:id/health-events', (req, res) => {
  const animal = animalService.getAnimalById(req.params.id);
  if (!animal) return res.status(404).json({ error: 'Animal not found' });

  const { event_type, notes, date, vet_name } = req.body;
  if (!event_type || !date) {
    return res.status(400).json({ error: 'event_type and date are required' });
  }

  const result = animalService.createHealthEvent({ animal_id: req.params.id, event_type, notes, date, vet_name });
  const event = db.prepare('SELECT * FROM health_events WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(event);
});

router.post('/:id/weights', (req, res) => {
  const animal = animalService.getAnimalById(req.params.id);
  if (!animal) {
    return res.status(404).json({ message: 'Animal not found' });
  }

  const { weight_kg, date, notes } = req.body;
  const errors = [];
  if (weight_kg === undefined || typeof weight_kg !== 'number' || weight_kg <= 0) {
    errors.push('Weight (weight_kg) is required and must be a positive number.');
  }
  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('Date is required and must be in YYYY-MM-DD format.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const result = animalService.createWeight({ animal_id: req.params.id, weight_kg, date, notes });
  const newWeight = db.prepare('SELECT * FROM weights WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newWeight);
});

router.get('/:id/weights', (req, res) => {
  const animal = animalService.getAnimalById(req.params.id);
  if (!animal) {
    return res.status(404).json({ message: 'Animal not found' });
  }

  const weights = animalService.getWeights(req.params.id);
  res.json(weights);
});

module.exports = router;
