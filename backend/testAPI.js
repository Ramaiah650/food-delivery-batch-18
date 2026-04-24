const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/restaurants',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const restaurants = JSON.parse(data);
      console.log('API Status: OK');
      console.log('Restaurants returned: ' + restaurants.length);
      if (restaurants.length > 0) {
        const first = restaurants[0];
        console.log('\nFirst restaurant:');
        console.log('  - Name: ' + first.name);
        console.log('  - ID: ' + first._id);
        console.log('  - Has ID: ' + (first._id ? 'YES' : 'NO'));
      }
    } catch (e) {
      console.log('Error parsing response: ' + e.message);
    }
  });
});

req.on('error', (e) => {
  console.log('API Error: ' + e.message);
});

req.end();
