// Init {{{
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

// }}}

// Schema {{{
var PublicationSchema = new Schema({
  pubMedium: {
    _id: { type: Schema.Types.ObjectId, ref: 'PublicationMedia' },
    mediaLabel: {type: String, default: ''},
    googleLabel: {type: String}
  },
  member: {
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String, default: ''},
    inductionYear: Number
  },
  reportedAuthors: [ String ],
  verified: {type: Boolean, default: false},
  imported: {type: Boolean, default: false},
  pubTitle: {type: String, default: '', trim: true},
  pubYear : {type: Number, default: 0, trim: true},
  pubNotes : {type: String, default: '', trim: true},
  description : {type: String, default: '', trim: true},
  existingPubId: { type: Schema.Types.ObjectId },
  industryIdentifiers: [{
    type: {type: String, default: '', trim: true},
    identifier: {type: String, default: '', trim: true},
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
  this.find(criteria)
    .sort({createdOn: -1})
    //.limit({options.perPage})
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
