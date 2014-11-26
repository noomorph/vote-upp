/* global io */
/* jshint browser: true */

window.onload = function () {
    'use strict';

    var DEFAULT_COLORS = [
        'rgb(93, 188, 95)',
        'rgb(219, 83, 38)',
        'rgb(38, 200, 236)',
        'rgb(23, 119, 210)',
        'rgb(200, 0, 0)'
    ];

    var socket = io.connect();
    var section = document.getElementsByTagName('section')[0];
    var header = document.getElementById('question');
    var answers = document.getElementById('answers');
    var ip = document.getElementById('ip');

    var currentPoll = {};

    function renderPoll(pollInfo) {
        pollInfo = pollInfo || currentPoll;
        section.style.display = 'none';

        header.textContent = pollInfo.question;
        ip.textContent = pollInfo.yourIP || 'unknown';
        answers.innerHTML = '';

        pollInfo.answers.forEach(function (item, index) {
            var button, circle, text, color;

            color = item.color || DEFAULT_COLORS[index] || '#aaa';

            circle = document.createElement('i');
            circle.style.setProperty('background-color', color);
            // if (item.key && item.key.length === 1) {
            //     circle.textContent = item.key[0];
            // }

            text = document.createElement('b');
            text.textContent = item.name || item.key;

            button = document.createElement('a');
            button.href = '#' + index;

            if (pollInfo.yourAnswer) {
                if (item.key === pollInfo.yourAnswer) {
                    button.className = 'button selected';
                } else if (!pollInfo.revotable) {
                    button.className = 'button disabled';
                } else {
                    button.className = 'button';
                }
            } else {
                button.className = 'button';
            }

            button.setAttribute('key', item.key);
            button.appendChild(circle);
            button.appendChild(text);
            answers.appendChild(button);
        });

        section.style.display = null;
    }

    function clearButtons(revotable) {
        var buttons = answers.children,
            defaultClass = revotable ? 'button' : 'button disabled',
            btn;

        for (var i = 0; i < buttons.length; i++) {
            btn = buttons[i];

            if (btn.className !== defaultClass) {
                btn.className = defaultClass;
            }
        }
    }

    function pressButton(button) {
        var p = currentPoll,
            key;

        key = button.getAttribute('key');

        if (key && p.yourAnswer !== key) {
            p.yourAnswer = key;
            socket.emit('vote', {
                pollId: currentPoll.id,
                key: key
            });
        }

        clearButtons(p.revotable);
        button.className = 'button selected';
    }

    answers.addEventListener('mousedown', function (e) {
        var p = currentPoll;

        if (p && (p.revotable || !p.yourAnswer)) {
            if (e.target.parentNode === answers) {
                pressButton(e.target);
            } else if (e.target.parentNode.parentNode === answers) {
                pressButton(e.target.parentNode);
            }

            e.preventDefault();
        }
    });

    socket.on('newPoll', function (newPoll) {
        console.dir(newPoll);
        currentPoll = newPoll;
        renderPoll();
    });
};
