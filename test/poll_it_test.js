'use strict';
var expect = require('chai').expect,
    defaultPolls = require('../data/polls'),
    Poll = require('../lib/poll');

describe('importing default polls', function () {
    function importPolls() {
        return defaultPolls.map(function (pollData) {
            return new Poll(pollData);
        });
    }

    it('can import without validation errors', function () {
        expect(importPolls).to.not.throw();
    });
});
