async function testPayment() {
  try {
    const loginRes = await fetch('http://localhost:3004/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'password' })
    });
    
    const cookies = loginRes.headers.get('set-cookie');
    console.log('Got cookie:', !!cookies);
    
    const processRes = await fetch('http://localhost:3004/api/pos/process-payment', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        items: [{id: 1, quantity: 1, price: 10, cartItemId: '1-none-', name: 'Test'}],
        payment_method: 1,
        grand_total: 10,
        tax_amount: 0,
        discount_amount: 0
      })
    });
    
    const data = await processRes.json();
    console.log('Payment response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}
testPayment();
