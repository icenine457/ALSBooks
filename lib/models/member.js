// Init {{{
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , promisify = require('deferred').promisify

// }}}

// Schema {{{
var externalTypes = 'openlibrary google amazon none'.split(' ')

var MemberSchema = new Schema({
    alsMemberId : Number,
    //TODO: Use a mongoose enum here
    pubVerificationStatus : Number,
    fullName : String,
    firstName : String,
    lastName : String,
    inductionYear : Number,
    emailAddresses : [String],
    contactDetails : [{
      phoneNumber : String,
      streetAddress1 : String,
      streetAddress2 : String,
      city : String,
      state : String,
      zip: String,
      country : String
    }],
    notes: String,
    createdOn: Date,
    googleSearched: Date,
    openLibraryIds: [ String ],
    openLibraryPubIds: [ String ],
    publications: [{
      pubMedium: {
        _id: { type: Schema.Types.ObjectId, ref: 'PublicationMedia' },
        mediaLabel: {type: String, default: ''},
        googleLabel: {type: String}
      },
      reportedAuthors: [ String ],
      verified: {type: Boolean, default: false},
      imported: {type: Boolean, default: false},
      pubTitle: {type: String, default: '', trim: true},
      pubYear : {type: Number, default: 0, trim: true},
      pubNotes : {type: String, default: '', trim: true},
      description : {type: String, default: '', trim: true},
      industryIdentifiers: [{
        type: {type: String, default: '', trim: true},
        identifier: {type: String, default: '', trim: true},
      }],
      existingPubId: { type: Schema.Types.ObjectId }
    }]
});

// }}}

// Validation {{{
// MemberSchema.path('alsMemberId').validate(function(alsMemberId) {
//   return alsMemberId.length > 0 && !isNan(alsMemberId);
// }, 'ALS Member ID must be a number.');

//TODO: Add validator methods

// }}}

// Hooks {{{

// MemberSchema.pre('save', function(next) {
//   if (!this.createdOn) this.createdOn = new Date;
// });

// }}}

// Statics {{{
MemberSchema.statics.list = function(options, cb) {
  var criteria = options.criteria || {}
  this.find(criteria)
    .sort({fullName: 1})
    .skip(options.perPage * options.page)
    .limit(options.perPage)
    .exec(cb)
};

MemberSchema.statics.load = function(id, cb) {
  this.findOne({_id: id})
    .exec(cb)
};
// }}}

mongoose.model('Member', MemberSchema)

// vim: set et fdm=marker ft=javascript fenc=utf-8 ff=unix sts=0 sw=2 ts=2 : 
