var mongoose = require('mongoose')
  , Publication = mongoose.model('Publication')
  , PublicationMedia = mongoose.model('PublicationMedia')
  , Member = mongoose.model('Member')
  , async = require('async')
  , _ = require('underscore')

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
  publication = _.extend(publication, req.publication);

  console.log(publication);
  for (var pppp = 0; pppp < member.publications.length; pppp++) {
    var thisPub = member.publications[pppp];
    console.log(thisPub._id);
    console.log(publication._id);
    if (thisPub._id.toString() != publication._id.toString()) {
      continue;
    }
    member.publications.splice(pppp, 1);
  }
  member.publications.push(publication);

  member.save(function(err) {
    if (err) return next(err)

    publication.save();
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
      console.log(member);
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

exports.list = function (req, res) {
  Publication.list(req.body, function(err, publications) {
    res.json(publications);
  });
};
