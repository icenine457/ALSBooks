var mongoose = require('mongoose')
   , Member = mongoose.model('Member')
   , Article = mongoose.model('Article')
   , env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , _ = require('underscore')

exports.index = function(req, res){
  res.render('index');
};

exports.list = function (req, res) {
  var promise = new mongoose.Promise;

  promise.addBack(function(err, articles) {
    Article.count(function(err, count) {
      res.json({
        articleCount: count,
        articles: articles,
      });
    });
  });

  Article.list(null, function(err, articles) {
    if (err) return promise.error(err);
    return promise.complete(articles);
  });
};

exports.create = function (req, res) {
  var article = new Article(req.body);

  // TODO: Abstract ability verification into it's own class
  var userId = ( req.user && req.user._id) ? req.user._id : null

    User.findOne({_id: userId })
    .populate('abilities')
    .exec(function(err, user) {
      var hasAbility = false;
      if (!user) {
        return res.send(401);
      }

      hasAbility = _.chain(user.abilities)
      .pluck('title')
      .contains('canManageArticles')
      .value()

      if (!hasAbility) {
        return res.send(403);
      }

      article.createdBy = user._id;

      article.save(function(err) {
        if (err) return res.send(500, {error: "Unable to create article: " + err });
      res.send(200);
      });
    })

}

exports.save = function (req, res) {
  var userId = ( req.user && req.user._id) ? req.user._id : null

    User.findOne({_id: userId })
    .populate('abilities')
    .exec(function(err, user) {
      var hasAbility = false;
      if (!user) {
        return res.send(401);
      }

      hasAbility = _.chain(user.abilities)
      .pluck('title')
      .contains('canManageArticles')
      .value()

      if (!hasAbility) {
        return res.send(403);
      }

      article.modifiedBy = user._id;
      article.modifiedOn = new Date();

      article.save(function(err) {
        if (err) return res.send(500, {error: "Unable to create article: " + err });
      res.send(200);
      });
    })
}

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
