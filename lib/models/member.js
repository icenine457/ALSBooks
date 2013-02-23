// Init {{{
var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

// }}}

// Schema {{{
var MemberSchema = new Schema({
    alsMemberId : Number,
    //TODO: Use a mongoose enum here
    pubVerificationStatus : Number,
    fullName : String,
    firstName : String,
    lastName : String,
    inductionYear : Number,
    emailAddresses : Array,
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
    publications: [{
      pubMedium: {
        _id: { type: Schema.Types.ObjectId, ref: 'PublicationMedia' },
        mediaLabel: String
      },
      pubTitle: {type: String, default: '', trim: true},
      pubYear : {type: Number, default: 0, trim: true},
      pubNotes : {type: String, default: '', trim: true},
      validStatus: {type: Number, default: 0},
      _id: { type: Schema.Types.ObjectId, ref: 'Publication' }
    }]
});
// }}}

// Validation {{{
//MemberSchema.path('alsMemberId').validate(function(alsMemberId) {
//  return alsMemberId.length > 0 && !isNan(alsMemberId);
//}, 'ALS Member ID must be a number.');

//TODO: Add the rest of the validations

// }}}

// Hooks {{{

MemberSchema.pre('save', function(next) {
  if (!this.createdOn) this.createdOn = new Date;
});

// }}}

// Statics {{{
MemberSchema.statics.list = function(options, cb) {
  var criteria = options.criteria || {}
  this.find(criteria)
    .sort({createdOn: -1})
    //.limit({options.perPage})
    .skip(options.perPage * options.page)
    .exec(cb)
};

MemberSchema.statics.load = function(id, cb) {
  this.findOne({_id: id})
    .exec(cb)
};
// }}}

mongoose.model('Member', MemberSchema)

// vim: set et fdm=marker ft=javascript fenc=utf-8 ff=unix sts=0 sw=2 ts=2 : 
