/* jshint browser: true */
/* global io, radialProgress */

var socket = io.connect('http://127.0.0.1/'),
    app = app || {};

window.addEventListener('load', function () {
    'use strict';

    var $ = document.querySelector.bind(document),
	    $voteUp = $('#vote-up'),
		$voteDown = $('#vote-down'),
        $voteCircle = $('#vote-circle'),
        d3Circle = radialProgress($voteCircle)
                       .diameter(150)
                       .value(0)
                       .render();

	socket.on('stats', function (data) {
        var all = ((+data.yes) + (+data.no));
        var percent = Math.round(100 * (+data.yes) / all);

        if (isNaN(percent)) {
            percent = 0;
        }

        percent = Math.max(0, Math.min(100, percent));
        d3Circle.value(percent).render();
	});
	
    $voteUp.onclick = function () {
        socket.emit('vote', { direction: true });
    };

    $voteDown.onclick = function () {
        socket.emit('vote', { direction: false });
    };
});
