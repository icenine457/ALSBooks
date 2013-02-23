var mongoose = require('mongoose')
  , publications = require('../lib/controllers/publications')
  , members = require('../lib/controllers/members')
  , master = require('../routes/index')

module.exports = function(app) {

  app.get('/', master.index);
  app.get('/partials/:name', master.partials)
  app.get('/api/members', members.list);
  app.post('/api/importMembers', members.import);
  app.get('/api/editMember/:memberId', members.edit);
  app.put('/api/editMember/:memberId', members.save);

  var publications = require('../lib/controllers/publications');
  app.get('/api/publication/:memberId/', publications.new);
  app.get('/api/publication/:memberId/:pubId', publications.get);
  app.put('/api/publication/:memberId/:pubId', publications.save);
  app.get('/api/publications', publications.list);

  app.param('memberId', members.member);
  app.param('pubId', publications.publication);

  // redirect all others to the index (HTML5 history)
  app.get('*', publications.list);

}


