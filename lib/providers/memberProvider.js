var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

// TODO: Use config files!
MemberProvider = function(host, port) {
};

MemberProvider.prototype.getCollection = function(callback) {
  this.db.collection('members', function(error, member_collection) {
    if (error) callback (error);
    else callback(null, member_collection)
  });
};

MemberProvider.prototype.findByAlsId = function(alsMemberId, callback) {
  this.getCollection(function(error, member_collection) {
    if( error) callback(error)
    else {
      member_collection
        .findOne({'alsMemberId' : alsMemberId}, function(error, result) {
          if (error) callback(error)
          else callback(null, results)
      });
    }
  })
};

MemberProvider.prototype.save = function(members, callback) {

  var db = new Db('alsBooks', new Server(host, port), {safe: true} );
  db.open(function(err, client) {
    client.createCollection("members", function(error, col) {
      client
    }
    this.getCollection(function(error, member_collection) {
      if( error ) {
        callback(error)
      }
      else {
        if( typeof(members.length)=="undefined") {
          members = [members];
        }

        for ( var i =0;i< members.length; i++ ) {
          var member = members[i];
          member.createdOn = new Date();
          if( member.publications === undefined ) {
            member.publications = [];
          }
          /*
          for(var publicationIterator = 0; publicationIterator < member.publications.length; publicationIterator++) {
            member.publications[memberIterator].createdOn = new Date();
          }
          */
        }
        member_collection.insert({foo: 'bar'}, function() {
          callback(null, members);
        });
      }
    });
  });
};

exports.MemberProvider = MemberProvider;
