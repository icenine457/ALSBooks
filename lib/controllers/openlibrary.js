// Init {{{
var mongoose = require('mongoose')
   , Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , PublicationMedia = mongoose.model('PublicationMedia')
   , csv = require('csv')
   , env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , _ = require('underscore')
   , googleApi = require('node-google-api')(config.googleApiKey)
// }}}
