import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

interface PricingRequest {
  vehicleType: string;
  distance: number;
  date: string;
  passengers: number;
}

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    const vehicles = database.collection('vehicles');
    const settings = database.collection('settings');

    const request: PricingRequest = JSON.parse(event.body);
    
    // Get vehicle base pricing
    const vehicle = await vehicles.findOne({ type: request.vehicleType });
    if (!vehicle) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid vehicle type' })
      };
    }

    // Get pricing settings
    const pricingSettings = await settings.findOne({ type: 'pricing' });
    
    // Calculate base price
    let totalPrice = vehicle.basePrice;
    
    // Add distance-based price
    totalPrice += request.distance * vehicle.pricePerKm;
    
    // Apply seasonal multiplier if exists
    const seasonalMultiplier = getSeasonalMultiplier(request.date, pricingSettings?.seasonalMultipliers);
    totalPrice *= seasonalMultiplier;
    
    // Apply passenger surcharge if applicable
    if (request.passengers > vehicle.capacity) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Passenger count exceeds vehicle capacity' })
      };
    }
    
    // Round to 2 decimal places
    totalPrice = Math.round(totalPrice * 100) / 100;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        basePrice: vehicle.basePrice,
        distancePrice: request.distance * vehicle.pricePerKm,
        seasonalMultiplier,
        totalPrice,
        currency: 'TRY'
      })
    };

  } catch (error) {
    console.error('Pricing API Error:', error);
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

function getSeasonalMultiplier(date: string, multipliers: any = {}): number {
  const bookingDate = new Date(date);
  const month = bookingDate.getMonth();
  
  // Default multiplier if no seasonal pricing is set
  if (!multipliers || Object.keys(multipliers).length === 0) {
    return 1;
  }
  
  return multipliers[month] || 1;
}

export { handler };