
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

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
import spectacleRoutes from './routes/spectacle.routes.js';
import billetRoutes from './routes/billet.routes.js';
import lieuRoutes from './routes/lieu.routes.js';
import artisteRoutes from './routes/artiste.routes.js';
import representationRoutes from './routes/representation.routes.js';

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

export default app;
