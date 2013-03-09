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

  var counter = 0;
  req.body.forEach(function( publication ) {
    var thisPublication = _.extend( new Publication(), publication);
    counter = counter++;
    thisPublication.save(function( err ) {
      member.publications.push(publication);
      member.save(function(err) {
        if (err) return next(err)
        if (counter == req.body.length) res.json({publications: req.body});
      });
    });
  });

}

exports.list = function (req, res) {
  Publication.list(req.body, function(err, publications) {
    res.json(publications);
  });
};
