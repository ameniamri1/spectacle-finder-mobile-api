import { pool } from '../config/db.config.js';

const Billet = {
  // Obtenir tous les billets
  findAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM billet');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir un billet par ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM billet WHERE idBillet = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les billets par ID de représentation
  findByRepresentation: async (idRep) => {
    try {
      const [rows] = await pool.query('SELECT * FROM billet WHERE idRep = ?', [idRep]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les billets disponibles pour une représentation
  findAvailableByRepresentation: async (idRep) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM billet WHERE idRep = ? AND (vendu IS NULL OR vendu = "non")',
        [idRep]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Compter les billets disponibles pour une représentation
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

  // Créer un nouveau billet
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

  // Mettre à jour un billet
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

  // Marquer un billet comme vendu
  markAsSold: async (id, clientInfo) => {
    try {
      await pool.query('UPDATE billet SET vendu = "oui" WHERE idBillet = ?', [id]);
      // Dans une application réelle, vous devriez également enregistrer les informations du client dans une table dédiée
      return { id, status: 'vendu', clientInfo };
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un billet
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM billet WHERE idBillet = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }
};

export default Billet;
