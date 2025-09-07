import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// Create or fetch a user by username
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'username is required' });
    }

    const result = await pool.query(
      `INSERT INTO users (username)
       VALUES ($1)
       ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
       RETURNING id, username`,
      [username]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error upserting user:', error);
    return res.status(500).json({ error: 'Failed to upsert user' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username FROM users ORDER BY username ASC'
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a user by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;


