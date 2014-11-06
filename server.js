'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var device  = require('express-device');
var runningPortNumber = 8080;

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

//app.get('/', function (req, res) {
	//res.render('index', {});
//});

var votes = {};

function collectStats(result) {
    var keys = Object.keys(votes),
        sum = 0;

    keys.map(function (key) {
        if (votes[key] === result) {
            sum++;
        }
    });

    return sum;
}

function emitStats() {
	io.sockets.emit('stats', {
        yes: collectStats(true),
        no:  collectStats(false)
    });
}

io.sockets.on('connection', function (socket) {
    var ip = ""+Math.random(); //socket.handshake.address;
    emitStats();

	socket.on('vote', function (data, fn) {
        votes[ip] = data.direction;
        emitStats();
        if (fn) { fn(); }
	});
});

server.listen(runningPortNumber, "0.0.0.0");
