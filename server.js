//Dependencies
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const server = express();

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
        response.render('main', {
          snippets: results,
          username: request.session.who[0].username,
          })
      })
    )
  } else {
    response.redirect('/');
  }
})

server.get('/register', function(request, response) {
  response.render('register')
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
      if (err) { response.redirect('/') }
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
  if (request.body.newUsername !== null && request.body.newPassword !== null) {
    User.create({
      username: request.body.newUsername,
      password: request.body.newPassword
    })
      .then(function(newUser){
        console.log(newUser)
      })
      .catch(function(err){
        console.log(err)
      })
    }
  response.render('success')
})

server.post('/create', function (request, response) {
  console.log(request.body);
  Snippet.create({
    owner: request.session.who[0].username,
    title: request.body.title,
    body: request.body.body,
    notes: request.body.notes,
    language: request.body.language,
    tags: request.body.tags.split(',')
  })
    .then(function(newSnippet){
      console.log(newSnippet)
    })
    .catch(function(err){
      console.log(err)
    })
  response.redirect('/main');
})

server.post('/search', function(request, response) {
  if (request.body.search === '') {
    console.log("Empty search query");
    response.redirect('/main');
  } else {
    //Radio boxes for search term like below
    //if radio box 'user'
    //Snipper.find(this.username === mischymangoes )
    Snippet.find().$where(function () {
      return ;
    })
  }
})


// server.post('/filter', function(request, response) {
//
// })

// server.post('/sort', function(request, response) {
//
// })

// server.post('/favorite', function(request, response) {
//
// })

server.post('/logout', function(request, response) {
  request.session.destroy(function() {
    response.redirect('/logout')
  });
})

//LISTEN TO PORT
server.listen(3000, function() {
  console.log("It's twerking!");
})
