// Module dependencies {{{

var express = require('express')
   , passport = require('passport')
   , fs = require('fs')
   , partials = require('express-partials')

// }}}

// Configuration {{{

var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')

mongoose.connect(config.db)

var modelsPath = __dirname + '/lib/models'
fs.readdirSync(modelsPath).forEach(function (modelFile) {
  require(modelsPath+'/'+modelFile)
});

require('./config/passport')(passport, config)

var app = express();
require('./config/express')(app, config, passport)
require('./config/routes')(app, passport, auth)
app.use(partials());
// }}}

// API {{{


// }}}

// Server initialization {{{

var port = process.env.ALSPUBSPORT || 80
app.listen(port)
console.log('Express app started on port '+port)

// }}}

// vim: set et fdm=marker fenc=utf-8 ff=unix sts=0 sw=2 ts=2 : 
