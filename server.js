var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

var amqp = require('amqplib/callback_api');

var uri = process.env.CLOUDAMQP_URL;
var queueName = 'website-to-sent2vec';
var replyQueueName = null;
var channel = null;
var correlationId = null;

var resQuery = null;
var resIndex = null;

amqp.connect(uri, function(err, conn) {
  conn.createChannel(function(err, ch) {
    channel = ch;
    ch.assertQueue(queueName, {durable: false});
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      replyQueueName = q
      ch.consume(q.queue, function(msg) {
          if (msg.properties.correlationId == correlationId) {
            json = msg.content.toString();
            obj = JSON.parse(json);
            if (obj.result == null) {
              handleIndexResponse(obj);
            } else {
              handleQueryResponse(obj);
            }
          }
        }, {noAck: true}); 
    });
  });
});

function handleQueryResponse(obj) {
  k = obj.result[0].length
  arr = []
  for (var i = 0; i < k; i++) {
    e = {sentence: obj.result[0][i], distance: obj.result[1][i]}
    arr.push(e);
  }
  resQuery.send(JSON.stringify(arr));
}

function handleIndexResponse(res) {
  resIndex.send("Text successfully indexed.");
}

function sendQueryMsg(sentence, k) {
  correlationId = generateUuid();
  obj = {method: "query", params: [sentence, k] };
  json = JSON.stringify(obj);
  channel.sendToQueue(queueName, new Buffer(json),
                      {correlationId: correlationId, replyTo: replyQueueName.queue});
  
}

function sendIndexMsg(text) {
  correlationId = generateUuid();
  obj = {method: "index", params: text };
  json = JSON.stringify(obj);
  channel.sendToQueue(queueName, new Buffer(json),
                      {correlationId: correlationId, replyTo: replyQueueName.queue});
  
}

// Handle querying of nearest neighbours
app.post('/query', function(req, res) {
    resQuery = res;
    sendQueryMsg(req.body.query, 3);
});

// Handle indexing of text
app.post('/index', function(req, res) {
    resIndex = res;
    sendIndexMsg(req.body.text);
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

var server = app.listen(process.env.PORT || 8080);

