'use strict';

var Poll = require('../lib/poll');

var polls = [
    new Poll({
        id: 0,
        question: 'Какие впечатления у вас сейчас?',
        revotable: true,
        answers: [
            { key: 'A', name: 'Интересно' },
            { key: 'B', name: 'Понятно' },
            { key: 'C', name: 'Непонятно' },
            { key: 'D', name: 'Скучно' }
        ]
    }),
    new Poll({
        id: 1,
        question: 'Are you familiar with this syntax?',
        answers: [
            { key: 'Yes', color: '#0f0' },
            { key: 'No', color: '#000' }
        ]
    }),
    new Poll({
        id: 2,
        question: 'Which browser implements most of ES6?',
        answers: [
            { key: 'A', name: 'Chrome' },
            { key: 'B', name: 'Firefox' },
            { key: 'C', name: 'IE' },
            { key: 'D', name: 'Safari' },
            { key: 'E', name: 'Opera' }
        ]
    }),
    new Poll({
        id: 3,
        question: 'What will happen in this case?',
        answers: [
            { key: 'A', name: 'Throws exception', color: '#f00', },
            { key: 'B', name: 'Ignores assignemnt', color: '#fa0' },
            { key: 'C', name: 'Assigns the value', color: '#4f4' }
        ]
    })
];

module.exports = function (id) {
    var res = polls.filter(function (item) {
        if (item.id === +id) {
            return item;
        }
    });

    return res.length ? res[0] : null;
};
