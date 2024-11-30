import { Handler } from '@netlify/functions';
import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { price, card, buyer } = JSON.parse(event.body);

    const request = {
      locale: 'tr',
      conversationId: new Date().getTime().toString(),
      price: price,
      paidPrice: price,
      currency: 'TRY',
      installment: '1',
      basketId: 'B67832',
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: card,
      buyer: buyer,
      shippingAddress: {
        contactName: buyer.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: buyer.address
      },
      billingAddress: {
        contactName: buyer.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: buyer.address
      },
      basketItems: [
        {
          id: 'Transfer-' + new Date().getTime(),
          name: 'Transfer Hizmeti',
          category1: 'Transfer',
          itemType: 'VIRTUAL',
          price: price
        }
      ]
    };

    return new Promise((resolve) => {
      iyzipay.payment.create(request, (err, result) => {
        if (err) {
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
          });
        } else {
          resolve({
            statusCode: 200,
            body: JSON.stringify(result)
          });
        }
      });
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}