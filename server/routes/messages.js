import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// GET /messages/conversation?userId=&peerId=
router.get('/conversation', async (req, res) => {
  try {
    const { userId, peerId } = req.query;
    if (!userId || !peerId) {
      return res.status(400).json({ error: 'userId and peerId are required' });
    }

    const result = await pool.query(
      `SELECT id, sender_id, receiver_id, content
       FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY id ASC`,
      [userId, peerId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// POST /messages - Create a new message
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ error: 'senderId, receiverId and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, receiver_id, content`,
      [senderId, receiverId, content]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({ error: 'Failed to create message' });
  }
});

export default router;


