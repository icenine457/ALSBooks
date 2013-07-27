// Init {{{
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , promisify = require('deferred').promisify

// }}}

// Schema {{{

var SessionSchema = new Schema({
  _id: String,
  session: String,
  expires: Date,
}, {collection: 'sessions'});

// }}}

// Virtuals {{{
SessionSchema.virtual('asObj').get(function() {
  return JSON.parse(this.session);
});

// }}}

// Validation {{{

// }}}

// Hooks {{{

// }}}

// Statics {{{
SessionSchema.statics.findBySessionId = function(sid, cb) {
  var parsedSid = sid.split(":")[1].split(".")[0];
  console.log(parsedSid);
  this.findOne({"_id": parsedSid}, cb);
};
// }}}

mongoose.model('Session', SessionSchema)

// vim: set et fdm=marker ft=javascript fenc=utf-8 ff=unix sts=0 sw=2 ts=2 :
