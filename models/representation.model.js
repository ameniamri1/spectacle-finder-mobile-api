
const { pool } = require('../config/db.config');

// Representation Model
const Representation = {
  // Get all representations
  findAll: async () => {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, s.titre, l.NomLieu, l.adresse 
        FROM representation r 
        LEFT JOIN spectacle s ON r.idSpec = s.idSpec 
        LEFT JOIN lieu l ON r.idLieu = l.idLieu
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get a representation by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, s.titre, l.NomLieu, l.adresse 
        FROM representation r 
        LEFT JOIN spectacle s ON r.idSpec = s.idSpec 
        LEFT JOIN lieu l ON r.idLieu = l.idLieu 
        WHERE r.idRep = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get representations by spectacle ID
  findBySpectacle: async (spectacleId) => {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, l.NomLieu, l.adresse 
        FROM representation r 
        LEFT JOIN lieu l ON r.idLieu = l.idLieu 
        WHERE r.idSpec = ?
      `, [spectacleId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get representations by lieu ID
  findByLieu: async (lieuId) => {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, s.titre 
        FROM representation r 
        LEFT JOIN spectacle s ON r.idSpec = s.idSpec 
        WHERE r.idLieu = ?
      `, [lieuId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get representations by date
  findByDate: async (date) => {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, s.titre, l.NomLieu, l.adresse 
        FROM representation r 
        LEFT JOIN spectacle s ON r.idSpec = s.idSpec 
        LEFT JOIN lieu l ON r.idLieu = l.idLieu 
        WHERE r.dateS = ?
      `, [date]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Create a new representation
  create: async (representationData) => {
    try {
      const [result] = await pool.query(
        'INSERT INTO representation (idSpec, dateS, h_debut, duree, idLieu) VALUES (?, ?, ?, ?, ?)',
        [
          representationData.idSpec, 
          representationData.dateS, 
          representationData.h_debut, 
          representationData.duree, 
          representationData.idLieu
        ]
      );
      return { id: result.insertId, ...representationData };
    } catch (error) {
      throw error;
    }
  },

  // Update a representation
  update: async (id, representationData) => {
    try {
      await pool.query(
        'UPDATE representation SET idSpec = ?, dateS = ?, h_debut = ?, duree = ?, idLieu = ? WHERE idRep = ?',
        [
          representationData.idSpec, 
          representationData.dateS, 
          representationData.h_debut, 
          representationData.duree, 
          representationData.idLieu, 
          id
        ]
      );
      return { id, ...representationData };
    } catch (error) {
      throw error;
    }
  },

  // Delete a representation
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM representation WHERE idRep = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  },

  // Get representation with details (including available billets)
  findWithDetails: async (id) => {
    try {
      // Get representation info
      const [representation] = await pool.query(`
        SELECT r.*, s.titre, s.Description, l.NomLieu, l.adresse, l.capacite 
        FROM representation r 
        LEFT JOIN spectacle s ON r.idSpec = s.idSpec 
        LEFT JOIN lieu l ON r.idLieu = l.idLieu 
        WHERE r.idRep = ?
      `, [id]);
      
      if (representation.length === 0) return null;
      
      // Get available billets count
      const [billets] = await pool.query(`
        SELECT COUNT(*) as total_billets,
        SUM(CASE WHEN vendu = 'oui' THEN 1 ELSE 0 END) as billets_vendus,
        SUM(CASE WHEN vendu != 'oui' OR vendu IS NULL THEN 1 ELSE 0 END) as billets_disponibles
        FROM billet
        WHERE idRep = ?
      `, [id]);
      
      // Get artistes
      const [artistes] = await pool.query(`
        SELECT a.*, r.type, r.h_debutr, r.duree_rub 
        FROM artiste a
        INNER JOIN rubrique r ON a.idArt = r.idArt
        WHERE r.idRep = ?
      `, [id]);
      
      return {
        ...representation[0],
        billets: {
          total: billets[0].total_billets,
          vendus: billets[0].billets_vendus,
          disponibles: billets[0].billets_disponibles
        },
        artistes
      };
    } catch (error) {
      throw error;
    }
  },

  // Search representations by criteria
  search: async (criteria) => {
    try {
      let query = `
        SELECT r.*, s.titre, l.NomLieu, l.adresse 
        FROM representation r 
        LEFT JOIN spectacle s ON r.idSpec = s.idSpec 
        LEFT JOIN lieu l ON r.idLieu = l.idLieu 
        WHERE 1=1
      `;
      
      const params = [];
      
      if (criteria.titre) {
        query += ' AND s.titre LIKE ?';
        params.push(`%${criteria.titre}%`);
      }
      
      if (criteria.dateS) {
        query += ' AND r.dateS = ?';
        params.push(criteria.dateS);
      }
      
      if (criteria.h_debut) {
        query += ' AND r.h_debut = ?';
        params.push(criteria.h_debut);
      }
      
      if (criteria.nomlieu) {
        query += ' AND (l.NomLieu LIKE ? OR l.nom_lieu LIKE ?)';
        params.push(`%${criteria.nomlieu}%`, `%${criteria.nomlieu}%`);
      }
      
      if (criteria.ville) {
        query += ' AND l.adresse LIKE ?';
        params.push(`%${criteria.ville}%`);
      }
      
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Representation;
