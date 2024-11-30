import { Handler } from '@netlify/functions';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    await client.connect();
    const database = client.db('goldenvan');
    const reservations = database.collection('reservations');
    const payments = database.collection('payments');

    const webhookData = JSON.parse(event.body);
    const { 
      paymentId, 
      status, 
      reservationId,
      transactionId 
    } = webhookData;

    // Record payment status
    await payments.updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status,
          transactionId,
          updatedAt: new Date()
        }
      }
    );

    // Update reservation status
    if (status === 'SUCCESS') {
      await reservations.updateOne(
        { _id: new ObjectId(reservationId) },
        {
          $set: {
            status: 'confirmed',
            paymentStatus: 'paid',
            updatedAt: new Date()
          }
        }
      );
    } else {
      await reservations.updateOne(
        { _id: new ObjectId(reservationId) },
        {
          $set: {
            paymentStatus: 'failed',
            updatedAt: new Date()
          }
        }
      );
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Webhook processed successfully' })
    };

  } catch (error) {
    console.error('Payment Webhook Error:', error);
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

export { handler };