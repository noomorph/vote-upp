/* jshint browser: true */
(function () {
    'use strict';

    var BAR_COLORS = [
        'rgb(93, 188, 95)',
        'rgb(219, 83, 38)',
        'rgb(38, 200, 236)',
        'rgb(23, 119, 210)',
        'rgb(200, 0, 0)',
    ];

    function BarChart(view) {
        var bars = view.querySelectorAll('.bar');

        this.view = view;
        this.bars = [].slice.call(bars);

        this.options = {};
    }

    BarChart.prototype.setPoll = function (poll) {
        document.getElementById('question').innerHTML = poll.question;

        this.options = {};
        poll.options.forEach(function (option, index) {
            this.options[option.name] = option;
            option.color = option.color || BAR_COLORS[index];

            this.setBar({ count: 0, option: option.name }, index, 0);
        }, this);
    };

    var transformProperty;

    if ("webkitTransform" in document.body.style) {
        transformProperty = "webkitTransform";
    } else if ("mozTransform" in document.body.style) {
        transformProperty = "mozTransform";
    } else {
        transformProperty = "transform";
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

        var option = this.options[vote.option];
        var fraction = max > 0 ? vote.count / max : 0;

        bar.dataset.label = option.name;
        value.textContent = vote.count + '';
        value.style.height = Math.floor(100 * fraction) + '%';
        indicator.style.backgroundColor = option.color;

        indicator.style[transformProperty] = 'scale3d(1,' + fraction + ',1)';
    };

    BarChart.prototype.updateValues = function (votes) {
        var max = 0, sum = 0;

        votes = votes.filter(function (vote) {
            return this.options.hasOwnProperty(vote.option);
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


    function demo() {
        var bar = new BarChart(document.getElementById('chart')),
            votes = [
                { count: 0, option: 'Chrome' },
                { count: 0, option: 'Firefox' },
                { count: 0, option: 'IE' },
                { count: 0, option: 'Safari' },
                { count: 0, option: 'Opera' },
            ];

        bar.setPoll({
            question: 'Which browser implements<br/>most of ES6 features?',
            options: [
                { name: 'Chrome',  color: 'rgb(93, 188, 95)' },
                { name: 'Firefox', color: 'rgb(219, 83, 38)' },
                { name: 'IE',      color: 'rgb(38, 200, 236)' },
                { name: 'Safari',  color: 'rgb(23, 119, 210)' },
                { name: 'Opera',   color: 'rgb(200, 0, 0)' },
            ]
        });

        function vote() {
            var rnd = Math.random();

            if (rnd < 0) {
            } else if (rnd < 0.4) {
                votes[0].count++;
            } else if (rnd < 0.7) {
                votes[1].count++;
            } else if (rnd < 0.9) {
                votes[2].count++;
            } else if (rnd < 0.95) {
                votes[3].count++;
            } else if (rnd < 1) {
                votes[4].count++;
            }

            bar.updateValues(votes);
        }

        (function voteRandomly() {
            vote();
            setTimeout(voteRandomly, Math.random() * 3000);
        }());
    }

    demo();
}());
