import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

interface Location {
  lat: number;
  lng: number;
}

interface DistanceRequest {
  origin: Location;
  destination: Location;
}

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

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
    const { origin, destination }: DistanceRequest = JSON.parse(event.body);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error('Failed to calculate distance');
    }

    const distance = data.rows[0].elements[0].distance.value / 1000; // Convert to kilometers
    const duration = data.rows[0].elements[0].duration.value / 60; // Convert to minutes

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        distance,
        duration,
        unit: 'km'
      })
    };

  } catch (error) {
    console.error('Distance API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler };