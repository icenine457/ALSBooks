var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')
  , fs = require('fs')
  , csv = require('csv')


mongoose.connect(config.db)

var modelsPath = __dirname + '/../lib/models'
fs.readdirSync(modelsPath).forEach(function (modelFile) {
  require(modelsPath+'/'+modelFile)
});

var Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , PublicationMedia = mongoose.model('PublicationMedia')

process.argv.forEach(function (val, index, array) {
  if(index <= 1) return
  var fileName = val;
  if (fileName == undefined) {
    console.error("File name must be specified")
    process.exit(code=1);
  }
  fs.exists(fileName, function(exists) {
    if (!exists) {
      console.error("File does not exist! " + fileName);
      process.exit(code=1);
    }
    var publications = [];
    csv()
      .from.stream(fs.createReadStream(fileName))
      .transform( function(row) {
        row.unshift(row.pop());
        return row;
      })
      .on("record", function (data, index) {
        Member.findOne({lastName: data[1].split(' ')[0], firstName: data[1].split(' ')[1], inductionYear: data[2]}, function(err, thisMember) {
          // Inside member
          if (!thisMember) {
            console.log("No member found: " + JSON.stringify(data));
            return;
          }
          PublicationMedia.findOne({mediaLabel: data[5]}, function(err, medium) {
            console.log("Publication medium is : " + medium.mediaLabel);
            // Inside publication media
            PublicationMedia.findOne({mediaLabel: 'Unknown'}, function(err, unknownMedium) {
              if (!medium) medium = unknownMedium;
              var publication = new Publication({
                pubTitle: data[3],
                pubYear: data[4],
                pubNotes: data[0],
                verified: true
                member: {
                  _id: thisMember._id,
                  fullName: thisMember.fullName,
                  inductionYear: thisMember.inductionYear
                },
                pubMedium: {
                  _id: medium._id,
                  mediaLabel: medium.mediaLabel
                }
              });
              thisMember.publications.push(publication);
              publication.save(function(err) {
                thisMember.save(function() {
                  console.log("Saved publication: " + publication.pubTitle + " for member: " + publication.member.fullName);
                });
              });
          });
        });
      })
    })
    .on("end", function() {
      console.log("FINISHED");
    });
  });

});

