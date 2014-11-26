/* global io */
/* jshint browser: true */

(function () {
    'use strict';

    var BAR_COLORS = [
        'rgb(93, 188, 95)',
        'rgb(219, 83, 38)',
        'rgb(38, 200, 236)',
        'rgb(23, 119, 210)',
        'rgb(200, 0, 0)'
    ];

    function BarChart(view) {
        var bars = view.querySelectorAll('.bar');

        this.view = view;
        this.bars = [].slice.call(bars);

        this.answers = {};
    }

    BarChart.prototype.setPoll = function (poll) {
        document.getElementById('question').innerHTML = poll.question;

        this.answers = {};
        poll.answers.forEach(function (answer, index) {
            this.answers[answer.key] = answer;
            answer.color = answer.color || BAR_COLORS[index];

            this.setBar({ count: 0, key: answer.key }, index, 0);
        }, this);
    };

    var transformProperty;

    if ('webkitTransform' in document.body.style) {
        transformProperty = 'webkitTransform';
    } else if ('mozTransform' in document.body.style) {
        transformProperty = 'mozTransform';
    } else {
        transformProperty = 'transform';
    }

    BarChart.prototype.setBar = function (vote, index, max) {
        if (index >= this.bars.length) {
            return;
        }

        var bar = this.bars[index];
        var indicator = bar.getElementsByTagName('i')[0];
        var value = bar.getElementsByTagName('label')[0];

        bar.style.display = vote ? null : 'none';
        if (!vote) { return; }

        var answer = this.answers[vote.key];
        var fraction = max > 0 ? vote.count / max : 0;

        bar.dataset.label = answer.name;
        value.textContent = vote.count + '';
        value.style.height = Math.floor(100 * fraction) + '%';
        indicator.style.backgroundColor = answer.color;

        indicator.style[transformProperty] = 'scale3d(1,' + fraction + ',1)';
    };

    BarChart.prototype.updateValues = function (votes) {
        var max = 0, sum = 0;

        votes = votes.filter(function (vote) {
            return this.answers.hasOwnProperty(vote.key);
        }, this).sort(function (a, b) {
            return b.count - a.count;
        });

        votes.forEach(function (vote) {
            sum += vote.count;
        });

        if (votes[0]) {
            max = max || votes[0].count;
        }

        this.setBar(votes[0], 0, max);
        this.setBar(votes[1], 1, max);
        this.setBar(votes[2], 2, max);
        this.setBar(votes[3], 3, max);
        this.setBar(votes[4], 4, max);

        document.getElementById('votes-count').textContent = sum;
    };

    var socket = io.connect();
    var bar = new BarChart(document.getElementById('chart'));

    socket.on('newPoll', function (newPoll) {
        bar.setPoll(newPoll);
    });

    socket.on('pollStats', function (stats) {
        var keys = Object.keys(stats);
        var votes = keys.map(function (key) {
            return { count: stats[key], key: key };
        });

        bar.updateValues(votes);
    });
}());
