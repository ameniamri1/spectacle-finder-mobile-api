
import express from 'express';
import Billet from '../models/billet.model.js';
import Representation from '../models/representation.model.js';

const router = express.Router();

// Get all billets
router.get('/', async (req, res) => {
  try {
    const billets = await Billet.findAll();
    res.json(billets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get a specific billet by ID
router.get('/:id', async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);
    if (!billet) {
      return res.status(404).json({ message: 'Billet not found' });
    }
    res.json(billet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get billets by representation ID
router.get('/representation/:idRep', async (req, res) => {
  try {
    const billets = await Billet.findByRepresentation(req.params.idRep);
    res.json(billets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get available billets for a representation
router.get('/available/:idRep', async (req, res) => {
  try {
    const billets = await Billet.findAvailableByRepresentation(req.params.idRep);
    const representation = await Representation.findById(req.params.idRep);
    
    res.json({
      representation,
      availableCount: billets.length,
      billets
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Reserve a billet
router.post('/reserve/:id', async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);
    if (!billet) {
      return res.status(404).json({ message: 'Billet not found' });
    }
    
    if (billet.vendu === 'oui') {
      return res.status(400).json({ message: 'Billet already sold' });
    }
    
    const clientInfo = req.body;
    // Validate client info
    if (!clientInfo.nom || !clientInfo.email) {
      return res.status(400).json({ message: 'Client information required' });
    }
    
    const result = await Billet.markAsSold(req.params.id, clientInfo);
    res.json({
      message: 'Billet reserved successfully',
      billet: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Create a new billet
router.post('/', async (req, res) => {
  try {
    const newBillet = await Billet.create(req.body);
    res.status(201).json(newBillet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update a billet
router.put('/:id', async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);
    if (!billet) {
      return res.status(404).json({ message: 'Billet not found' });
    }
    
    const updatedBillet = await Billet.update(req.params.id, req.body);
    res.json(updatedBillet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Delete a billet
router.delete('/:id', async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);
    if (!billet) {
      return res.status(404).json({ message: 'Billet not found' });
    }
    
    await Billet.delete(req.params.id);
    res.json({ message: 'Billet deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
