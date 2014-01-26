// Init {{{
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , promisify = require('deferred').promisify

// }}}

// Schema {{{

var ArticleSchema = new Schema({
  header: String,
  body: String,
  createdBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  modifiedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdOn: { type: Date, default: Date.now},
  modifiedOn: { type: Date, default: Date.now},
  deleted: Boolean,
}, {collection: 'articles'});

// }}}

// Validation {{{

// }}}

// Hooks {{{

ArticleSchema.pre('save', function(next) {
  if (this.deleted) {
    this.modifiedOn = Date.now;
  };
});

// }}}

// Statics {{{
ArticleSchema.statics.list = function(options, cb) {
  var criteria = (options && options.criteria) || {}
  this.find(criteria)
    .sort('createdOn')
    .limit(10)
    .exec(cb)
};
// }}}

mongoose.model('Article', ArticleSchema)

// vim: set et fdm=marker ft=javascript fenc=utf-8 ff=unix sts=0 sw=2 ts=2 :
