import { pool } from '../config/db.config.js';

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
      console.error("Error fetching all representations: ", error.message);
      throw new Error("Unable to fetch representations.");
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
      if (rows.length === 0) {
        throw new Error("Representation not found");
      }
      return rows[0];
    } catch (error) {
      console.error("Error fetching representation by ID: ", error.message);
      throw new Error("Unable to fetch representation by ID.");
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
      console.error("Error fetching representations by spectacle ID: ", error.message);
      throw new Error("Unable to fetch representations by spectacle ID.");
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
      console.error("Error fetching representations by lieu ID: ", error.message);
      throw new Error("Unable to fetch representations by lieu ID.");
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
      console.error("Error fetching representations by date: ", error.message);
      throw new Error("Unable to fetch representations by date.");
    }
  },

  // Create a new representation
  create: async (representationData) => {
    try {
      const { idSpec, dateS, h_debut, duree, idLieu } = representationData;
      const [result] = await pool.query(
        'INSERT INTO representation (idSpec, dateS, h_debut, duree, idLieu) VALUES (?, ?, ?, ?, ?)',
        [idSpec, dateS, h_debut, duree, idLieu]
      );
      return { id: result.insertId, ...representationData };
    } catch (error) {
      console.error("Error creating representation: ", error.message);
      throw new Error("Unable to create representation.");
    }
  },

  // Update a representation
  update: async (id, representationData) => {
    try {
      const { idSpec, dateS, h_debut, duree, idLieu } = representationData;
      const [result] = await pool.query(
        'UPDATE representation SET idSpec = ?, dateS = ?, h_debut = ?, duree = ?, idLieu = ? WHERE idRep = ?',
        [idSpec, dateS, h_debut, duree, idLieu, id]
      );
      if (result.affectedRows === 0) {
        throw new Error("Representation not found or not updated.");
      }
      return { id, ...representationData };
    } catch (error) {
      console.error("Error updating representation: ", error.message);
      throw new Error("Unable to update representation.");
    }
  },

  // Delete a representation
  delete: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM representation WHERE idRep = ?', [id]);
      if (result.affectedRows === 0) {
        throw new Error("Representation not found or not deleted.");
      }
      return { id };
    } catch (error) {
      console.error("Error deleting representation: ", error.message);
      throw new Error("Unable to delete representation.");
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
      console.error("Error fetching representation details: ", error.message);
      throw new Error("Unable to fetch representation details.");
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
      console.error("Error searching representations: ", error.message);
      throw new Error("Unable to search representations.");
    }
  }
};

export default Representation;
