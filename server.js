
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const spectacleRoutes = require('./routes/spectacle.routes');
const billetRoutes = require('./routes/billet.routes');
const lieuRoutes = require('./routes/lieu.routes');
const artisteRoutes = require('./routes/artiste.routes');
const representationRoutes = require('./routes/representation.routes');

// Use routes
app.use('/api/spectacles', spectacleRoutes);
app.use('/api/billets', billetRoutes);
app.use('/api/lieux', lieuRoutes);
app.use('/api/artistes', artisteRoutes);
app.use('/api/representations', representationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Gestion des Spectacles' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
