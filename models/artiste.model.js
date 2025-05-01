import { pool } from '../config/db.config.js';

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
      const [rows] = await pool.query('SELECT * FROM artiste WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Search artistes by name, prenom or speciality
  search: async (criteria) => {
    try {
      let query = 'SELECT * FROM artiste WHERE 1=1';
      const params = [];
      
      if (criteria.nom) {
        query += ' AND nom LIKE ?';
        params.push(`%${criteria.nom}%`);
      }
      
      if (criteria.prenom) {
        query += ' AND prenom LIKE ?';
        params.push(`%${criteria.prenom}%`);
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

  // Check if artiste is available at specific date and time
  checkAvailability: async (artisteId, date, startTime, duration) => {
    try {
      const [conflicts] = await pool.query(`
        SELECT r.* 
        FROM representation r
        INNER JOIN rubrique rb ON r.idRep = rb.idRep
        WHERE rb.idArt = ? 
        AND r.dateS = ? 
        AND (
          (r.h_debut <= ? AND ADDTIME(r.h_debut, r.duree) > ?) 
          OR (r.h_debut < ADDTIME(?, ?) AND ADDTIME(r.h_debut, r.duree) >= ADDTIME(?, ?))
        )
      `, [artisteId, date, startTime, startTime, startTime, duration, startTime, duration]);
      
      return conflicts.length === 0;
    } catch (error) {
      throw error;
    }
  },

  // Create a new artiste
  create: async (artisteData) => {
    try {
      const [result] = await pool.query(
        'INSERT INTO artiste (nom, prenom, specialite) VALUES (?, ?, ?)',
        [artisteData.nom, artisteData.prenom, artisteData.specialite]
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
        'UPDATE artiste SET nom = ?, prenom = ?, specialite = ? WHERE id = ?',
        [artisteData.nom, artisteData.prenom, artisteData.specialite, id]
      );
      return { id, ...artisteData };
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
        WHERE rb.idArt = ?
      `, [id]);
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
        WHERE rb.idArt = ?
      `, [id]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Delete an artiste
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM artiste WHERE id = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }
};

export default Artiste;
