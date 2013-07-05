var mongoose = require('mongoose')
   , Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , PublicationMedia = mongoose.model('PublicationMedia')
   , csv = require('csv')
   , env = process.env.NODE_ENV || 'development'
   , config = require('../../config/config')[env]
   , fs = require('fs')
   , _ = require('underscore')
   , mongosearch = require('../modules/mongosearch')

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

  promise.addBack(function(err, members) {
    Member.count(options.criteria, function(err, count) {
      res.json({
        membersTotal: count,
        members: members,
      });
    });
  });
  Member.list(options, function(err, members) {
    if (err) return promise.error(err);
    return promise.complete(members);
  });
};

exports.edit = function (req, res) {
  var result = { member: req.member};
  res.json(result);
};

exports.save = function (req, res) {
  var promise = new mongoose.Promise;
  promise.addBack(function(err, member) {
    if (err) return res.send(500, {error: "Unable to send member: " + err });
    res.send(200);
  });
  var member = req.member;
  member = _.extend(member, req.body);
  member.fullName = member.firstName + " " + member.lastName;
  member.save(function(err) {
    Publication.find({"member._id": req.member._id}, function(err, existingPubs) {
      existingPubs.forEach(function(existingPub) {
        if (err) {
          promise.err(err);
          return;
        }
        existingPub.member = member;
        existingPub.save(function(err) {
          promise.complete(member);
        });
      });
    })
  });
};

exports.archive = function(req, res) {
  var member = req.member;
  var query = {"member._id": req.member._id};
  var update = { $set: { 'archived': true } };
  var options = {multi: true};
  var cb = function () {
    member.publications = [];
    member.save(function(err) {
      if (!err) { res.send(200, {success: true}) };
    });
  }
  Publication.update(query, update, options, cb);

}

// TODO: Write replace function for modal
