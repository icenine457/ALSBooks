// Init {{{
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

// }}}

// Schema {{{
var PublicationMediaSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  mediaLabel: String,
  googleLabel: {type: String}
});

mongoose.model('PublicationMedia', PublicationMediaSchema, 'publicationMedia')
// }}}

// vim: set et fdm=marker ft=javascript fenc=utf-8 ff=unix sts=0 sw=2 ts=2 : 
