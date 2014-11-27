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
        question: 'Какой браузер лучше всех поддерживает ES6?',
        answers: [
            { key: 'A', name: 'Chrome', color: 'rgb(93, 188, 95)' },
            { key: 'B', name: 'Firefox', color: 'rgb(219, 83, 38)' },
            { key: 'C', name: 'IE', color: 'rgb(38, 200, 236)' },
            { key: 'D', name: 'Safari', color: 'rgb(23, 119, 210)' },
            { key: 'E', name: 'Opera', color: 'rgb(200, 0, 0)' }
        ]
    }),
    new Poll({
        id: 2,
        question: 'Знаком ли вам такой синтаксис?',
        answers: [
            { key: 'A', name: 'Уже юзаю' },
            { key: 'B', name: 'Да, знаком' },
            { key: 'C', name: 'Не знаком' }
        ]
    }),
    new Poll({
        id: 3,
        question: 'Что произойдет с константой?',
        answers: [
            { key: 'A', name: 'Exception!!', color: '#f00', },
            { key: 'B', name: 'Проигнорирует', color: '#fa0' },
            { key: 'C', name: 'Присвоит', color: '#4f4' }
        ]
    }),
    new Poll({
        id: 4,
        question: 'Куда дальше направимся?',
        answers: [
            { key: 'A', name: 'WeakMap' },
            { key: 'B', name: 'Классы' },
        ]
    }),
    new Poll({
        id: 5,
        question: 'Работали ли вы с YIELD?',
        answers: [
            { key: 'A', name: 'Да' },
            { key: 'B', name: 'Немного' },
            { key: 'C', name: 'Нет' }
        ]
    }),
    new Poll({
        id: 6,
        question: 'Работали ли вы с Promise?',
        answers: [
            { key: 'A', name: 'Да' },
            { key: 'B', name: 'Немного' },
            { key: 'C', name: 'Нет' }
        ]
    }),
    new Poll({
        id: 7,
        question: 'Что еще интересно послушать?',
        answers: [
            { key: 'A', name: 'Полифилы' },
            { key: 'B', name: 'Синтаксис' },
            { key: 'C', name: 'Итераторы' },
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
