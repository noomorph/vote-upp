'use strict';

var Poll = require('../lib/poll');

var polls = [
    new Poll({
        id: 0,
        question: 'Как вам завтрак сегодня?',
        revotable: true,
        answers: [
            { key: 'A', name: 'Нравится' },
            { key: 'B', name: 'Не очень' }
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
