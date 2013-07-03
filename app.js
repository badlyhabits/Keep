
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , NoteProvider = require('./noteprovider').NoteProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var noteProvider = new NoteProvider('localhost', 27017);
// var notes = [{title: 'note1', content: 'content', created: new Date()}];

// Routes
app.get('/', function(req, res) {
  noteProvider.findAll(function(err, notes) {
    res.render('index', {
      title: 'Notes',
      notes: notes
    });
  });
});

app.post('/', function(req, res) {
  noteProvider.create({
    title: req.param('title'),
    content: req.param('content')
  }, function(err, docs) {
      res.redirect('/');
  });
});

app.get('/note/:id/update', function(req, res) {
  noteProvider.findById(req.param('_id'), function(err, note) {
    res.render('note_update', {
      title: note.title,
      note: note
    });
  });
});

app.post('/note/:id/update', function(req, res) {
  noteProvider.update(req.param('_id'), {
    title: req.param('title'),
    content: req.param('content')
  }, function(error, docs) {
    console.log("app", error);
    console.log("app", docs);
    // res.redirect('/');
  });
});

app.post('/note/:id/delete', function(req, res) {
  noteProvider.delete(req.param('_id'), function(err, docs) {
    res.redirect('/');
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
