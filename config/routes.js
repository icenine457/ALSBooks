var mongoose = require('mongoose')
  , publications = require('../lib/controllers/publications')
  , members = require('../lib/controllers/members')
  , webSearch = require('../lib/controllers/webSearch')
  , users = require('../lib/controllers/users')

module.exports = function(app, passport) {

  // Contact Us
  var contact = require('../lib/controllers/contact');
  app.post('/api/contact', contact.send);

  //Members
  app.get('/api/members/list/:page/:perPage/:orderBy/:orderByDir', members.list);
  app.get('/api/members/list/:page/:perPage/:orderBy/:orderByDir/:searchBy/:q', members.list);
  app.post('/api/members/import', members.import);
  app.get('/api/members/edit/:memberId', members.edit);
  app.put('/api/members/save/:memberId', members.save);
  app.delete('/api/members/archive/:memberId', members.archive);

  // Publications
  var publications = require('../lib/controllers/publications');
  app.get('/api/publications/new/:memberId', publications.new);
  app.get('/api/publications/edit/:memberId/:pubId', publications.get);
  app.get('/api/publications/view/:memberId/:pubId', publications.get);
  app.post('/api/publications/save/:memberId/:pubId', publications.save);
  app.put('/api/publications/create/:memberId', publications.create);
  app.get('/api/publications/list/:page/:perPage/:orderBy/:orderByDir', publications.list);
  app.get('/api/publications/list/:page/:perPage/:orderBy/:orderByDir/:searchBy/:q', publications.list);
  app.put('/api/publications/import/:memberId', publications.import);

  // Web Search
  app.get('/api/search/google/:memberId/:page/:maxResults', webSearch.google.search);

  // Users
  app.post('/api/users/login', passport.authenticate('local', {failureRedirect: '/api/users/loginFailed'}), users.session)
  app.post('/api/users/logout', users.logout)
  app.post('/api/users/verify', users.verify)
  app.get('/api/users/loginFailed', users.loginFailed);
  app.post('/api/users/create', users.create)

  // Parameters
  app.param('memberId', members.member);
  app.param('pubId', publications.publication);

  app.get('/partials/:name', function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
  });

  app.get('*', function(req, res) {
    res.render('index');
  });

}


