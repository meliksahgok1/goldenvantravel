import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(uri);

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  role: 'admin'
};

export const handler: Handler = async () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    await client.connect();
    const database = client.db('goldenvan');
    const users = database.collection('users');

    // Check if admin user exists
    const adminExists = await users.findOne({ username: DEFAULT_ADMIN.username });
    
    if (!adminExists) {
      // Hash password and create admin user
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      await users.insertOne({
        username: DEFAULT_ADMIN.username,
        password: hashedPassword,
        role: DEFAULT_ADMIN.role,
        createdAt: new Date()
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Admin user created successfully',
          status: 'success'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Admin user already exists',
        status: 'success'
      })
    };

  } catch (error) {
    console.error('Setup error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      })
    };
  } finally {
    await client.close();
  }
}