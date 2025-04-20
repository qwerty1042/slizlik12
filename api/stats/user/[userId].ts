import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const db = client.db('slizlik');
      const users = db.collection('users');

      const { userId } = req.query;
      
      let userStats = await users.findOne({ userId });
      
      if (!userStats) {
        // Get nickname from query params
        const nickname = req.query.nickname as string;
        
        userStats = {
          userId,
          nickname,
          classic: { clicks: 0, lastUpdated: Date.now() },
          bdsm: { clicks: 0, lastUpdated: Date.now() },
          slot: { clicks: 0, lastUpdated: Date.now() }
        };
        await users.insertOne(userStats);
      }

      res.status(200).json(userStats);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch user stats' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 