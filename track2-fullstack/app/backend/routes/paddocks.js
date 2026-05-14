const express = require('express');
const router = express.Router();
const paddockService = require('../services/paddockService');

router.get('/', (req, res) => {
  const paddocks = paddockService.getAllPaddocks();
  res.json(paddocks);
});

router.post('/', (req, res) => {
  const { name, capacity } = req.body;
  if (!name || !capacity) {
    return res.status(400).json({ error: 'name and capacity are required' });
  }
  const result = paddockService.createPaddock({ name, capacity });
  const paddock = paddockService.getPaddockById(result.lastInsertRowid);
  res.status(201).json(paddock);
});

router.get('/:id', (req, res) => {
  const paddock = paddockService.getPaddockById(req.params.id);
  if (!paddock) return res.status(404).json({ error: 'Paddock not found' });
  res.json(paddock);
});

module.exports = router;
