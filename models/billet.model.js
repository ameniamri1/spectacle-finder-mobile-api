
const { pool } = require('../config/db.config');

// Billet Model
const Billet = {
  // Get all billets
  findAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM billet');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get a billet by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM billet WHERE idBillet = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get billets by representation ID
  findByRepresentation: async (idRep) => {
    try {
      const [rows] = await pool.query('SELECT * FROM billet WHERE idRep = ?', [idRep]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get available billets for a representation
  findAvailableByRepresentation: async (idRep) => {
    try {
      const [rows] = await pool.query('SELECT * FROM billet WHERE idRep = ? AND (vendu IS NULL OR vendu = "non")', [idRep]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Count available billets for a representation
  countAvailableByRepresentation: async (idRep) => {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as availableCount FROM billet WHERE idRep = ? AND (vendu IS NULL OR vendu = "non")',
        [idRep]
      );
      return rows[0].availableCount;
    } catch (error) {
      throw error;
    }
  },

  // Create a new billet
  create: async (billetData) => {
    try {
      const [result] = await pool.query(
        'INSERT INTO billet (categorie, prix, idRep, vendu, id_spec) VALUES (?, ?, ?, ?, ?)',
        [billetData.categorie, billetData.prix, billetData.idRep, billetData.vendu || 'non', billetData.id_spec]
      );
      return { id: result.insertId, ...billetData };
    } catch (error) {
      throw error;
    }
  },

  // Update a billet
  update: async (id, billetData) => {
    try {
      await pool.query(
        'UPDATE billet SET categorie = ?, prix = ?, idRep = ?, vendu = ?, id_spec = ? WHERE idBillet = ?',
        [billetData.categorie, billetData.prix, billetData.idRep, billetData.vendu, billetData.id_spec, id]
      );
      return { id, ...billetData };
    } catch (error) {
      throw error;
    }
  },

  // Mark a billet as sold
  markAsSold: async (id, clientInfo) => {
    try {
      await pool.query('UPDATE billet SET vendu = "oui" WHERE idBillet = ?', [id]);
      // In a real app, you would also store the client info in a clients table
      return { id, status: 'sold', clientInfo };
    } catch (error) {
      throw error;
    }
  },

  // Delete a billet
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM billet WHERE idBillet = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Billet;
