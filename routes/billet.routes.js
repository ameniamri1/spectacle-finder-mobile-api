import express from 'express';
import Billet from '../models/billet.model.js';
import Representation from '../models/representation.model.js';

const router = express.Router();

// Obtenir tous les billets
router.get('/', async (req, res) => {
  try {
    const billets = await Billet.findAll();
    res.json(billets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir un billet spécifique par ID
router.get('/:id', async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);
    if (!billet) {
      return res.status(404).json({ message: 'Billet non trouvé' });
    }
    res.json(billet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir les billets par ID de représentation
router.get('/representation/:idRep', async (req, res) => {
  try {
    const billets = await Billet.findByRepresentation(req.params.idRep);
    res.json(billets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Obtenir les billets disponibles pour une représentation
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
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Réserver un billet
router.post('/reserve/:id', async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);
    if (!billet) {
      return res.status(404).json({ message: 'Billet non trouvé' });
    }

    if (billet.vendu === 'oui') {
      return res.status(400).json({ message: 'Billet déjà vendu' });
    }

    const clientInfo = req.body;
    // Validation des informations du client
    if (!clientInfo.nom || !clientInfo.email) {
      return res.status(400).json({ message: 'Informations du client requises' });
    }

    const result = await Billet.markAsSold(req.params.id, clientInfo);
    res.json({
      message: 'Billet réservé avec succès',
      billet: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Créer un nouveau billet
router.post('/', async (req, res) => {
  try {
    const newBillet = await Billet.create(req.body);
    res.status(201).json(newBillet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Mettre à jour un billet
router.put('/:id', async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);
    if (!billet) {
      return res.status(404).json({ message: 'Billet non trouvé' });
    }

    const updatedBillet = await Billet.update(req.params.id, req.body);
    res.json(updatedBillet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Supprimer un billet
router.delete('/:id', async (req, res) => {
  try {
    const billet = await Billet.findById(req.params.id);
    if (!billet) {
      return res.status(404).json({ message: 'Billet non trouvé' });
    }

    await Billet.delete(req.params.id);
    res.json({ message: 'Billet supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

export default router;
