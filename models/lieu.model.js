import { pool } from '../config/db.config.js';

const parseRangsArchitecture = (value) => {
  try {
    if (typeof value === 'string') return JSON.parse(value);
    return value; // Déjà un objet ou null
  } catch (err) {
    console.error("Erreur JSON:", err.message);
    return null;
  }
};

// Lieu Model
const Lieu = {

  // Obtenir tous les lieux
  findAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM lieu');
      return rows.map(row => ({
        ...row,
        rangs_architecture: parseRangsArchitecture(row.rangs_architecture)
      }));
    } catch (error) {
      console.error("Erreur dans findAll:", error.message);
      throw error;
    }
  },

  // Obtenir un lieu par ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM lieu WHERE idLieu = ?', [id]);
      if (rows.length > 0) {
        const lieu = rows[0];
        lieu.rangs_architecture = parseRangsArchitecture(lieu.rangs_architecture);
        return lieu;
      }
      return null;
    } catch (error) {
      console.error("Erreur dans findById:", error.message);
      throw error;
    }
  },

  // Rechercher des lieux par nom ou ville
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
      return rows.map(row => ({
        ...row,
        rangs_architecture: parseRangsArchitecture(row.rangs_architecture)
      }));
    } catch (error) {
      console.error("Erreur dans search:", error.message);
      throw error;
    }
  },

  // Créer un nouveau lieu
  create: async (lieuData) => {
    if (!lieuData.NomLieu || !lieuData.adresse || !lieuData.capacite) {
      throw new Error("Les champs NomLieu, adresse et capacite sont obligatoires.");
    }

    try {
      const [result] = await pool.query(
        'INSERT INTO lieu (NomLieu, adresse, capacite, rangs_architecture) VALUES (?, ?, ?, ?)',
        [
          lieuData.NomLieu,
          lieuData.adresse,
          lieuData.capacite,
          JSON.stringify(lieuData.rangs_architecture || null)
        ]
      );
      return { id: result.insertId, ...lieuData };
    } catch (error) {
      console.error("Erreur dans create:", error.message);
      throw error;
    }
  },

  // Mettre à jour un lieu existant
  update: async (id, lieuData) => {
    try {
      await pool.query(
        'UPDATE lieu SET NomLieu = ?, adresse = ?, capacite = ?, rangs_architecture = ? WHERE idLieu = ?',
        [
          lieuData.NomLieu,
          lieuData.adresse,
          lieuData.capacite,
          JSON.stringify(lieuData.rangs_architecture || null),
          id
        ]
      );
      return { id, ...lieuData };
    } catch (error) {
      console.error("Erreur dans update:", error.message);
      throw error;
    }
  },

  // Supprimer un lieu
  delete: async (id) => {
    try {
      await pool.query('DELETE FROM lieu WHERE idLieu = ?', [id]);
      return { id };
    } catch (error) {
      console.error("Erreur dans delete:", error.message);
      throw error;
    }
  },

  // Obtenir les spectacles liés à un lieu
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
      console.error("Erreur dans getSpectaclesByLieuId:", error.message);
      throw error;
    }
  },

  // Obtenir les lieux associés à un spectacle
 // Obtenir les lieux associés à un spectacle
getLieuBySpectacleId: async (spectacleId) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.* 
      FROM lieu l
      INNER JOIN spectacle s ON l.idLieu = s.id_lieu
      WHERE s.idSpec = ?
    `, [spectacleId]);

    return rows.map(row => ({
      ...row,
      rangs_architecture: parseRangsArchitecture(row.rangs_architecture)
    }));
  } catch (error) {
    console.error("Erreur dans getLieuxBySpectacleId:", error.message);
    throw error;
  }
}

};

export default Lieu;
