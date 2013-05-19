// Init {{{
var mongoose = require('mongoose')
   , User = mongoose.model('User')
   , env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , _ = require('underscore')

exports.session= function ( req, res, next) {
  var result = true;
  res.json(result);
}

exports.loginFailed = function (req, res, next) {
  var result = false;
  res.json(result);
}

exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) {
      res.json({ errors: err.errors })
      return
    }
    res.json({ success: true })
  })
}
// }}}

