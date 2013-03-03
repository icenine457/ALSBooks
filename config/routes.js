var mongoose = require('mongoose')
  , publications = require('../lib/controllers/publications')
  , members = require('../lib/controllers/members')
  , master = require('../routes/index')

module.exports = function(app) {

  app.get('/', master.index);
  app.get('/partials/:name', master.partials)
  app.get('/api/members', members.list);
  app.get('/api/members/:memberId/search/google/:page/:maxResults', members.searchGoogle);
  app.post('/api/importMembers', members.import);
  app.get('/api/members/edit/:memberId', members.edit);
  app.put('/api/members/save/:memberId', members.save);

  var publications = require('../lib/controllers/publications');
  app.get('/api/publications/new/:memberId', publications.new);
  app.get('/api/publications/edit/:memberId/:pubId', publications.get);
  app.post('/api/publications/save/:memberId/:pubId', publications.save);
  app.put('/api/publications/create/:memberId', publications.create);
  app.get('/api/publications', publications.list);

  app.param('memberId', members.member);
  app.param('pubId', publications.publication);

  // redirect all others to the index (HTML5 history)
  app.get('*', master.index);

}


