var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')
  , fs = require('fs')
  , csv = require('csv')
  , promisify = require('deferred').promisify
  , _ = require('underscore')

mongoose.connect(config.db)

var modelsPath = __dirname + '/../lib/models'
fs.readdirSync(modelsPath).forEach(function (modelFile) {
  require(modelsPath+'/'+modelFile)
});

var Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , PublicationMedia = mongoose.model('PublicationMedia')

Member.pFind = promisify(Member.find);

Member.pFind({})
.end(function(members) {
  var fileName = process.argv[2]
  csv()
    .from.stream(fs.createReadStream(fileName), {delimiter: '\t'})
    .transform( function(row) {
      row.unshift(row.pop());
      return row;
    })
    .on('error', function(error) {
      console.log(error);
      process.exit(0);
    })
    .on('record', function(data, index) {
      try {
        JSON.parse(data[0]);
      }
      catch (e) {
        console.log("Invalid JSON at line: " + index)
        return;
      }
      var json = JSON.parse(data[0]);
      members.forEach(function(member) {
        var firstNameRg = new RegExp('^' + member.firstName);
        var lastNameRg = new RegExp(member.lastName + '$');
        try {
          if (json.name.match(firstNameRg, 'i') && json.name.match(lastNameRg, 'i')) {
            // Match found, spit it out
            var oid = data[2].split('/')[2];
            if (!(member.openLibraryIds instanceof Array)
                || (member.openLibraryIds.indexOf(oid) === -1 )) {
              member.openLibraryIds.push(oid);
              member.save(function(err) {
                console.log("Found a match: " + oid + " for member: " + member.fullName)
              });
            }
          }
        }
        catch (e) {
          console.log("Error at line " + index + "; Exception: " + e);
          return false;
        }
      })
    })
    .on('end', function(count) {
      console.log("FINISHED");
      process.exit(0);
    });

});


