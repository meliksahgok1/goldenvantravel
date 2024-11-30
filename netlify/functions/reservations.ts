import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export const handler: Handler = async (event) => {
  try {
    await client.connect();
    const database = client.db('goldenvan');
    const reservations = database.collection('reservations');

    switch (event.httpMethod) {
      case 'GET':
        const result = await reservations.find({}).toArray();
        return {
          statusCode: 200,
          body: JSON.stringify(result)
        };

      case 'POST':
        const data = JSON.parse(event.body);
        const newReservation = await reservations.insertOne(data);
        return {
          statusCode: 201,
          body: JSON.stringify(newReservation)
        };

      default:
        return {
          statusCode: 405,
          body: 'Method Not Allowed'
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  } finally {
    await client.close();
  }
}