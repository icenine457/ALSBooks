var mongoose = require('mongoose')
   , Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , PublicationMedia = mongoose.model('PublicationMedia')
   , csv = require('csv')
   ,env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , fs = require('fs')
   , _ = require('underscore')
   , google = require('node-google-api')(config.googleApiKey)

exports.member = function( req, res, next, memberId) {
  Member.load(memberId, function(err, member) {
    if (err) return next(err)
    if (!member) return next(new Error('Failed to load member: ' + memberId));
    req.member = member;
    next()
  });
}
exports.import = function (req, res) {
  var members = [];
  csv()
    .from(req.body.target.result)
    .transform(function(row) {
      row.unshift(row.pop());
      return row;
    })
    .on("record", (function (data, index) {
      console.log(data)
      emailAddresses = data[6];
      members.push({
        'alsMemberId': data[1],
        'pubVerificationStatus': data[2],
        'fullName': data[4] + " " + data[3],
        'firstName': data[4],
        'lastName': data[3],
        'inductionYear': ( isNaN(parseInt(data[5])) ? null : (parseInt(data[5])) ),
        'emailAddresses': ( emailAddresses.length > 0 ? emailAddresses.replace(/" /g, "").split(",") : []),
        'contactDetails' : [{
          'phoneNumber': data[7],
          'streetAddress1': data[8],
          'streetAddress2': data[9],
          'city': data[10],
          'state': data[11],
          'zip': data[12],
          'country': data[13],
        }],
        'notes': data[14],
        'createdOn': new Date(),
      });
    }))
    .on('end', function() {
      Member.create(members, function(err) {
        res.json({successCount: members.length})
      });
    })
    .on('error', function(err) {
      res.send(500, {error: err.message});
    });
};

exports.list = function (req, res) {
  Member.list(req.body, function(err, members) {
    res.json(members);
  });
};

exports.edit = function (req, res) {
  var result = { member: req.member};
  res.json(result);
};

exports.save = function (req, res) {
  var member = req.member;
  member = _.extend(member, req.body);
  member.fullName = member.firstName + " " + member.lastName;
  member.save(function(err) {
    res.send(200);
  });
};

exports.searchGoogle = function(req, res) {
  google.build(function(api) {
    var query = 'inauthor:"' + req.member.fullName + '"';
    api.books.volumes.list({
      q: query,
      maxResults: req.params.maxResults,
      startIndex: req.params.page,
      langRestrict: "en"
    }, function(result) {
      var publications = [];
      if (result.totalItems == 0 || typeof(result.items) == "undefined") {
        return res.send(200, []);
      }
      result.items.forEach(function(item, index, array) {
        Publication.findOne({"member._id": req.member._id, pubTitle: item.volumeInfo.title}, function(err, existingPub) {
          PublicationMedia.findOne({googleLabel: item.volumeInfo['printType']}, function(err, medium) {
            var publishedDate = typeof(item.volumeInfo.publishedDate) !== 'undefined' ? item.volumeInfo.publishedDate.substring(0, 4) : 0;
            var publication = new Publication({
              pubMedium: {
                _id: medium._id,
                mediaLabel: medium.mediaLabel,
                googleLabel: medium.googleLabel
              },
              pubTitle: item.volumeInfo.title,
              existingPubId: (existingPub ? existingPub._id : null),
              pubYear: parseInt(publishedDate),
              pubNotes: "",
              reportedAuthors: item.volumeInfo.authors,
              description: item.volumeInfo.description,
              verified: false,
              member: {
                _id: req.member._id,
                fullName: req.member.fullName,
                inductionYear: req.member.inductionYear
              }
            });

            publications.push(publication);
            if (publications.length == result.items.length) {
              var response = {
                publications: publications,
                totalItems: result.totalItems
              };
              res.send(200, response);
            };
          });
        })
      })
    });
  });
};
