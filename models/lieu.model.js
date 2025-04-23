
import { pool } from '../config/db.config.js';

// Lieu Model
const Lieu = {
  // Get all lieux
  findAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM lieu');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get a lieu by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM lieu WHERE idLieu = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Search lieux by name or city
  search: async (criteria) => {
    try {
      let query = 'SELECT * FROM lieu WHERE 1=1';
      const params = [];
      
      if (criteria.nomLieu) {
        query += ' AND (NomLieu LIKE ? OR nom_lieu LIKE ?)';
        params.push(`%${criteria.nomLieu}%`, `%${criteria.nomLieu}%`);
      }
      
      if (criteria.ville) {
        query += ' AND adresse LIKE ?';
        params.push(`%${criteria.ville}%`);
      }
      
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Create a new lieu
  create: async (lieuData) => {
    try {
      const [result] = await pool.query(
        'INSERT INTO lieu (NomLieu, adresse, capacite, nom_lieu) VALUES (?, ?, ?, ?)',
        [lieuData.NomLieu, lieuData.adresse, lieuData.capacite, lieuData.nom_lieu || lieuData.NomLieu]
      );
      return { id: result.insertId, ...lieuData };
    } catch (error) {
      throw error;
    }
  },

  // Update a lieu
  update: async (id, lieuData) => {
    try {
      await pool.query(
        'UPDATE lieu SET NomLieu = ?, adresse = ?, capacite = ?, nom_lieu = ? WHERE idLieu = ?',
        [lieuData.NomLieu, lieuData.adresse, lieuData.capacite, lieuData.nom_lieu || lieuData.NomLieu, id]
      );
      return { id, ...lieuData };
    } catch (error) {
      throw error;
    }
  },

  // Delete a lieu
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM lieu WHERE idLieu = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  },

  // Get spectacles for a specific lieu
  getSpectaclesByLieuId: async (id) => {
    try {
      const [rows] = await pool.query(`
        SELECT s.* 
        FROM spectacle s 
        WHERE s.id_lieu = ?
        UNION
        SELECT DISTINCT s.*
        FROM spectacle s
        INNER JOIN representation r ON s.idSpec = r.idSpec
        WHERE r.idLieu = ?
      `, [id, id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

export default Lieu;
