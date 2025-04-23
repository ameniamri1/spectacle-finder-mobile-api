
const express = require('express');
const router = express.Router();
const Representation = require('../models/representation.model');

// Get all representations
router.get('/', async (req, res) => {
  try {
    const representations = await Representation.findAll();
    res.json(representations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get a specific representation by ID
router.get('/:id', async (req, res) => {
  try {
    const representation = await Representation.findById(req.params.id);
    if (!representation) {
      return res.status(404).json({ message: 'Representation not found' });
    }
    res.json(representation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get representation with details (including available billets)
router.get('/:id/details', async (req, res) => {
  try {
    const representation = await Representation.findWithDetails(req.params.id);
    if (!representation) {
      return res.status(404).json({ message: 'Representation not found' });
    }
    res.json(representation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get representations by spectacle ID
router.get('/spectacle/:idSpec', async (req, res) => {
  try {
    const representations = await Representation.findBySpectacle(req.params.idSpec);
    res.json(representations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get representations by lieu ID
router.get('/lieu/:idLieu', async (req, res) => {
  try {
    const representations = await Representation.findByLieu(req.params.idLieu);
    res.json(representations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get representations by date
router.get('/date/:date', async (req, res) => {
  try {
    const representations = await Representation.findByDate(req.params.date);
    res.json(representations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Search representations
router.get('/search/criteria', async (req, res) => {
  try {
    const criteria = {
      titre: req.query.titre,
      dateS: req.query.date,
      h_debut: req.query.heure,
      nomlieu: req.query.lieu,
      ville: req.query.ville
    };
    
    const representations = await Representation.search(criteria);
    res.json(representations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Create a new representation
router.post('/', async (req, res) => {
  try {
    const newRepresentation = await Representation.create(req.body);
    res.status(201).json(newRepresentation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update a representation
router.put('/:id', async (req, res) => {
  try {
    const representation = await Representation.findById(req.params.id);
    if (!representation) {
      return res.status(404).json({ message: 'Representation not found' });
    }
    
    const updatedRepresentation = await Representation.update(req.params.id, req.body);
    res.json(updatedRepresentation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Delete a representation
router.delete('/:id', async (req, res) => {
  try {
    const representation = await Representation.findById(req.params.id);
    if (!representation) {
      return res.status(404).json({ message: 'Representation not found' });
    }
    
    await Representation.delete(req.params.id);
    res.json({ message: 'Representation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
