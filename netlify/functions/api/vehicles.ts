import { Handler } from '@netlify/functions';
import { MongoClient, ObjectId } from 'mongodb';
import { withAuth } from '../middleware';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

interface Vehicle {
  name: string;
  type: string;
  capacity: number;
  basePrice: number;
  pricePerKm: number;
  features: string[];
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    await client.connect();
    const database = client.db('goldenvan');
    const vehicles = database.collection<Vehicle>('vehicles');

    switch (event.httpMethod) {
      case 'GET':
        if (event.queryStringParameters?.id) {
          const vehicle = await vehicles.findOne({
            _id: new ObjectId(event.queryStringParameters.id)
          });
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(vehicle)
          };
        }

        const query = event.queryStringParameters?.active 
          ? { isActive: true }
          : {};

        const result = await vehicles.find(query).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        };

      case 'POST':
        const newVehicle: Partial<Vehicle> = JSON.parse(event.body);
        
        const insertData = {
          ...newVehicle,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const { insertedId } = await vehicles.insertOne(insertData);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            id: insertedId,
            message: 'Vehicle created successfully'
          })
        };

      case 'PUT':
        const { id, ...updateData } = JSON.parse(event.body);
        
        const updateResult = await vehicles.updateOne(
          { _id: new ObjectId(id) },
          { 
            $set: {
              ...updateData,
              updatedAt: new Date()
            }
          }
        );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Vehicle updated successfully',
            modifiedCount: updateResult.modifiedCount
          })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Vehicle ID is required' })
          };
        }

        await vehicles.deleteOne({ _id: new ObjectId(deleteId) });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Vehicle deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Vehicle API Error:', error);
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
};

// Protected routes for admin operations
export const adminHandler = withAuth(handler);
// Public routes for vehicle listing
export { handler };