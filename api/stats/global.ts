import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const db = client.db('slizlik');
      const globalStats = db.collection('stats');

      let stats = await globalStats.findOne({ _id: 'global' });
      
      if (!stats) {
        stats = {
          _id: 'global',
          classic: { totalClicks: 0 },
          bdsm: { totalClicks: 0 },
          slot: { totalClicks: 0 }
        };
        await globalStats.insertOne(stats);
      }

      res.status(200).json(stats);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch global stats' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 