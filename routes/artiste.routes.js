
import express from 'express';
import Artiste from '../models/artiste.model.js';

const router = express.Router();

// Get all artistes
router.get('/', async (req, res) => {
  try {
    const artistes = await Artiste.findAll();
    res.json(artistes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get a specific artiste by ID
router.get('/:id', async (req, res) => {
  try {
    const artiste = await Artiste.findById(req.params.id);
    if (!artiste) {
      return res.status(404).json({ message: 'Artiste not found' });
    }
    res.json(artiste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Search artistes
router.get('/search/criteria', async (req, res) => {
  try {
    const criteria = {
      nom: req.query.nom,
      prenom: req.query.prenom,
      specialite: req.query.specialite
    };
    
    const artistes = await Artiste.search(criteria);
    res.json(artistes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get spectacles for a specific artiste
router.get('/:id/spectacles', async (req, res) => {
  try {
    const spectacles = await Artiste.getSpectaclesByArtisteId(req.params.id);
    res.json(spectacles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get representations for a specific artiste
router.get('/:id/representations', async (req, res) => {
  try {
    const representations = await Artiste.getRepresentationsByArtisteId(req.params.id);
    res.json(representations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Create a new artiste
router.post('/', async (req, res) => {
  try {
    const newArtiste = await Artiste.create(req.body);
    res.status(201).json(newArtiste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update an artiste
router.put('/:id', async (req, res) => {
  try {
    const artiste = await Artiste.findById(req.params.id);
    if (!artiste) {
      return res.status(404).json({ message: 'Artiste not found' });
    }
    
    const updatedArtiste = await Artiste.update(req.params.id, req.body);
    res.json(updatedArtiste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Delete an artiste
router.delete('/:id', async (req, res) => {
  try {
    const artiste = await Artiste.findById(req.params.id);
    if (!artiste) {
      return res.status(404).json({ message: 'Artiste not found' });
    }
    
    await Artiste.delete(req.params.id);
    res.json({ message: 'Artiste deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
