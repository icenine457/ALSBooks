// Init {{{
var env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , google = require('./google')
// }}}

exports.google = google;
