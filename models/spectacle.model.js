// Importation du pool de connexions à la base de données
import { pool } from '../config/db.config.js';

const Spectacle = {
  // Récupérer tous les spectacles
  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT s.*, l.NomLieu, l.adresse 
      FROM spectacle s 
      LEFT JOIN lieu l ON s.id_lieu = l.idLieu
    `);
    return rows;
  },

  // Récupérer un spectacle par ID
  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT s.*, l.NomLieu, l.adresse 
      FROM spectacle s 
      LEFT JOIN lieu l ON s.id_lieu = l.idLieu 
      WHERE s.idSpec = ?`, [id]);
    return rows[0];
  },

  // Recherche des spectacles selon des critères
  search: async (criteria) => {
    let query = `
      SELECT DISTINCT s.*, l.NomLieu, l.adresse 
      FROM spectacle s 
      LEFT JOIN lieu l ON s.id_lieu = l.idLieu
      LEFT JOIN representation r ON s.idSpec = r.idSpec 
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
      query += ' AND l.NomLieu LIKE ?';
      params.push(`%${criteria.nomlieu}%`);
    }

    if (criteria.ville) {
      query += ' AND l.adresse LIKE ?';
      params.push(`%${criteria.ville}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Créer un nouveau spectacle
  create: async (spectacleData) => {
    const [result] = await pool.query(`
      INSERT INTO spectacle (titre, Description, dates, durees, h_debut, nbr_spectateur, id_lieu) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        spectacleData.titre, 
        spectacleData.description, 
        spectacleData.dates, 
        spectacleData.durees, 
        spectacleData.h_debut, 
        spectacleData.nbr_spectateur, 
        spectacleData.id_lieu
      ]
    );
    return { id: result.insertId, ...spectacleData };
  },

  // Mettre à jour un spectacle
  update: async (id, spectacleData) => {
    await pool.query(`
      UPDATE spectacle 
      SET titre = ?, Description = ?, dates = ?, durees = ?, h_debut = ?, nbr_spectateur = ?, id_lieu = ? 
      WHERE idSpec = ?`,
      [
        spectacleData.titre, 
        spectacleData.description, 
        spectacleData.dates, 
        spectacleData.durees, 
        spectacleData.h_debut, 
        spectacleData.nbr_spectateur, 
        spectacleData.id_lieu,
        id
      ]
    );
    return { id, ...spectacleData };
  },

  // Supprimer un spectacle
  delete: async (id) => {
    await pool.query('DELETE FROM spectacle WHERE idSpec = ?', [id]);
    return { id };
  },

  // Trouver un spectacle avec tous les détails
  findWithDetails: async (id) => {
    const [spectacle] = await pool.query(`
      SELECT s.*, l.NomLieu, l.adresse 
      FROM spectacle s 
      LEFT JOIN lieu l ON s.id_lieu = l.idLieu 
      WHERE s.idSpec = ?`, 
      [id]
    );

    if (spectacle.length === 0) return null;

    const [representations] = await pool.query(`
      SELECT r.*, l.NomLieu, l.adresse 
      FROM representation r 
      LEFT JOIN lieu l ON r.idLieu = l.idLieu 
      WHERE r.idSpec = ?`, 
      [id]
    );

    const [artistes] = await pool.query(`
      SELECT DISTINCT a.* 
      FROM artiste a 
      INNER JOIN rubrique rb ON a.idArt = rb.idArt 
      INNER JOIN representation r ON r.idRep = rb.idRep 
      WHERE r.idSpec = ?`, 
      [id]
    );

    const [billets] = await pool.query(`
      SELECT COUNT(*) as available_tickets 
      FROM billet b 
      INNER JOIN representation r ON b.idRep = r.idRep 
      WHERE r.idSpec = ? AND b.vendu = 'non'`, 
      [id]
    );

    return {
      ...spectacle[0],
      representations,
      artistes,
      available_tickets: billets[0].available_tickets
    };
  }

  
};

// Exportation du modèle en utilisant la syntaxe ES
export default Spectacle;
