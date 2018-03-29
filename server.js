#!/usr/bin/env node

var amqp = require('amqplib');
var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid/v4');

var app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

var uri = process.env.RABBITMQ_URI || 'amqp://localhost';
var reqQueue = 'sent2vec-client-to-server';
var resQueue = 'sent2vec-server-to-client';

var channel = null;
var messages = {};

amqp.connect(uri).then(function(conn) {
  conn.createChannel().then(function(ch) {
    channel = ch;
    ch.assertQueue(reqQueue, {durable: false, autoDelete: true});
    ch.assertQueue(resQueue, {durable: false, autoDelete: true});
    ch.consume(resQueue, function(msg) {
      content = JSON.parse(msg.content.toString());
      if (record = messages[content.id]) {
        delete messages[content.id];
        if (record.method == 'encode')
          handleEncodeResponse(content, record.response);
        else if (record.method == 'knn')
          handleKnnResponse(content, record.response);
      }
    }, {noAck: true});
  });
});

app.post('/encode', function(req, res) {
    id = uuid();
    messages[id] = {method: 'encode', response: res};
    body = JSON.stringify({
                            method: 'encode',
                            params: {text: req.body.text},
                            id: id
                          });
    channel.sendToQueue(reqQueue, Buffer.from(body));
});

app.post('/knn', function(req, res) {
    id = uuid();
    messages[id] = {method: 'knn', response: res};
    body = JSON.stringify({
                            method: 'knn',
                            params: {query: req.body.query, k: 3, id: req.body.id},
                            id: id
                          });
    channel.sendToQueue(reqQueue, Buffer.from(body));
});

function handleEncodeResponse(content, res) {
  res.send(JSON.stringify({id: content.result.id}));
}

function handleKnnResponse(content, res) {
  res.send(JSON.stringify(content.result));
}

var server = app.listen(8080);
