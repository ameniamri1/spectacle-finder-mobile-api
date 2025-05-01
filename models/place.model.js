// Importation du pool de connexions à la base de données
import { pool } from '../config/db.config.js';

const Place = {
  // Récupérer toutes les places
  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT p.*, s.titre AS spectacle_titre 
      FROM place p
      LEFT JOIN spectacle s ON p.spectacle_id = s.idSpec
    `);
    return rows;
  },


  // Vérifier si une place est disponible pour un spectacle donné
isAvailable: async (numero, section, rang, spectacle_id) => {
  const [rows] = await pool.query(`
    SELECT * FROM place 
    WHERE numero = ? AND section = ? AND rang = ? AND spectacle_id = ? AND est_reservee = 0
  `, [numero, section, rang, spectacle_id]);

  return rows.length > 0;
},
// Réserver une place en la marquant comme réservée et en ajoutant la date de réservation
reserve: async (id) => {
  const [result] = await pool.query(`
    UPDATE place 
    SET est_reservee = 1, date_reservation = NOW() 
    WHERE idPlace = ? AND est_reservee = 0
  `, [id]);

  if (result.affectedRows === 0) {
    throw new Error("La place est déjà réservée ou n'existe pas.");
  }

  return { success: true, id };
},

  // Récupérer une place par ID
  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT p.*, s.titre AS spectacle_titre
      FROM place p
      LEFT JOIN spectacle s ON p.spectacle_id = s.idSpec
      WHERE p.idPlace = ?`, [id]);
    return rows[0];
  },

  // Créer une nouvelle place
  create: async (placeData) => {
    const { numero, section, rang, est_reservee, date_reservation, spectacle_id } = placeData;
    const [result] = await pool.query(`
      INSERT INTO place (numero, section, rang, est_reservee, date_reservation, spectacle_id) 
      VALUES (?, ?, ?, ?, ?, ?)`, 
      [numero, section, rang, est_reservee, date_reservation, spectacle_id]
    );
    return { id: result.insertId, ...placeData };
  },

  // Mettre à jour une place
  update: async (id, placeData) => {
    const { numero, section, rang, est_reservee, date_reservation, spectacle_id } = placeData;
    await pool.query(`
      UPDATE place 
      SET numero = ?, section = ?, rang = ?, est_reservee = ?, date_reservation = ?, spectacle_id = ? 
      WHERE idPlace = ?`, 
      [numero, section, rang, est_reservee, date_reservation, spectacle_id, id]
    );
    return { id, ...placeData };
  },

  // Supprimer une place
  delete: async (id) => {
    await pool.query('DELETE FROM place WHERE idPlace = ?', [id]);
    return { id };
  },

  // Recherche des places selon des critères
  search: async (criteria) => {
    let query = `
      SELECT p.*, s.titre AS spectacle_titre
      FROM place p
      LEFT JOIN spectacle s ON p.spectacle_id = s.idSpec
      WHERE 1=1
    `;
    const params = [];

    if (criteria.numero) {
      query += ' AND p.numero LIKE ?';
      params.push(`%${criteria.numero}%`);
    }

    if (criteria.section) {
      query += ' AND p.section LIKE ?';
      params.push(`%${criteria.section}%`);
    }

    if (criteria.spectacle_id) {
      query += ' AND p.spectacle_id = ?';
      params.push(criteria.spectacle_id);
    }

    if (criteria.est_reservee !== undefined) {
      query += ' AND p.est_reservee = ?';
      params.push(criteria.est_reservee);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Trouver une place avec tous les détails
  findWithDetails: async (id) => {
    const [place] = await pool.query(`
      SELECT p.*, s.titre AS spectacle_titre 
      FROM place p 
      LEFT JOIN spectacle s ON p.spectacle_id = s.idSpec
      WHERE p.idPlace = ?`, [id]);

    if (place.length === 0) return null;

    return place[0];
  }
};

export default Place;
