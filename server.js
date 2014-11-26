'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var device  = require('express-device');
var runningPortNumber = 8081;
var polls = require(__dirname + '/data/polls.js');
var currentPoll = null;
var currentVotes = null;

function setNewPoll(newPoll) {
    if (!newPoll) {
        return;
    }

    if (currentPoll) {
        currentPoll.close();
    }

    currentPoll = newPoll;
    currentVotes = newPoll.countVotes();
    currentPoll.open();
    return true;
}

setNewPoll(polls(0));

app.configure(function () {
    app.use(express.static(__dirname + '/public'));

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    app.use(device.capture());
});

app.use(function (req, res, next) {
    // output every request in the array
    console.log({
        method: req.method,
        url: req.url,
        device: req.device
    });

    // goes onto the next function in line
    next();
});

app.get('/poll/open/:id', function (req, res) {
    var success = setNewPoll(polls(req.params.id));

    io.sockets.emit('newPoll', currentPoll.toVoter(''));
    io.sockets.emit('pollStats', currentVotes);

    res.json({
        success: !!success
    });
});

io.sockets.on('connection', function (socket) {
    var ip = socket.handshake.address.address;
    socket.emit('newPoll', currentPoll.toVoter(ip));
    socket.emit('pollStats', currentVotes);

    socket.on('vote', function (data) {
        var pollId = data.pollId,
            key = data.key;

        if (currentPoll.vote(pollId, ip, key)) {
            currentVotes = currentPoll.countVotes();
            io.sockets.emit('pollStats', currentVotes);
        } else {
            console.log('discarded vote', data);
        }
    });
});

server.listen(runningPortNumber, '0.0.0.0');
