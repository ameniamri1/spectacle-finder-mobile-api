import express from 'express';
import Place from '../models/place.model.js'; // Utiliser l'importation pour Place

const router = express.Router();

// Récupérer toutes les places
router.get('/', async (req, res) => {
  try {
    const places = await Place.findAll();
    res.json(places);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Vérifier si une place est disponible pour un spectacle donné
router.get('/availability/check', async (req, res) => {
  try {
    const { numero, section, rang, spectacle_id } = req.query;

    if (!numero || !section || !rang || !spectacle_id) {
      return res.status(400).json({ message: 'Paramètres requis : numero, section, rang, spectacle_id' });
    }

    const available = await Place.isAvailable(numero, section, rang, spectacle_id);
    res.json({ available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});
// Réserver une place
router.put('/:id/reserve', async (req, res) => {
  try {
    const result = await Place.reserve(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Réservation impossible', error: err.message });
  }
});


// Récupérer une place spécifique par ID
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place non trouvée' });
    }
    res.json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Recherche de places en fonction de critères
router.get('/search', async (req, res) => {
  try {
    const criteria = {
      nom: req.query.nom,
      adresse: req.query.adresse,
      ville: req.query.ville,
    };

    const places = await Place.search(criteria);
    res.json(places);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Créer une nouvelle place
router.post('/', async (req, res) => {
  try {
    const newPlace = await Place.create(req.body);
    res.status(201).json(newPlace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Mettre à jour une place par ID
router.put('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place non trouvée' });
    }

    const updatedPlace = await Place.update(req.params.id, req.body);
    res.json(updatedPlace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Supprimer une place par ID
router.delete('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place non trouvée' });
    }

    await Place.delete(req.params.id);
    res.json({ message: 'Place supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Récupérer une place spécifique avec tous les détails
router.get('/:id/details', async (req, res) => {
  try {
    const place = await Place.findWithDetails(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place non trouvée' });
    }
    res.json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Récupérer une place spécifique avec des détails simples
router.get('/simple-details/:id', async (req, res) => {
  try {
    const place = await Place.findSimpleDetails(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place non trouvée' });
    }
    res.json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

export default router;
