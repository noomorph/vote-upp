'use strict';

var Poll = require('../lib/poll');

var polls = [
    new Poll({
        id: 0,
        question: 'Нравится ли идея с завтраками?',
        revotable: true,
        answers: [
            { key: 'A', name: 'Да' },
            { key: 'B', name: 'Нет' }
        ]
    }),
    new Poll({
        id: 1,
        question: 'Лучший завтрак был в..?',
        answers: [
            { key: 'A', name: 'Понедельник' },
            { key: 'B', name: 'Вторник' },
            { key: 'C', name: 'Еще не был' }
            //{ key: 'C', name: 'Среду' },
            //{ key: 'D', name: 'Четверг' },
            //{ key: 'E', name: 'Пятницу' }
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
