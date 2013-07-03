var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

NoteProvider = function(host, port) {
  this.db = new Db('node-mongo-note', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(err, db) {
    if (!err) {
      console.log("Database connected");
    }
  });
};

NoteProvider.prototype = {

  getCollection: function(callback) {
    this.db.collection('notes', function(error, note_collection) {
      (error) ? callback(error) : callback(null, note_collection);
    });
  }, // getCollection

  findAll: function(callback) {
    this.getCollection(function(error, note_collection) {
      if (error) {
        callback(error);
      }
      else {
        note_collection.find().toArray(function(error, results) {
          (error) ? callback(error) : callback(null, results);
        });
      }
    });
  }, // findAll

  findById: function(id, callback) {
    this.getCollection(function(err, note_collection) {
      if (err) {
        callback(err);
      }
      else {
        note_collection.findOne({_id: note_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, result);
          }
        });
      }
    });
  }, //findById

  create: function(notes, callback) {
    this.getCollection(function(err, note_collection) {
      if (err) {
        callback(err);
      }
      else {
        if (typeof(notes.length) == 'undefined') {
          notes = [notes];
        }

        for (var i = 0; i < notes.length; i++) {
          note = notes[i];
          var date = new Date();
          note.created_at = date;
          note.created = date.getDay() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
        };

        note_collection.insert(notes, function() {
          callback(null, notes);
        });
      }
    });
  }, // create

  update: function(noteId, notes, callback) {
    this.getCollection(function(err, note_collection) {
      if (err) {
        callback(err);
      }
      else {
        note_collection.update(
                               {_id: note_collection.db.bson_serializer.ObjectID.createFromHexString(noteId)},
                               notes,
                               function(err, notes) {

          if (err) {
            console.log("err", err);
            callback(err);
          }
          else {
            console.log(notes);
            callback(null, notes);
          }
        });
      }
    });
  }, // update

  delete: function(noteId, callback) {
    this.getCollection(function(err, note_collection) {
      if (err) {
        callback(err);
      }
      else {
        note_collection.remove({_id: note_collection.db.bson_serializer.ObjectID.createFromHexString(noteId)}, function(err, note) {
          (err) ? callback(err) : callback(null, note);
        });
      }
    });
  } //delete

};

exports.NoteProvider = NoteProvider;