var mongoose = require('mongoose')
  , publications = require('../lib/controllers/publications')
  , members = require('../lib/controllers/members')
  , webSearch = require('../lib/controllers/webSearch')
  , users = require('../lib/controllers/users')
  , index = require('../lib/controllers/index')

module.exports = function(app, passport) {

  // Contact Us
  var contact = require('../lib/controllers/contact');
  app.post('/api/contact', contact.send);

  //Members
  var ability = [ users.hasAbility ]
  app.get('/api/members/list/:page/:perPage/:orderBy/:orderByDir', ability, members.list);
  app.get('/api/members/list/:page/:perPage/:orderBy/:orderByDir/:searchBy/:q', ability, members.list);
  app.get('/api/members/edit/:memberId', ability, members.edit);
  app.post('/api/members/import', ability, members.import);
  app.put('/api/members/save/:memberId', ability, members.save);

  // Publications
  var publications = require('../lib/controllers/publications');
  app.get('/api/publications/new/:memberId', publications.new);
  app.get('/api/publications/edit/:memberId/:pubId', ability, publications.get);
  app.get('/api/publications/view/:memberId/:pubId', publications.get);
  app.put('/api/publications/create/:memberId', publications.create);
  app.get('/api/publications/list/:page/:perPage/:orderBy/:orderByDir', publications.list);
  app.get('/api/publications/list/:page/:perPage/:orderBy/:orderByDir/:searchBy/:q', publications.list);
  app.post('/api/publications/save/:memberId/:pubId', ability, publications.save);
  app.put('/api/publications/import/:memberId', publications.import);

  // Web Search
  app.get('/api/search/google/:memberId/:page/:maxResults', webSearch.google.search);

  // Manage Users
  app.get('/api/manage/users/list', ability, users.list)
  app.post('/api/manage/users/update', ability, users.update);
  app.post('/api/manage/users/create', ability, users.create)

  // Users
  app.get('/api/users/loginFailed', users.loginFailed);
  app.post('/api/users/login', passport.authenticate('local', {failureRedirect: '/api/users/loginFailed'}), users.session)
  app.post('/api/users/logout', users.logout)
  app.post('/api/users/verify', users.verify)

  // Archive
  app.delete('/api/archive/publications/:memberId', members.archive);

  // Articles
  app.get('/api/articles/list', index.list);
  app.put('/api/articles/new', ability, index.create);
  app.post('/api/articles/edit', ability, index.save);

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


