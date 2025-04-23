
const express = require('express');
const router = express.Router();
const Spectacle = require('../models/spectacle.model');

// Get all spectacles
router.get('/', async (req, res) => {
  try {
    const spectacles = await Spectacle.findAll();
    res.json(spectacles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get a specific spectacle by ID
router.get('/:id', async (req, res) => {
  try {
    const spectacle = await Spectacle.findById(req.params.id);
    if (!spectacle) {
      return res.status(404).json({ message: 'Spectacle not found' });
    }
    res.json(spectacle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get a specific spectacle by ID with all details (representations, artistes, etc.)
router.get('/:id/details', async (req, res) => {
  try {
    const spectacle = await Spectacle.findWithDetails(req.params.id);
    if (!spectacle) {
      return res.status(404).json({ message: 'Spectacle not found' });
    }
    res.json(spectacle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Search spectacles
router.get('/search/criteria', async (req, res) => {
  try {
    const criteria = {
      titre: req.query.titre,
      dateS: req.query.date,
      h_debut: req.query.heure,
      nomlieu: req.query.lieu,
      ville: req.query.ville
    };
    
    const spectacles = await Spectacle.search(criteria);
    res.json(spectacles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Create a new spectacle
router.post('/', async (req, res) => {
  try {
    const newSpectacle = await Spectacle.create(req.body);
    res.status(201).json(newSpectacle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update a spectacle
router.put('/:id', async (req, res) => {
  try {
    const spectacle = await Spectacle.findById(req.params.id);
    if (!spectacle) {
      return res.status(404).json({ message: 'Spectacle not found' });
    }
    
    const updatedSpectacle = await Spectacle.update(req.params.id, req.body);
    res.json(updatedSpectacle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Delete a spectacle
router.delete('/:id', async (req, res) => {
  try {
    const spectacle = await Spectacle.findById(req.params.id);
    if (!spectacle) {
      return res.status(404).json({ message: 'Spectacle not found' });
    }
    
    await Spectacle.delete(req.params.id);
    res.json({ message: 'Spectacle deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
