const http = require('http');

// First get restaurants
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
      console.log('RESTAURANTS: ' + restaurants.length);
      
      // Test menu API for first restaurant
      if (restaurants.length > 0) {
        const restId = restaurants[0]._id;
        console.log('\nTesting menu for: ' + restaurants[0].name + ' (ID: ' + restId + ')');
        
        const menuOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/menu/restaurant/' + restId,
          method: 'GET'
        };
        
        const menuReq = http.request(menuOptions, (menuRes) => {
          let menuData = '';
          menuRes.on('data', (chunk) => {
            menuData += chunk;
          });
          menuRes.on('end', () => {
            try {
              const items = JSON.parse(menuData);
              console.log('\n✓ Menu API Status: ' + menuRes.statusCode);
              console.log('✓ Menu items returned: ' + items.length);
              if (items.length > 0) {
                const first = items[0];
                console.log('\n  First menu item:');
                console.log('    - Name: ' + first.name);
                console.log('    - Price: ₹' + first.price);
                console.log('    - Image URL: ' + (first.image ? first.image.substring(0, 50) + '...' : 'NO IMAGE'));
              }
            } catch (e) {
              console.log('Error parsing menu: ' + e.message);
            }
          });
        });
        
        menuReq.on('error', (e) => {
          console.log('Menu API Error: ' + e.message);
        });
        
        menuReq.end();
      }
    } catch (e) {
      console.log('Error: ' + e.message);
    }
  });
});

req.on('error', (e) => {
  console.log('API Error: ' + e.message);
});

req.end();
