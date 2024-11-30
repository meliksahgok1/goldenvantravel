import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(uri);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    await client.connect();
    const database = client.db('goldenvan');
    await database.command({ ping: 1 });

    const collections = await database.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Successfully connected to MongoDB!',
        database: 'goldenvan',
        collections: collectionNames,
        status: 'success'
      })
    };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to connect to MongoDB',
        details: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      })
    };
  } finally {
    await client.close();
  }
}