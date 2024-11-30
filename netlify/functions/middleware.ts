import { Handler, HandlerEvent } from '@netlify/functions';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const withAuth = (handler: Handler): Handler => {
  return async (event: HandlerEvent) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers, body: '' };
    }

    try {
      const token = event.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'No token provided' })
        };
      }

      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      event.context = { ...event.context, user: decoded };
      
      return await handler(event);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid token' })
        };
      }

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  };
};