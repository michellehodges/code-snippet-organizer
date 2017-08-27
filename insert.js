const express = require('express');
const mustache = require('mustache-express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const server = express();

server.engine('mustache', mustache());
server.set('views', './views');
server.set('view engine', 'mustache');
server.use(express.static('views'));

let User = require('./mongoose');
// let Snippet = require('./mongoose')

mongoose.connect('mongodb://localhost:27017/test');

// User.create({
//   username: "mischymangoes",
//   password: "poop"
// })
//   .then(function(newUser){
//     console.log(newUser)
//   })
//   .catch(function(err){
//     console.log(err)
//   })
//
// User.create({
//   username: "abc",
//   password: "123"
// })
//   .then(function(newUser){
//     console.log(newUser)
//   })
//   .catch(function(err){
//     console.log(err)
//   })

// Snippet.create(
// Get the owner name from the user session.
//   owner: "abc",
//   title: "Define a method using Java",
//   body: `public class ExampleMinNumber {
//    public static void main(String[] args) {
//       int a = 11;
//       int b = 6;
//       int c = minFunction(a, b);
//       System.out.println(Minimum Value = + c);
//    }
//
//    public static int minFunction(int n1, int n2) {
//       int min;
//       if (n1 > n2
//          min = n2;
//       else
//          min = n1;
//
//       return min;
//    }`,
//   notes: "Above is the example to demonstrate how to define a method and how to call it.",
//   language: "java",
//   tags: ["java", "method", "beginner"],
// })
//   .then(function(newSnippet){
//     console.log(newSnippet)
//   })
//   .catch(function(err){
//     console.log(err)
//   })
//
Snippet.create({
  owner: "mischymangoes",
  title: "Converting from Celcius to Fahrenheit",
  body: `
    function toCelsius(fahrenheit) {
      return (5/9) * (fahrenheit-32);
    }
    document.getElementById("demo").innerHTML = toCelsius;
  `,
  notes: "Accessing a function without () will return the function definition instead of the function result",
  language: "javascript",
  tags: ["javascript", "function", "beginner"],
})
  .then(function(newSnippet){
    console.log(newSnippet)
  })
  .catch(function(err){
    console.log(err)
  })
