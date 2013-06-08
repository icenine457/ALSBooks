var mongoose = require('mongoose')
  , Publication = mongoose.model('Publication')
  , PublicationMedia = mongoose.model('PublicationMedia')
  , Member = mongoose.model('Member')
  , async = require('async')
  , _ = require('underscore')
  , mongosearch = require('../modules/mongosearch')

exports.publication = function( req, res, next, pubId) {
  Publication.load(pubId, function(err, publication) {
    if (err) return next(err)
    if (!publication) return next(new Error('Failed to load publication: ' + pubId));
    req.publication = publication;
    return next()
  });
}

exports.save = function (req, res, next) {

  var member = req.member;
  var publication = req.publication;
  var newPublication = new Publication(req.body);

  for (var pppp = 0; pppp < member.publications.length; pppp++) {
    var thisPub = member.publications[pppp];
    if (thisPub._id.toString() != publication._id.toString()) {
      continue;
    }
    member.publications.splice(pppp, 1);
    publication.remove();
  }
  member.publications.push(newPublication);

  member.save(function(err) {
    if (err) return next(err)

    newPublication.save();
    res.send(200);
  });
};

exports.create = function (req, res, next) {
  var publication = new Publication(req.body);
  var member = req.member;
  member.publications.push(publication);
  publication.member = member;

  publication.save(function(err) {
    if (err) return next(err)
    member.save(function(err) {
      if (err) return next(err)

      res.send(200);
    });
  })
};

exports.get = function (req, res, next) {
  req.publication.member = req.member;
  PublicationMedia.find({}, function(err, media) {
    var result = {
      pubMedia: media,
      publication: req.publication
    };
    res.json(result);
  });
};

exports.new = function (req, res, next) {
  var publication = new Publication();
  publication.member = req.member;
  PublicationMedia.find({}, function(err, media) {
    var result = {
      pubMedia: media,
      publication: publication
    };
    res.json(result);
  });
};

exports.import = function(req, res) {
  var member = req.member;

  var promise = new mongoose.Promise;
  promise.addBack(function(err, member) {
    if (err) return res.send(500, {error: "Unable to import publications: " + err });
    member.save(function(err) {
      if (err) return promise.error(err);
      res.json({publications: req.body});
    });
  });

  req.body.forEach(function( publication, index, array ) {
    var thisPublication = _.extend( new Publication(), publication);
    thisPublication.save(function( err ) {
      member.publications.push(publication);
      var iteration = index+1;
      if (iteration == req.body.length) promise.complete(member)
    });
  });

}

exports.list = function (req, res) {
  var promise = new mongoose.Promise;
  var options = {
    page: (req.params.page || 0),
    perPage: (req.params.perPage || 10)
  };
  options.orderBy = {};
  options.orderBy[req.params.orderBy] = req.params.orderByDir;
  options.criteria = {}
  if (req.params.searchBy) {
    options.criteria[req.params.searchBy] = mongosearch.searchTable(req.params.q);
  }

  promise.addBack(function(err, publications) {
    Publication.count(options.criteria, function(err, count) {
      res.json({
        pubsTotal: count,
        publications: publications,
      });
    });
  });
  Publication.list(options, function(err, publications) {
    if (err) return promise.error(err);
    return promise.complete(publications);
  });
};
