const fetch = require('node-fetch');

async function testOmniCall() {
  const response = await fetch('http://localhost:5050/dispatch_call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to_number: '+916377588366',  
      task: 'Book dentist appointment for next week'
    }),
  });

  const data = await response.json();
  console.log('Omni Call Response:', data);
}

testOmniCall();
