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
      members.push({
        'alsMemberId': row[1],
        'pubVerificationStatus': row[2],
        'fullName': row[4] + " " + row[3],
        'firstName': row[4],
        'lastName': row[3],
        'inductionYear': row[5],
        'emailAddresses': row[6].replace(/" /g, "").split(","),
        'contactDetails' : [{
          'phoneNumber': row[7],
          'streetAddress1': row[8],
          'streetAddress2': row[9],
          'city': row[10],
          'state': row[11],
          'zip': row[12],
          'country': row[13],
        }],
        'notes': row[14]
      });
    })
    .on('end', function() {
      db.collection('members').insert(members, function(errors, savedMembers) { return savedMembers.length });
      return res.json(members);
    });
};

exports.members = function (req, res) {
  db.collection('members').find().toArray(function(err, members) {
    res.json(members);
  });
};

exports.publications = function (req, res) {
};
