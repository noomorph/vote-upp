'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var device  = require('express-device');
var runningPortNumber = 80; //process.env.PORT || 80;
var securityCode = process.argv[2];

if (!securityCode) {
    console.error('run with security code!!');
    process.exit(-1);
} else {
    securityCode = securityCode.trim();
}

var polls = require(__dirname + '/data/polls.js');

var defaultPoll = polls(0);
defaultPoll.open();

var currentPoll = defaultPoll;

function setNewPoll(newPoll) {
    if (!newPoll) {
        return;
    }

    if (currentPoll && !currentPoll.revotable) {
        currentPoll.close();
    }

    currentPoll = newPoll;
    currentPoll.open();
    return true;
}

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

function validateRequest(req) {
    if (!req) { return false; }
    if (!req.query) { return false; }
    if (req.query.auth !== securityCode) { return false; }

    return true;
}

app.get('/poll/open/:id', function (req, res) {
    var success = validateRequest(req);

    if (success) {
        success = setNewPoll(polls(req.params.id));
    }

    if (success) {
        io.sockets.clients().forEach(function (socket) {
            var ip = socket.handshake.address.address;
            var poll = currentPoll.canVote(ip) ? currentPoll : defaultPoll;
            socket.emit('newPoll', poll.toVoter(ip));
        });

        io.sockets.emit('pollStats', currentPoll.countVotes());
    }

    res.json({
        success: !!success
    });
});

app.get('/poll/close', function (req, res) {
    var success = validateRequest(req);

    if (success) {
        success = setNewPoll(defaultPoll);
    }

    if (success) {
        io.sockets.clients().forEach(function (socket) {
            var ip = socket.handshake.address.address;
            var poll = currentPoll.canVote(ip) ? currentPoll : defaultPoll;
            socket.emit('newPoll', poll.toVoter(ip));
        });

        io.sockets.emit('pollStats', currentPoll.countVotes());
    }

    res.json({
        success: !!success
    });
});

io.sockets.on('connection', function (socket) {
    var ip = socket.handshake.address.address;
    var poll = currentPoll && currentPoll.canVote(ip) ? currentPoll : defaultPoll;

    socket.emit('newPoll', poll.toVoter(ip));
    socket.emit('pollStats', poll.countVotes());

    socket.on('vote', function (data) {
        var pollId = +data.pollId,
            poll = polls(pollId),
            key = data.key;

        if (poll.vote(pollId, ip, key)) {
            if (poll === currentPoll) {
                io.sockets.emit('pollStats', currentPoll.countVotes());
            }
        } else {
            console.log('reject vote');
        }

        if (!poll.canVote(ip)) {
            socket.emit('newPoll', defaultPoll.toVoter(ip));
        }
    });
});

server.listen(runningPortNumber, '0.0.0.0');
