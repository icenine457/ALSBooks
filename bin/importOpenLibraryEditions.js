var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')
  , fs = require('fs')
  , csv = require('csv')
  , promisify = require('deferred').promisify
  , _ = require('underscore')
  , olEditions = require('node-openlibrary-editions')

mongoose.connect(config.db)

var modelsPath = __dirname + '/../lib/models'
fs.readdirSync(modelsPath).forEach(function (modelFile) {
  require(modelsPath+'/'+modelFile)
});

// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
RegExp.escape= function(s) {
  return s.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
};

var medium = {
  "_id" : "51185e4052a32f69b3f4f59c",
  "googleLabel" : "BOOK",
  "mediaLabel" : "Book"
};

var Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , PublicationMedia = mongoose.model('PublicationMedia')

Member.pFind = promisify(Member.find);
Publication.pFind = promisify(Publication.find);

var memberProcess = function(members) {
    members.forEach(processSingleMember);
}

var processSingleMember = function(member) {


  member.openLibraryPubIds.forEach(function(id) {
    olEditions.Client().getEditionsByWorkId(id, function(what, records) {
      if (!records) {
        return;
      };

      var memberPubs = member.publications;
      records.forEach(function(record) {
        var pubReg = new RegExp(RegExp.escape(record.title), "gi");
        Publication.pFind({"member._id": member._id}).end(function(publications) {
          if (!memberPubs) {
            memberPubs = publications;
          }

          console.log(publications.length);
          var publication = _.find(publications, function(pub) {
            return pub.pubTitle.match(pubReg);
          });

          if (!publication) {
            publication = _.find(memberPubs, function(pub) {
              return pub.pubTitle.match(pubReg);
            });
          }

          if (publication) {
            console.log ("EXISTING PUBLICATION FOUND");
          };

          var identifiers = [];

          if (record.isbn_13) {
            identifiers.push({
              type: 'isbn13',
              identifier: record.isbn_13,
            });

          }

          if (record.isbn_10) {
            identifiers.push({
              type: 'isbn10',
              identifier: record.isbn_10,
            });

          }

          if (record.oclc) {
            identifiers.push({
              type: 'oclc',
              identifier: record.oclc,
            });

          }

          if (record.identifiers && record.identifiers.amazon) {
            console.log("AMAZON ID: " + record.identifiers.amazon)
            identifiers.push({
              type: 'amazon',
              identifier: record.identifiers.amazon,
            });
          }

          var notes = '';

          if (record.notes && record.notes.type == '/types/text') {
            notes = record.notes.value;
          }


          if (!publication) {
            publication = new Publication({
              pubTitle: record['title'],
              pubYear: null,
              pubNotes: notes,
              subTitle: record['subtitle'],
              subjects: record['subjects'],
              // TODO: Resolve other authors
              openLibraryAuthors: record['authors'],
              otherTitles: record['otherTitles'],
              subjects: record['subjects'],
              latestRevision: record['latest_revision'],
              publishers: record['publishers'],
              openLibraryWorkId: id,
              verified: false,
              imported: true,
              pubMedium: medium,
            });
          }

          publication.member = {
              _id: member._id,
            fullName: member.fullName,
            inductionYear: member.inductionYear
          };

          if (record.identifiers && record.identifiers.google && !publication.googleId) {
            publication.googleId = record['identifers']['google'][0];
          }

          if (!publication.editions) {
            publication.editions = [];
          }

          if (!publication.identifiers) {
            publication.identifiers= [];
          }

          var newEdition = {
            revision: record.revision,
            openLibraryCovers: record.covers,
          };
          publication.editions.push(newEdition);
          publication.identifiers.push(identifiers);


          if (!publication) {
            console.log("NULL PUBLICATION? " + member.fullName + ", " + record.key + ", " +  id + ", " + publication.pubTitle)
              process.exit(code=1);

          }
          //console.log(publication);

          // Update logic goes here
          member.publications = _.reject(member.publications, function(pub) {
            pub._id == publication._id;
          });

          member.publications.push(publication);
          memberPubs = member.publications;

          publication.save(function(err) {
            member.save(function() {
              console.log("Saved publication: " + publication.pubTitle + " for member: " + publication.member.fullName);
            });
          });


        })
      });
    })
  });
};



Member.pFind({ openLibraryPubIds: { $exists: true } }).end(memberProcess);


