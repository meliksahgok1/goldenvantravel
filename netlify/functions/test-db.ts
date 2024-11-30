import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(uri);

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    
    const database = client.db('goldenvan');
    await database.command({ ping: 1 });
    
    console.log('Successfully connected to MongoDB.');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Successfully connected to MongoDB!',
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