/* jshint browser: true */

window.onload = function () {
    'use strict';

    var view = document.getElementById('answers');

    var answers = {
        onMouseOver: function () {
            //debugger;
        },
        onMouseOut: function () {
            //debugger;
        },
        onMouseDown: function () {
            //debugger;
        },
        onMouseUp: function () {
            //debugger;
        }
    };

    view.addEventListener('mouseover', answers.onMouseOver);
    view.addEventListener('mouseout', answers.onMouseOut);

    view.addEventListener('mousedown', answers.onMouseDown);
    view.addEventListener('mouseup', answers.onMouseUp);
};
