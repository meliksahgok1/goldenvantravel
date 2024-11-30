import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    await client.connect();
    const database = client.db('goldenvan');
    const translations = database.collection('translations');

    switch (event.httpMethod) {
      case 'GET':
        const result = await translations.findOne({});
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result?.data || {})
        };

      case 'POST':
        const { translations: newTranslations } = JSON.parse(event.body);
        await translations.updateOne(
          {},
          { $set: { data: newTranslations } },
          { upsert: true }
        );
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Translations updated successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Translations API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  } finally {
    await client.close();
  }
}