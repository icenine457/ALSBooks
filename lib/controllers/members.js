var mongoose = require('mongoose')
   , Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , csv = require('csv')
   , fs = require('fs')
   , _ = require('underscore')

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
    .from.stream(fs.createReadStream(req.files.importMembersCsv.path))
    .transform(function (row) {
      row.unshift(row.pop());
      emailAddresses = row[6];
      members.push(new Member({
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
      }));
    })
    .on('end', function() {
      console.log("HI");
      Member.create(members, function(err) {
        return res.json(members);
      })
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
  var member = new Member(req.body);
  member.fullName = req.body.firstName + " " + req.body.lastName;

  console.log(JSON.stringify(member));
  member.save(function(err) {
    res.send(200);
  });
};
