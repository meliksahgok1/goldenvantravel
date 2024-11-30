import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const settings = database.collection('settings');

    switch (event.httpMethod) {
      case 'GET':
        const result = await settings.findOne({});
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result || {
            companyName: 'GoldenVan Travel',
            email: 'info@goldenvan.com',
            phone: '+90 555 123 4567',
            address: 'İstanbul, Türkiye',
            socialMedia: {
              facebook: '',
              instagram: '',
              twitter: ''
            },
            contact: {
              whatsapp: '',
              telegram: ''
            },
            seo: {
              title: 'GoldenVan Travel - VIP Transfer Hizmetleri',
              description: 'Lüks ve konforlu transfer hizmetleri',
              keywords: 'transfer, vip transfer, havalimanı transfer'
            },
            pricing: {
              basePrice: '500',
              pricePerKm: '5',
              currency: 'TRY'
            }
          })
        };

      case 'PUT':
        const data = JSON.parse(event.body);
        await settings.updateOne({}, { $set: data }, { upsert: true });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Settings updated successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Settings API Error:', error);
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