var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

// TODO: Use config files!
memberProvider = function(host, port) {
  this.db = new Db('alsBooks', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

memberProvider.prototype.getCollection = function(callback) {
  this.db.collection('members', function(error, member_collection) {
    if (error) callback (error);
    else callback(null, member_collection)
  });
};

memberProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, member_collection) {
    if(error) callback(error)
    else {
      member_collection.find().toArray(function(results) {
        if (error) callback(error);
        else callback(null, results);
      });
    };
  });
};

memberProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, member_collection) {
    if (error) callback(error);
    else {
      member_collection.findOne({_id: db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if (error) callback(error);
          else callback(null, results);
      });
    }
  });
};

memberProvider.prototype.findByNameAndALSId = function(firstName, lastName, alsMemberId, callback) {
  this.getCollection(function(error, member_collection) {
    if( error) callback(error)
    else {
      member_collection
        .findOne({'firstName' : firstName, lastName: 'lastName','alsMemberId' : alsMemberId}, function(error, result) {
          if (error) callback(error)
          else callback(null, results)
      });
    }
  })
};

memberProvider.prototype.save = function(members, callback) {
  this.getCollection(function(error, member_collection) {
    if( error ) callback(error)
    else {
      if( typeof(members.length)=="undefined") members = [members];
      for ( var i =0;i< members.length;i++ ) {
        member = members[i];
        member.createdOn = new Date();
        if( member.publications === undefined ) member.publications = [];
        for(var memberIterator = 0; memberIterator< member.publications.length; memberIterator++) {
          member.comments[memberIterator].createdOn = new Date();
        }
      }
      member_collection.insert(members, function() {
        callback(null, members);
      });
    }
  });
};

exports.memberProvider = memberProvider;
