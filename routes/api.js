/*
 * Serve JSON to our AngularJS client
 */

var express = require('express'),
    db = require('../config').db,
   csv = require('csv'),
    fs = require('fs');

exports.importMembers = function (req, res) {
  var members = [];
  //var newMembers = [];
  csv()
    .from.stream(fs.createReadStream(req.files.importMembersCsv.path))
    .transform(function (row) {
      row.unshift(row.pop());
      emailAddresses = row[6];
      members.push({
        'alsMemberId': row[1],
        'pubVerificationStatus': row[2],
        'fullName': row[4] + " " + row[3],
        'firstName': row[4],
        'lastName': row[3],
        'inductionYear': row[5],
        'emailAddresses': ( emailAddresses.length > 0 ? emailAddresses.replace(/" /g, "").split(",") : []),
        'contactDetails' : [{
          'phoneNumber': row[7],
          'streetAddress1': row[8],
          'streetAddress2': row[9],
          'city': row[10],
          'state': row[11],
          'zip': row[12],
          'country': row[13],
        }],
        'notes': row[14],
        'createdOn': new Date(),
        'publications': []
      });
    })
    .on('end', function() {
      db.collection('members').insert(members, function(errors, savedMembers) { return members.length });
      return res.json(members);
    });
};

exports.members = function (req, res) {
  db.collection('members').find().toArray(function(err, members) {
    res.json(members);
  });
};

exports.editMember = function (req, res) {
  var result = {
    member: null,
    pubMedia: null
  };
  db.collection('members').findOne({_id: db.toId(req.params["id"])}, function(err, member) {
    result.member = member;
    db.collection('publicationMedia').find().toArray(function(err, pubMedia) {
      result.pubMedia = pubMedia
      res.json(result)
    });
  });
};

exports.saveMember = function (req, res) {
  var id = db.toId(req.params.id);

  var member = req.body;
  delete member._id;
  member.fullName = req.body.firstName + " " + req.body.lastName;

  db.collection('members').update({_id: id}, member, {w: 1}, function(err, collection) {
    res.json(true);
  });
};

exports.savePublication = function (req, res) {
  var publication = {
    pubMedium: req.body.publication.pubMedium,
    pubTitle: req.body.publication.pubTitle,
    pubYear: req.body.publication.pubYear,
    pubNotes: req.body.publication.pubNotes,
    _id: req.body.publication._id
  };
  db.collection('members').findOne({_id: db.toId(req.body.member._id)}, function(err, member) {
    if (err != null) {
        return res.send(500, {error: "Failed to locate member:  " + err});
    }
    if (publication._id == 0) {
      publication._id = db.ObjectID();
      publication.createdOn = new Date();
    }
    else {
      for (var pppp = 0; pppp < member.publications.length; pppp++) {
        var thisPub = member.publications[pppp];
        if (thisPub._id != publication._id) {
          continue;
        }
        member.publications.splice(pppp, 1);
      }
    };

    if (member.publications === undefined) {
      member.publications = [];
    }

    member.publications.push(publication);

    db.collection('members').update({_id: member._id}, member, {w: 0}, function(err, collection) {
      if (err != null) {
        return res.send(500, {error: "Error saving member: " + err});
      }
      publication.member = {
        _id:  member._id,
        fullName: member.fullName,
        inductionYear: member.inductionYear
      };
      db.collection('publications').update({_id: publication._id}, publication, {upsert:true}, function(err, collection) {
        res.send(200);
      });
    });

  })
};

exports.publications = function (req, res) {
  db.collection('publications').find().toArray(function(err, publications) {
    res.json(publications);
  });
};
