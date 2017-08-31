// Let's get started by writing a test for a hypothetical function that adds two numbers. First, create a sum.js file:
// function sum(a, b) {
//   return a + b;
// }
// module.exports = sum;
// Then, create a file named sum.test.js. This will contain our actual test:
// const sum = require('./sum');
//
// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });
//
// Finally, run npm test and Jest will print this message:
// PASS  ./sum.test.js
// ✓ adds 1 + 2 to equal 3 (5ms)

const server = require('./server');

test('Able to register username and password.', () => {
  expect().toBe();
})

//how to know which function im running?
////////////////////////////////////////////////////////////

function multiplier(a, b) {
  return a*b;
}

test ('multiplier works correctly', function(){
  expect(multiplier(2,2)).toBe(4);
  expect(multiplier(0,5)).toBe(4);
  expect(multiplier(2,3)).toBe(6);
  expect(multiplier(1,2)).toBe(2);
})
