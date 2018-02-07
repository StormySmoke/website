var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

// Handle querying of nearest neighbours
app.post('/query', function(req, res) {
    res.send(req.body.query + " [PROCESSED]");
});

// Handle indexing of text
app.post('/index', function(req, res) {
    res.send("Text successfully indexed.");
});

var server = app.listen(process.env.PORT || 8080);
