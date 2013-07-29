// Init {{{
var mongoose = require('mongoose')
   , User = mongoose.model('User')
   , Ability = mongoose.model('Ability')
   , Session = mongoose.model('Session')
   , env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , _ = require('underscore')
   , Q = require("q")

exports.session = function ( req, res, next) {
  var userData = {
    name: req.user.name,
    email: req.user.email,
    _id: req.user._id,
    abilities: req.user.abilities
  }
  res.cookie("alsbooks.loggedIn", 'true', {httpOnly: false})
  res.cookie("alsbooks.user", userData, {httpOnly: false})
  res.json({success: true, user: userData});
}

exports.member = function( req, res, next, memberId) {
  Session.load(memberId, function(err, member) {
    if (err) return next(err)
    if (!member) return next(new Error('Failed to load member: ' + memberId));
    req.member = member;
    next()
  });
}

exports.loginFailed = function (req, res, next) {
  var result = false;
  res.json({errors: "Log-in failed."});
}

exports.verify = function (req, res, next) {
  var sid = req.cookies["connect.sid"];
  if (!sid) {
    return res.send(401, 'Unauthorized');
  }
  Session.findBySessionId(sid, function(err, session) {
    if (!req.user) {
      return res.send(200);
    }
    if (!session) {
      return res.send(401, 'Unauthorized');
    }

    if (req.user._id != session.asObj.passport.user) {
      return res.send(401, 'Unauthorized');
    }
    var userData = {
      name: req.user.name,
      email: req.user.email,
      _id: req.user._id,
      abilities: req.user.abilities
    }
    res.cookie("alsbooks.loggedIn", 'true', {httpOnly: false})
    res.cookie("alsbooks.user", userData, {httpOnly: false})
    return res.json({success: true});
  });
}

exports.logout = function(req, res, next) {
  req.logout();
  res.clearCookie("alsbooks.loggedIn");
  res.clearCookie("alsbooks.user");
  res.json({success: true});
}

// TODO: One way would be to make a user module that is independent of the
// controller
exports.hasAbility = function (req, res, next) {
  // TODO: There has to be a way to clean this up
  User.findOne({_id: req.user._id})
    .populate('abilities')
    .exec(function(err, user) {
      if (!user) {
        return res.send(401, 'Unauthorized');
      }
      var match = _.chain(user.abilities)
        .pluck("permissions")
        .flatten()
        .map(function(permission) {
          return Object.keys(permission).map(function(perm) {
            if (req.url.startsWith("/" + perm)) {
              return permission[perm];
            }
          })
        })
        .flatten()
        .value();
      if (req.route.method == "get" && ! _.contains(match, 'read')) {
        return res.send(401, 'Unauthorized');
      }

      if ((req.route.method == "post" || req.route.method == "put") && ! _.contains(match, 'write')) {
        return res.send(401, 'Unauthorized');
      }

      if ((req.route.method == "delete") && ! _.contains(match, req.route.method )) {
        return res.send(401, 'Unauthorized');
      }
      next();
  });
};

exports.list = function(req, res, next) {
  var promise = new mongoose.Promise;

  promise.addBack(function(err, users) {
    if (err) {
      return res.send(500, err);
    }
    Ability.find(null, function(err, abilities) {
      // TODO: Handle error
      res.json({
        users: users,
        abilities: abilities,
      });

    })
  });

  User.list(null, function(err, users) {
    if (err) return promise.error(err);
    return promise.complete(users);
  });
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

exports.update = function(req, res) {
  var receivedUser = req.body;
  var finished = function(err, user) {
    if (err) {
      return res.send(500, err);
    }
    res.json({success: true});
  };
  User.findOne({ _id: receivedUser._id}, function(err, user) {
    if (err) {
      return res.send(500, err);
    }
    user.name = receivedUser.name;
    user.email = receivedUser.email;
    user.username = receivedUser.username;
    user.abilities = _.pluck(receivedUser.abilities, "_id");
    user.save(finished);
  })

};
// }}}

