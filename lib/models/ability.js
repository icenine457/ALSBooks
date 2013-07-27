// Init {{{
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , promisify = require('deferred').promisify

// }}}

// Schema {{{

var AbilitySchema = new Schema({
  label: String
  , title: String
  , permissions: [
  ]
}, {collection: 'abilities'});

// }}}

// Validation {{{

// }}}

// Hooks {{{

// PublicationSchema.pre('save', function(next) {
//   if (!this.createdOn) this.createdOn = new Date;
// });

// }}}

// Statics {{{
// }}}

mongoose.model('Ability', AbilitySchema)

// vim: set et fdm=marker ft=javascript fenc=utf-8 ff=unix sts=0 sw=2 ts=2 :
