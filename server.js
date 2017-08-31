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

module.exports = server;

//Server configure
server.engine('mustache', mustache());
server.set('views', './views');
server.set('view engine', 'mustache');
server.use(express.static('public'));
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

server.get('/api', function(request, response) {
  Snippet.find({}, function(err, results){ response.json(results) })
})

server.get('/snippets/:snippet_id', function(request, response) {
  Snippet.find({ _id: request.params.snippet_id }, function(err, results){
    response.render('individuals', { snippet: results })
  })
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
        response.render('welcome', { failed: "Username or password not found. Please try again."});
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
  if ((request.body.title.length != 0) && (request.body.body.length != 0) && (request.body.language.length != 0) && (request.body.tags.length != 0)) {
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
  } else if (request.body.title.length === 0) {
    response.render('main', { needTitle: "A title is required." });
  } else if (request.body.body.length === 0) {
    response.render('main', { needBody: "Body to snippet is required." });
  } else if (request.body.language.length === 0) {
  response.render('main', { needLanguage: "Language is required." });
  } else if (request.body.tags.length === 0) {
  response.render('main', { needTags: "At least one tag is required." });
  }
});

server.post('/search', function(request, response) {
  if (request.body.search === '') {
    response.redirect('/main');
  } else if (request.body.searchtype === 'username'){
    Snippet.find({owner: request.body.search}, function(err, searchResults) {
      if (searchResults.length === 0) {
        response.render('main', {
          noResults: "Sorry, we can't find any snippets that matches your search.",
          username: request.session.who[0].username
        })
      } else {
        response.render('main', {
          snippets: searchResults,
          username: request.session.who[0].username
        })
      }
    })
  } else if (request.body.searchtype === 'language'){
    Snippet.find({language: request.body.search}, function(err, searchResults) {
      if (searchResults.length === 0) {
        response.render('main', {
          noResults: "Sorry, we can't find any snippets that matches your search.",
          username: request.session.who[0].username
        })
      } else {
        response.render('main', {
          snippets: searchResults,
          username: request.session.who[0].username
        })
      }
    })
  } else if (request.body.searchtype === 'tag'){
    Snippet.find({tags: request.body.search}, function(err, searchResults) {
      if (searchResults.length === 0) {
        response.render('main', {
          noResults: "Sorry, we can't find any snippets that matches your search.",
          username: request.session.who[0].username
        })
      } else {
        response.render('main', {
          snippets: searchResults,
          username: request.session.who[0].username
        })
      }
    })
  } else {
    response.render('main', {
      noResults: "Sorry, we can't find any snippets that matches your search."
    })
  }
})

server.post('/filter', function(request, response) {
  if (request.body.filtertype === 'all') {
    Snippet.find({}, function(err, results) {
      if (results.length === 0) {
        response.render('main', {
          noResults: "Sorry, we can't find any snippets that matches your search.",
          username: request.session.who[0].username
        })
      } else {
        response.render('main', {
          snippets: results,
          username: request.session.who[0].username,
          })
      }
    })
  } else if (request.body.filtertype === 'mine') {
    Snippet.find({owner: request.session.who[0].username}, function(err, results){
      if (results.length === 0) {
        response.render('main', {
          noResults: "Sorry, we can't find any snippets that matches your search.",
          username: request.session.who[0].username
        })
      } else {
        response.render('main', {
          snippets: results,
          username: request.session.who[0].username,
          })
      }
    })
  } else if (request.body.filtertype === 'friends') {
    Snippet.find({owner: {$nin: request.session.who[0].username}}, function(err, results){
      if (results.length === 0) {
        response.render('main', {
          noResults: "Sorry, we can't find any snippets that matches your search.",
          username: request.session.who[0].username
        })
      } else {
        response.render('main', {
          snippets: results,
          username: request.session.who[0].username,
          })
      }
    })
  } else if (request.body.filtertype === 'favorited') {
    Snippet.find({favorites: !null }, function(err, results) {
      if (results.length === 0) {
        response.render('main', {
          noResults: "Sorry, we can't find any snippets that matches your search.",
          username: request.session.who[0].username
        })
      } else {
        response.render('main', {
          snippets: results,
          username: request.session.who[0].username,
          })
      }
    })
  }
})

server.post('/sort', function(request, response) {
  if (request.body.sorttype === 'dateascending') {
  Snippet.find().sort({timestamp: -1}).then(function(results) {
    response.render('main', {
      snippets: results,
      username: request.session.who[0].username,
      })
    })
  } else if (request.body.sorttype === 'datedescending') {
  Snippet.find().sort({timestamp: 1}).then(function(results) {
    response.render('main', {
      snippets: results,
      username: request.session.who[0].username,
      })
    })
    } else if (request.body.sorttype === 'mostfavorited') {
      Snippet.find({}, function(err, results) {
        results.sort(function(a,b){
          return a.favoritedBy.length < b.favoritedBy.length;
        })
        response.render('main', {
      snippets: results,
      username: request.session.who[0].username,
      })
    })
  } else if (request.body.sorttype === 'leastfavorited') {
    Snippet.find({}, function(err, results) {
      results.sort(function(a,b){
        return a.favoritedBy.length > b.favoritedBy.length;
      })
      response.render('main', {
    snippets: results,
    username: request.session.who[0].username,
    })
  })
}
})

server.post('/favorite/:snippet_id', function(request, response) {
  Snippet.findOneAndUpdate(
    { _id : request.params.snippet_id },
    { $push: {favoritedBy: request.session.who[0].username}})
    .then(function(results) {
        response.redirect('/main')
    });
})

server.post('/logout', function(request, response) {
  request.session.destroy(function() {
    response.redirect('/logout')
  });
})

//LISTEN TO PORT
server.listen(3000, function() {
  console.log("ayyyyyyy its party time");
})


//TODO:
//2. Create testing file using Jest
