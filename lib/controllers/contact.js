var mongoose = require('mongoose')
   , csv = require('csv')
   , env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , fs = require('fs')
   , email = require('emailjs/email')
   , _ = require('underscore')
   , check = require('validator').check

var validateMail = function(body) {
  var validationErrors = {}, hasErrors = false;

  var setError = function(errs, errorProp, msg) {
    errs[errorProp] = { message: msg };
  };

  var validationMap = {
    name: function(body) {
      if(!body.name || !check(body.name).notEmpty()) { return "Please provide a name" }
    },
    email: function(body) {
      if(! body.email || !check(body.email).isEmail()) { return "Please enter a valid e-mail address" }
    },
    subject: function(body) {
      if(! body.subject || !check(body.subject).notEmpty()) { return "Please provide a subject line" }
    },
    message: function(body) {
      if(!body.text || !check(body.text).notEmpty()) { return "Message text is required" }
    },
  }

  for (var validKey in validationMap) {
    var result = validationMap[validKey](body);
    if (result) {
      hasErrors = true;
      validationErrors[validKey] = result;
    }
  }
  if (hasErrors) {
    return {
      err: validationErrors
    }
  }

  return {
    to: config.contactDetails.user,
    from: config.contactDetails.user,
    subject: body.subject,
    text: "Message from ALS Publications",
    attachment: [
      {data: "<html><h2>Message from ALS Publications</h2><h3>From:</h3><p>" + body.email + "</p><h3>Message:</h3><p>" + body.text + "</p></html>", alternative: true},
    ],
  };

};

exports.send = function( req, res, next) {
  var mail = validateMail(req.body);
  if (mail.err) {
    return res.send(500, { errors: mail.err });
  }
  // TODO: Replace with a jade converted template (possibly use nodemailer)
  // TODO: Move somewhere more re-usable
  var server = email.server.connect(config.contactDetails);

  server.send(mail, function(err, message) {
    if (err) {
      return res.send(500, { errors: err });
    }
    res.json({
      success: true
    });

  });

}


