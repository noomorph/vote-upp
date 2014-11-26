'use strict';

function Poll(options) {
    this.id = options.id;

    this.question = options.question;
    this.revotable = Boolean(options.revotable);
    this.answers = {};
    this.answerIds = [];

    options.answers.forEach(function (answer, index) {
        var key;

        if (typeof answer === 'string') {
            key = '' + (index + 1);
            this.answers[key] = { key: key, name: answer };
        } else {
            key = answer.key;
            answer.name = answer.name || key;
            this.answers[key] = answer;
        }

        this.answerIds.push(key);
    }, this);

    this.validate();

    this.votes = {};
    this.opened = false;
    this.timeOpened = null;
    this.timeClosed = null;
}

Poll.prototype.toVoter = function (voterIP) {
    var answers = this.answerIds.map(function (id) {
        return this.answers[id];
    }, this);

    var voterAnswer = this.votes[voterIP];

    console.log('voter', voterAnswer);

    return {
        id: this.id,
        revotable: this.revotable,
        question: this.question,
        answers: answers,
        yourAnswer: voterAnswer && voterAnswer.key,
        yourIP: voterIP
    };
};

Poll.prototype.validate = function () {
    if (typeof this.id === 'undefined') {
        throw new Error('poll id was not specified');
    }
    if (typeof this.id !== 'number') {
        throw new Error('poll id must be a number');
    }

    if (typeof this.question !== 'string' || this.question.length < 1) {
        throw new Error('poll question must be specified');
    }

    if (typeof this.answers !== 'object') {
        throw new Error('poll answers must be specified');
    }

    var answersCount = Object.keys(this.answers).length;

    if (answersCount < 2) {
        throw new Error('poll answers count must be at least 2, but was ' + answersCount);
    }
};

Poll.prototype.open = function () {
    this.opened = true;
    this.timeOpened = Date.now();
    this.timeClosed = null;
};

Poll.prototype.close = function () {
    if (this.opened) {
        this.opened = false;
        this.timeClosed = Date.now();
    }
};

Poll.prototype.getSize = function () {
    return this.answerIds.length;
};

Poll.prototype.getVoters = function () {
    return Object.keys(this.votes);
};

Poll.prototype.vote = function (pollId, voterId, key) {
    if (!this.opened) {
        return false;
    }

    if (!this.answers.hasOwnProperty(key)) {
        return false;
    }

    if (!this.revotable && this.votes.hasOwnProperty(voterId)) {
        return false;
    }

    if (typeof voterId !== 'string') {
        return false;
    }

    if (voterId.length < 1) {
        return false;
    }

    if (this.id !== +pollId) {
        return false;
    }

    this.votes[voterId] = {
        key: key,
        time: Date.now()
    };

    return true;
};

Poll.prototype.countVotes = function () {
    var votes = this.votes,
        stats = {};

    this.answerIds.forEach(function (id) {
        stats[id] = 0;
    });

    this.getVoters().forEach(function (voterId) {
        var key = votes[voterId].key;
        stats[key] += 1;
    });

    return stats;
};

module.exports = Poll;
