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

Member.pFind({ openLibraryIds: { $exists: true } })
.end(function(members) {
  var fileName = process.argv[2]
  csv()
    .from.stream(fs.createReadStream(fileName), {delimiter: '\t'})
    .transform( function(row) {
      row.unshift(row.pop());
      return row;
    })
    .on('error', function(error) {
      console.error(error);
      process.exit(0);
    })
    .on('record', function(data, index) {
      try {
        JSON.parse(data[0]);
      }
      catch (e) {
        console.error("Invalid JSON at line: " + index)
        return;
      }
      var json = JSON.parse(data[0]);
      members.forEach(function(member) {
        if (!(member.openLibraryIds instanceof Array)) return
        try {
          var authors = json.authors;
          member.openLibraryIds.forEach(function(oid) {
            authors.forEach(function(authorRecord) {
              if (authorRecord.author.key == "/authors/" + oid) {
                var workOid = data[2].split('/')[2]
                // Match found! Praise be to Zion.
                if (!(member.openLibraryPubIds instanceof Array)) {
                  member.openLibraryPubIds = [];
                }

                if ( member.openLibraryPubIds.indexOf(workOid) != -1) {
                  return;
                }

                member.openLibraryPubIds.push(workOid);
                member.save(function(err) {
                  console.log("Found publication for: " + member.fullName + "; OID: " + workOid)
                });

              }
            });
          });
        }
        catch (e) {
          console.error("Error at line " + index + "; Exception: " + e);
          return false;
        }
      })
    })
    .on('end', function(count) {
      console.log("FINISHED");
      process.exit(0);
    });

});


