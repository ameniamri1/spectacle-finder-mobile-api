
import express from 'express';
import Lieu from '../models/lieu.model.js';

const router = express.Router();

// Get all lieux
router.get('/', async (req, res) => {
  try {
    const lieux = await Lieu.findAll();
    res.json(lieux);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get a specific lieu by ID
router.get('/:id', async (req, res) => {
  try {
    const lieu = await Lieu.findById(req.params.id);
    if (!lieu) {
      return res.status(404).json({ message: 'Lieu not found' });
    }
    res.json(lieu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Search lieux by name or city
router.get('/search/criteria', async (req, res) => {
  try {
    const criteria = {
      nomLieu: req.query.nom,
      ville: req.query.ville
    };
    
    const lieux = await Lieu.search(criteria);
    res.json(lieux);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get spectacles for a specific lieu
router.get('/:id/spectacles', async (req, res) => {
  try {
    const spectacles = await Lieu.getSpectaclesByLieuId(req.params.id);
    res.json(spectacles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Create a new lieu
router.post('/', async (req, res) => {
  try {
    const newLieu = await Lieu.create(req.body);
    res.status(201).json(newLieu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update a lieu
router.put('/:id', async (req, res) => {
  try {
    const lieu = await Lieu.findById(req.params.id);
    if (!lieu) {
      return res.status(404).json({ message: 'Lieu not found' });
    }
    
    const updatedLieu = await Lieu.update(req.params.id, req.body);
    res.json(updatedLieu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Delete a lieu
router.delete('/:id', async (req, res) => {
  try {
    const lieu = await Lieu.findById(req.params.id);
    if (!lieu) {
      return res.status(404).json({ message: 'Lieu not found' });
    }
    
    await Lieu.delete(req.params.id);
    res.json({ message: 'Lieu deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
