var mongoose = require('mongoose')
  , Publication = mongoose.model('Publication')
  , PublicationMedia = mongoose.model('PublicationMedia')
  , Member = mongoose.model('Member')
  , async = require('async')

exports.publication = function( req, res, next, pubId) {
  Publication.load(pubId, function(err, publication) {
    if (err) return next(err)
    if (!publication) return next(new Error('Failed to load publication: ' + pubId));
    req.publication = publication;
    next()
  });
}

exports.save = function (req, res, next) {
  var memberId = req.params['memberId'];
  Member.load(memberId, function(err, member) {
    if (err) return next(err)
    if (!member) return next(new Error('Failed to load member ' + memberId));

    var publication = new Publication({
      pubMedium: req.body.pubMedium,
      pubTitle: req.body.pubTitle,
      pubYear: req.body.pubYear,
      pubNotes: req.body.pubNotes,
      _id: req.body._id
    });

    if (member.publications === undefined) {
      member.publications = [];
    }

    for (var pppp = 0; pppp < member.publications.length; pppp++) {
      var thisPub = member.publications[pppp];
      if (thisPub._id != publication._id) {
        continue;
      }
      member.publications.splice(pppp, 1);
    }

    if (member.publications === undefined) {
      member.publications = [];
    }
    member.publications.push(publication);

    member.save(function(err) {
      if (err) return next(err)

      publication.member = {
        _id:  member._id,
        fullName: member.fullName,
        inductionYear: member.inductionYear
      };
      publication.save();
      res.send(200);
      });
    });
};

exports.new = function(req, res, next) {
  var memberId = req.params['memberId'];
  Member.load(memberId, function(err, member) {
    if (err) return next(err)
    if (!member) return next(new Error('Failed to load member ' + memberId));
    var result = {
      publication: new Publication({
        pubTitle: '',
        pubYear: '',
        pubMedium: '',
        pubNotes: '',
        member: {
          _id:  member._id,
          fullName: member.fullName,
          inductionYear: member.inductionYear
        }
      })
    }
    res.json(result);
  });
};

exports.get = function (req, res, next) {
  PublicationMedia.list(function(err, media) {
    var result = {
      pubMedia: media,
      publication: req.publication
    };
    res.json(result);
  });
};

exports.list = function (req, res) {
  Publication.list(req.body, function(err, publications) {
    res.json(publications);
  });
};
