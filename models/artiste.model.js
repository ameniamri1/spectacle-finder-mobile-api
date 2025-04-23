
const { pool } = require('../config/db.config');

// Artiste Model
const Artiste = {
  // Get all artistes
  findAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM artiste');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get an artiste by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM artiste WHERE idArt = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Search artistes by name or speciality
  search: async (criteria) => {
    try {
      let query = 'SELECT * FROM artiste WHERE 1=1';
      const params = [];
      
      if (criteria.nom) {
        query += ' AND (NomArt LIKE ? OR nom_art LIKE ?)';
        params.push(`%${criteria.nom}%`, `%${criteria.nom}%`);
      }
      
      if (criteria.prenom) {
        query += ' AND (PrenomArt LIKE ? OR prenom_art LIKE ?)';
        params.push(`%${criteria.prenom}%`, `%${criteria.prenom}%`);
      }
      
      if (criteria.specialite) {
        query += ' AND specialite LIKE ?';
        params.push(`%${criteria.specialite}%`);
      }
      
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Create a new artiste
  create: async (artisteData) => {
    try {
      const [result] = await pool.query(
        'INSERT INTO artiste (NomArt, PrenomArt, specialite, nom_art, prenom_art) VALUES (?, ?, ?, ?, ?)',
        [
          artisteData.NomArt, 
          artisteData.PrenomArt, 
          artisteData.specialite, 
          artisteData.nom_art || artisteData.NomArt, 
          artisteData.prenom_art || artisteData.PrenomArt
        ]
      );
      return { id: result.insertId, ...artisteData };
    } catch (error) {
      throw error;
    }
  },

  // Update an artiste
  update: async (id, artisteData) => {
    try {
      await pool.query(
        'UPDATE artiste SET NomArt = ?, PrenomArt = ?, specialite = ?, nom_art = ?, prenom_art = ? WHERE idArt = ?',
        [
          artisteData.NomArt, 
          artisteData.PrenomArt, 
          artisteData.specialite, 
          artisteData.nom_art || artisteData.NomArt, 
          artisteData.prenom_art || artisteData.PrenomArt, 
          id
        ]
      );
      return { id, ...artisteData };
    } catch (error) {
      throw error;
    }
  },

  // Delete an artiste
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM artiste WHERE idArt = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  },

  // Get spectacles for a specific artiste
  getSpectaclesByArtisteId: async (id) => {
    try {
      const [rows] = await pool.query(`
        SELECT DISTINCT s.* 
        FROM spectacle s
        INNER JOIN representation r ON s.idSpec = r.idSpec
        INNER JOIN rubrique rb ON r.idRep = rb.idRep
        WHERE rb.idArt = ? OR rb.id_art = ?
      `, [id, id]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get representations for a specific artiste
  getRepresentationsByArtisteId: async (id) => {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, s.titre, l.NomLieu, rb.type, rb.h_debutr, rb.duree_rub
        FROM representation r
        INNER JOIN spectacle s ON r.idSpec = s.idSpec
        INNER JOIN lieu l ON r.idLieu = l.idLieu
        INNER JOIN rubrique rb ON r.idRep = rb.idRep
        WHERE rb.idArt = ? OR rb.id_art = ?
      `, [id, id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Artiste;
