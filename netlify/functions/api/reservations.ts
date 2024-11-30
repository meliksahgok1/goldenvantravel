import { Handler } from '@netlify/functions';
import { MongoClient, ObjectId } from 'mongodb';
import { withAuth } from '../middleware';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

interface Reservation {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  dropoffLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  date: string;
  time: string;
  passengers: number;
  vehicleType: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
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
    const reservations = database.collection<Reservation>('reservations');

    switch (event.httpMethod) {
      case 'GET':
        if (event.queryStringParameters?.id) {
          const reservation = await reservations.findOne({
            _id: new ObjectId(event.queryStringParameters.id)
          });
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(reservation)
          };
        }

        const result = await reservations.find({}).sort({ createdAt: -1 }).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result)
        };

      case 'POST':
        const newReservation: Partial<Reservation> = JSON.parse(event.body);
        
        const insertData = {
          ...newReservation,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const { insertedId } = await reservations.insertOne(insertData);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ 
            id: insertedId,
            message: 'Reservation created successfully' 
          })
        };

      case 'PUT':
        const { id, ...updateData } = JSON.parse(event.body);
        
        const result = await reservations.updateOne(
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
            message: 'Reservation updated successfully',
            modifiedCount: result.modifiedCount
          })
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Reservation ID is required' })
          };
        }

        await reservations.deleteOne({ _id: new ObjectId(deleteId) });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Reservation deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Reservation API Error:', error);
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
// Public routes for customer reservations
export { handler };