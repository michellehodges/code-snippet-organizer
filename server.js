//Dependencies
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const server = express();
//
// const users = [ ARRAY OF OBJECTS FROM DATABASE collections: users]
// const snippets = [ARRAY OF OBJECTS FROM DATABASE collections: snippets ]

let User = require('./user-schema');
let Snippet = require('./snippet-schema');

//Server configure
server.engine('mustache', mustache());
server.set('views', './views');
server.set('view engine', 'mustache');
server.use(express.static('views'));
server.use(bodyparser.urlencoded( { extended: false }));
server.use(session({
    secret: '98rncailevn-_DT83FZ@',
    resave: false,
    saveUninitialized: true
}));

mongoose.connect('mongodb://localhost:27017/test');


//GET REQUESTS
server.get('/', function(request, response) {
  response.render('welcome')
})

server.get('/main', function(request, response) {
  if (request.session.who !== undefined) {
    Snippet.find({},
      (function(err, results){
        for (let i = 0; i < results.length; i++) {
          response.render('main', {
            username: request.session.who[0].username,
            owner: results[i].owner,
            title: results[i].title,
            timestamp: results[i].timestamp,
            body: results[i].body,
            notes: results[i].notes
            })
          }
      })
    )
  } else {
    response.redirect('/');
  }
})

server.get('/logout', function(request, response) {
  response.render('logout')
})

//POST REQUESTS
server.post('/main', function(request, response) {
  if (request.body.username === '' || request.body.password === '') {
    console.log("Empty User/Pass");
    response.redirect('/')
  } else {

  User.find(
    {'username': request.body.username, 'password': request.body.password},
    function(err, user) {
      if (err) {
        response.redirect('/')
      }

      if (user.length === 0) {
        console.log('User not found!');
        response.render('welcome', { failed: "Login Failed."});
      } else {
        request.session.who = user;
        response.redirect('/main')
      }
    })
  }
  })


server.post('/register', function(request, response) {

  //TODO: NEED TO FIGURE OUT HOW TO PUSH TO DATABASE
  const username = request.body.newUsername;
  const password = request.body.newPassword;

  if (username !== null && password !== null)
    users.push({
      username: request.body.newUsername,
      password: request.body.newPassword,
    })
  console.log(users)
  response.redirect('/register')
})

server.post('/create', function (request, response) {

  //TODO: EDIT THIS FOR SNIPPETS AND TO PUSH TO DATABASE
  snippets.push({
    snippet: request.body.snippet,
    username: request.session.who.username
  });
  response.redirect('/main');
})

server.post('/logout', function(request, response) {
  request.session.destroy(function() {
    response.redirect('/logout')
  });
})

//LISTEN TO PORT
server.listen(3000, function() {
  console.log("It's twerking!");
})
