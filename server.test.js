const request = require('supertest');
const server = require('./server');

describe('GET /', function() {
  test('responds with json', function() {
    request(server)
      .get('/')
      .expect(200);
  });
});


// function multiplier(a, b) {
//   return a*b;
// }
//
// test ('multiplier works correctly', function(){
//   expect(multiplier(2,2)).toBe(4);
//   expect(multiplier(0,5)).toBe(4);
//   expect(multiplier(2,3)).toBe(6);
//   expect(multiplier(1,2)).toBe(2);
// })
