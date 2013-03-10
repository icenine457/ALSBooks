// Init {{{
var mongoose = require('mongoose')
   , Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , PublicationMedia = mongoose.model('PublicationMedia')
   , csv = require('csv')
   , env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , _ = require('underscore')
   , googleApi = require('node-google-api')(config.googleApiKey)
// }}}

// TODO: Deferred re-write
exports.search = function(req, res) {
  var promise = new mongoose.Promise;
  promise.addBack(function(err, member, response) {
    member.googleSearched = Date.now()
    member.save(function(err) {
      res.send(200, response);
    });
  });

  var getPubsPromise = new mongoose.Promise;

  getPubsPromise.addBack(function(err, publications, results, totalItems) {
    var googleIds = _.pluck(publications, "googleId")

    PublicationMedia.find({}, function(err, pubMedia) {
      var importPubs = [];
      for (var rrrr = 0; rrrr < results.length; rrrr++) {
        console.log(result);
        var result = results[rrrr];
        if (googleIds.indexOf(result.id) != -1) {
          continue;
        }

        var publishedDate = typeof(result.volumeInfo.publishedDate) !== 'undefined' ? result.volumeInfo.publishedDate.substring(0, 4) : 0;
        var existingPub =  _.find(publications, function(pub) {
          var regex = new RegExp('^' + result.volumeInfo.title + '$', "i")
          return regex.test(pub.pubTitle)
        })

        var medium = _.findWhere(pubMedia, { googleLabel: result.volumeInfo.printType });
        if (!medium) {
          medium = _.findWhere(pubMedia, { mediaLabel: "Unknown" });
        }

        var publication = new Publication({
          pubMedium: {
            _id: medium._id,
            googleLabel: medium.googleLabel,
            mediaLabel: medium.mediaLabel
          },
          pubTitle: result.volumeInfo.title,
          existingPubId: (existingPub ? existingPub._id : null),
          pubYear: parseInt(publishedDate),
          pubNotes: "",
          reportedAuthors: result.volumeInfo.authors,
          industryIdentifiers: result.volumeInfo.industryIdentifiers,
          description: result.volumeInfo.description,
          verified: false,
          googleId: result.id,
          member: {
            _id: req.member._id,
            fullName: req.member.fullName,
            inductionYear: req.member.inductionYear
          }
        });

        importPubs.push(publication);
        if (importPubs.length == (results.length - googleIds.length)) {
          var response = {
            publications: importPubs,
            totalItems: totalItems,
            member: req.member
          };
          promise.complete(req.member, response);
        };
      }
    })
  })

  googleApi.build(function(api) {
    var query = 'inauthor:"' + req.member.fullName + '"';
    api.books.volumes.list({
      q: query,
      orderBy: "newest",
      maxResults: req.params.maxResults,
      startIndex: req.params.page,
      langRestrict: "en"
    }, function(result) {
      var publications = [];
      if (result.totalItems == 0 || typeof(result.items) == "undefined") {
        var response = {
          member: req.member,
          publications: [],
        };
        return promise.complete(req.member, response);
      }
      var itemCount = result.items.length;

      // Find any publications that we've already searched for
      Publication.find({"member._id" : req.member._id}, function(err, publications) {
        getPubsPromise.complete(publications, result.items, result.totalItems);
      });

    });
  });
};
