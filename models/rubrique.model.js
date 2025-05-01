import { pool } from '../config/db.config.js';

// Rubrique Model
const Rubrique = {
  // Get all rubriques
  findAll: async () => {
    try {
      const [rows] = await pool.query(`
        SELECT rb.*, a.NomArt, a.PrenomArt, a.specialite, r.dateS 
        FROM rubrique rb 
        LEFT JOIN artiste a ON rb.idArt = a.idArt
        LEFT JOIN representation r ON rb.idRep = r.idRep
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get a rubrique by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query(`
        SELECT rb.*, a.NomArt, a.PrenomArt, a.specialite, r.dateS 
        FROM rubrique rb 
        LEFT JOIN artiste a ON rb.idArt = a.idArt
        LEFT JOIN representation r ON rb.idRep = r.idRep
        WHERE rb.idRub = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get rubriques by representation ID
  findByRepresentation: async (repId) => {
    try {
      const [rows] = await pool.query(`
        SELECT rb.*, a.NomArt, a.PrenomArt, a.specialite 
        FROM rubrique rb 
        LEFT JOIN artiste a ON rb.idArt = a.idArt
        WHERE rb.idRep = ?
      `, [repId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get rubriques by artiste ID
  findByArtiste: async (artisteId) => {
    try {
      const [rows] = await pool.query(`
        SELECT rb.*, r.dateS, s.titre 
        FROM rubrique rb 
        LEFT JOIN representation r ON rb.idRep = r.idRep
        LEFT JOIN spectacle s ON r.idSpec = s.idSpec
        WHERE rb.idArt = ?
      `, [artisteId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Create a new rubrique
  create: async (rubriqueData) => {
    try {
      const [result] = await pool.query(
        `INSERT INTO rubrique (idRep, idArt, h_debutr, dureeRub, type, duree_rub, id_spec)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          rubriqueData.idRep,
          rubriqueData.idArt,
          rubriqueData.h_debutr,
          rubriqueData.dureeRub,
          rubriqueData.type,
          rubriqueData.duree_rub,
          rubriqueData.id_spec
        ]
      );
      return { id: result.insertId, ...rubriqueData };
    } catch (error) {
      throw error;
    }
  },

  // Update a rubrique
  update: async (id, rubriqueData) => {
    try {
      await pool.query(
        `UPDATE rubrique SET idRep = ?, idArt = ?, h_debutr = ?, dureeRub = ?, type = ?, duree_rub = ?, id_spec = ? 
         WHERE idRub = ?`,
        [
          rubriqueData.idRep,
          rubriqueData.idArt,
          rubriqueData.h_debutr,
          rubriqueData.dureeRub,
          rubriqueData.type,
          rubriqueData.duree_rub,
          rubriqueData.id_spec,
          id
        ]
      );
      return { id, ...rubriqueData };
    } catch (error) {
      throw error;
    }
  },

  // Delete a rubrique
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM rubrique WHERE idRub = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }
};

export default Rubrique;
