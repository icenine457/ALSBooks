// Init {{{
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , promisify = require('deferred').promisify

mongoose.Collection.prototype.pFind = promisify(mongoose.Collection.prototype.find);
mongoose.Collection.prototype.pFindOne = promisify(mongoose.Collection.prototype.findOne);
mongoose.Schema.prototype.pSave = promisify(mongoose.Collection.prototype.save);
// }}}

// Schema {{{
//

var PublicationSchema = new Schema({
  pubMedium: {
    _id: { type: Schema.Types.ObjectId, ref: 'PublicationMedia' }
    , mediaLabel: {type: String, default: ''}
    , googleLabel: {type: String}
  }
  , member: {
    _id: { type: Schema.Types.ObjectId }
    , fullName: { type: String, default: ''}
    , inductionYear: Number
  }
  , reportedAuthors: [ String ]
  , openLibraryAuthors: [{
    key: String
  }]
  , verified: {type: Boolean, default: false}
  , subjects: [ String ]
  , subTitle: String
  , otherTitles: [ String ]
  , imported: {type: Boolean, default: false}
  , pubTitle: {type: String, default: '', trim: true}
  , pubYear: {type: Number, default: 0, trim: true}
  , pubDate: {type: String, trim: true }
  , pubNotes : {type: String, default: '', trim: true}
  , description : {type: String, default: '', trim: true}
  , existingPubId: { type: Schema.Types.ObjectId }
  , googleId: {type: String }
  , latestRevision: {type: Number }
  , publishers: [ String ]
  , openLibraryWorkId: String
  , industryIdentifiers: [{
      type: {type: String, default: '', trim: true}
      , identifier: {type: String, default: '', trim: true}
  }]
  , editions: [{
    openLibraryCovers: [ String ]
    , revision: Number
  }]
});

// }}}

// Validation {{{
PublicationSchema.path('pubTitle').validate(function(pubTitle) {
  return pubTitle.length > 0;
}, 'Publication title cannot be blank');


// }}}

// Hooks {{{

// PublicationSchema.pre('save', function(next) {
//   if (!this.createdOn) this.createdOn = new Date;
// });

// }}}

// Statics {{{
PublicationSchema.statics.list = function(options, cb) {
  var criteria = options.criteria || {}
  console.log(options);
  this.find(criteria)
    .sort(options.orderBy)
    .limit(options.perPage)
    .populate('pubMedium')
    .skip(options.perPage * options.page)
    .exec(cb)
};

PublicationSchema.statics.load = function(id, cb) {
  this.findOne({_id: id})
    .populate('pubMedium')
    .exec(cb)
};
// }}}

mongoose.model('Publication', PublicationSchema)

// vim: set et fdm=marker ft=javascript fenc=utf-8 ff=unix sts=0 sw=2 ts=2 :
