// Init {{{
var mongoose = require('mongoose')
   , User = mongoose.model('User')
   , env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , _ = require('underscore')

exports.session = function ( req, res, next) {
  var userData = {
    name: req.user.name,
    email: req.user.email,
    _id: req.user._id,
  }
  res.cookie("alsbooks.loggedIn", 'true', {httpOnly: false})
  res.cookie("alsbooks.user", userData, {httpOnly: false})
  res.json({success: true});
}

exports.loginFailed = function (req, res, next) {
  var result = false;
  res.json({errors: "Log-in failed."});
}

exports.logout = function(req, res, next) {
  req.logout();
  res.clearCookie("alsbooks.loggedIn");
  res.json({success: true});
}

exports.create = function (req, res) {
  var user = new User(req.body)
  var exists = false;
  User.findOne({'email': user.email}, function(err, thisUser) {
    if (thisUser != null) return res.json({errors: { email: { type: 'An account with this e-mail already exists'} } });
    user.provider = 'local'
    user.save(function (err) {
      if (err) {
        res.json({ errors: err.errors })
        return
      }
      res.json({ success: true })
    })
  });


}
// }}}

