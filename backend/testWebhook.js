const axios = require('axios');
const crypto = require('crypto');

// Simulate a payment.captured webhook payload
const payload = {
  event: 'payment.captured',
  payload: {
    payment: {
      entity: {
        id: 'pay_test123',
        method: 'card',
        status: 'captured',
        amount: 10000, // in paise (₹100)
        email: 'customer@example.com',
        notes: {
          userId: 'YOUR_VALID_USER_ID', // <-- Replace with a real userId from your DB
          address: JSON.stringify({ street: '123 Main St', city: 'Testville' })
        }
      }
    }
  }
};

const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '7862822';
const body = JSON.stringify(payload);
const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');

axios.post('http://localhost:5000/api/webhook', payload, {
  headers: {
    'Content-Type': 'application/json',
    'x-razorpay-signature': signature
  }
})
.then(res => {
  console.log('Webhook test response:', res.data);
})
.catch(err => {
  if (err.response) {
    console.error('Webhook test error:', err.response.data);
  } else {
    console.error('Webhook test error:', err.message);
  }
}); 
