async function testItemDetails() {
  try {
    const loginRes = await fetch('http://localhost:3004/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'password' })
    });
    
    const cookies = loginRes.headers.get('set-cookie');
    
    const itemRes = await fetch('http://localhost:3004/api/pos/item-details?item_id=1', {
      method: 'GET',
      headers: { 
        'Cookie': cookies
      }
    });
    
    const text = await itemRes.text();
    console.log('Response HTTP Status:', itemRes.status);
    console.log('Item details response:', text.substring(0, 500));
  } catch (err) {
    console.error('Error:', err);
  }
}
testItemDetails();
