/* jshint browser: true */
/* global io, radialProgress */

var $ = document.querySelector.bind(document),
    socket = io.connect(),
    app = app || {};


window.addEventListener('load', function () {
    'use strict';

    var $voteUp = $('#vote-up'),
		$voteDown = $('#vote-down'),
        $voteCircle = $('#vote-circle'),
        d3Circle = radialProgress($voteCircle),
        circleDiameter = $('section').offsetWidth,
        percent = 0;

    function resizeCircle() {
        circleDiameter = 300;
        var r = -circleDiameter / 2;

        var style = $('#vote-circle').style;
        style.marginTop  = r + 'px';
        style.marginLeft = r + 'px';

        d3Circle.diameter(circleDiameter).value(percent).render();
    }

    resizeCircle();

	socket.on('stats', function (data) {
        var all = ((+data.yes) + (+data.no));
        percent = Math.round(100 * (+data.yes) / all);

        if (isNaN(percent)) {
            percent = 0;
        }

        percent = Math.max(0, Math.min(100, percent));
        d3Circle.value(percent).render();
	});

    $voteUp.onclick = function () {
        socket.emit('vote', { direction: true });
        $voteDown.style.display = 'none';
    };

    $voteDown.onclick = function () {
        socket.emit('vote', { direction: false });
        $voteUp.style.display = 'none';
    };

    document.addEventListener('touchstart', function (e) {
        e.target.classList.add('touched');
    });

    document.addEventListener('touchend', function (e) {
        e.target.classList.remove('touched');
    });

    document.addEventListener('touchcancel', function (e) {
        e.target.classList.remove('touched');
    });

    window.addEventListener('resize', resizeCircle);

    window.addEventListener('orientationchange', resizeCircle);
});
