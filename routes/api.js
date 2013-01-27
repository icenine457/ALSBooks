/*
 * Serve JSON to our AngularJS client
 */

var csv = require('csv');
var memberProvider = require('../lib/providers/memberProvider.js').memberProvider;

exports.importMembers = function (req, res) {
  var members = [];
  var newMembers = [];
  csv()
    .from.stream(fs.createReadStream(req.files.importMembersCsv.path))
    .transform(function (row) {
      row.unshift(row.pop());
      return row;
    })
    .on('record', function(row, index) {
      var member = {
        'alsMemberId': row[0],
        'pubVerificationStatus': row[1],
        'fullName': row[3] + " " + row[2],
        'firstName': row[3],
        'lastName': row[2],
        'inductionYear': row[4],
        'emailAddresses': row[5].replace(/" /g, "").split(","),
        'contactDetails' : [{
          'phoneNumber': row[6],
          'streetAddress1': row[7],
          'streetAddress2': row[8],
          'city': row[9],
          'state': row[10],
          'zip': row[11],
          'country': row[12],
        }],
        'notes': row[13]
      };
      members.push(member);
      for(var memberIterator = 0; memberIterator <= members.length; memberIterator++) {
        var thisMember = members[memberIterator];
        var oldMember = memberProvider.findByNameAndALSId(member.firstName, member.lastName, member.alsMemberId);
        if (oldMember) {
          members.splice(memberIterator, 1)
          memberIterator--;
          continue;
        }
        newMembers.push(thisMember);
      }
      memberProvider.save(newMembers, function(errors, members) { return members.length() });
    });
};

exports.publications = function (req, res) {
};
