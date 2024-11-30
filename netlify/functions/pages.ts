import { Handler } from '@netlify/functions';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  try {
    await client.connect();
    const database = client.db('goldenvan');
    const pages = database.collection('pages');

    switch (event.httpMethod) {
      case 'GET':
        if (event.path.includes('/pages/')) {
          const id = event.path.split('/').pop();
          const page = await pages.findOne({ _id: new ObjectId(id) });
          
          if (!page) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Page not found' })
            };
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(page)
          };
        }

        const result = await pages.find({}).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        };

      case 'POST':
        const newPage = JSON.parse(event.body || '{}');
        
        if (!newPage.title || !newPage.slug) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Title and slug are required' })
          };
        }

        const insertResult = await pages.insertOne({
          ...newPage,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            _id: insertResult.insertedId,
            message: 'Page created successfully'
          })
        };

      case 'PUT':
        const { _id, ...updateData } = JSON.parse(event.body || '{}');
        
        if (!_id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Page ID is required' })
          };
        }

        const updateResult = await pages.updateOne(
          { _id: new ObjectId(_id) },
          { 
            $set: {
              ...updateData,
              updatedAt: new Date()
            }
          }
        );

        if (updateResult.matchedCount === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Page not found' })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Page updated successfully',
            modifiedCount: updateResult.modifiedCount
          })
        };

      case 'DELETE':
        const deleteId = event.path.split('/').pop();
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Page ID is required' })
          };
        }

        const deleteResult = await pages.deleteOne({ _id: new ObjectId(deleteId) });

        if (deleteResult.deletedCount === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Page not found' })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Page deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Pages API Error:', error);
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