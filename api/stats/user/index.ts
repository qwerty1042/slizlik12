import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const db = client.db('slizlik');
      const users = db.collection('users');
      const globalStats = db.collection('stats');

      const { userId, mode, timestamp, nickname } = req.body;

      // Update or create user stats
      await users.updateOne(
        { userId },
        {
          $inc: { [`${mode}.clicks`]: 1 },
          $set: { 
            [`${mode}.lastUpdated`]: timestamp,
            nickname: nickname // Save or update nickname
          }
        },
        { upsert: true }
      );

      // Update global stats
      await globalStats.updateOne(
        { _id: 'global' },
        { $inc: { [`${mode}.totalClicks`]: 1 } },
        { upsert: true }
      );

      // Get updated global stats
      const updatedStats = await globalStats.findOne({ _id: 'global' });
      res.status(200).json(updatedStats);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to update stats' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 