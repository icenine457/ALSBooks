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
        res.json(members);
      });
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
