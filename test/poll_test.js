'use strict';
var expect = require('chai').expect,
    Poll = require('../lib/poll');

describe('Poll', function () {
    it('should be defined', function () {
        expect(typeof Poll).to.eq('function');
    });

    describe('constructor', function () {
        var args;

        function newPoll() {
            return new Poll(args);
        }

        beforeEach(function () {
            args = {
                id: 1,
                question: 'What is the question?',
                answers: [ 'Yes', 'No' ]
            };
        });

        it('requires id', function () {
            delete args.id;
            expect(newPoll).to.throw(/poll id was not specified/);
        });

        it('requires numerical id', function () {
            args.id = '1';
            expect(newPoll).to.throw(/poll id must be a number/);
        });

        it('requires question string', function () {
            delete args.question;
            expect(newPoll).to.throw(/poll question must be specified/);
        });

        it('requires not empty string', function () {
            args.question = '';
            expect(newPoll).to.throw(/poll question must be specified/);
        });

        it('requires answers', function () {
            delete args.answers;
            expect(newPoll).to.throw(/poll answers must be specified/);
        });

        it('requires at least 2 answers', function () {
            args.answers = ['Yes'];
            expect(newPoll).to.throw(/poll answers count must be at least 2, but was \d+/);
        });

        it('is not revotable by default', function () {
            expect(newPoll().revotable).to.eq(false);
        });

        it('accepts revotable as optional parameter', function () {
            args.revotable = 'anything truthy';
            expect(newPoll().revotable).to.eq(true);
        });

        it('uses answer values as ids if passed as an array', function () {
            expect(newPoll().answers).to.eql({
                '1': { key: '1', name: 'Yes' },
                '2': { key: '2', name: 'No' }
            });
        });

        it('calculates answers count', function () {
            expect(newPoll().getSize()).to.eq(2);
        });

        it('accepts answers as object too', function () {
            args.answers = [
                { key: 'A', name: 'Yes' },
                { key: 'B', name: 'No' },
                { key: 'C', name: 'Maybe' }
            ];

            expect(newPoll().answerIds).to.eql(['A', 'B', 'C']);
        });
    });

    describe('voting', function () {
        var poll;

        beforeEach(function () {
            poll = new Poll({
                id: 2,
                question: 'Is it a question?',
                answers: ['Yes', 'No', 'Yeah']
            });
        });

        it('should be closed by default', function () {
            expect(poll.opened).to.eq(false);
        });

        it('should have empty opening time at start', function () {
            expect(poll.timeOpened).to.eq(null);
        });

        it('should have empty closing time at start', function () {
            expect(poll.timeClosed).to.eq(null);
        });

        it('should be open if opened', function () {
            poll.open();
            expect(poll.opened).to.eq(true);
        });

        it('should be closed if opened and closed', function () {
            poll.open();
            poll.close();
            expect(poll.opened).to.eq(false);
        });

        it('should not set close time if was not previously opened', function () {
            poll.close();
            expect(poll.timeClosed).to.eq(null);
        });

        describe('if poll is open', function () {
            beforeEach(function () {
                poll.open();
            });

            it('should ignore opening for multiple times', function () {
                poll.open();

                expect(poll.opened).to.eq(true);
            });

            it('should count vote for valid voter and existing answer', function () {
                expect(poll.vote('192.168.1.100', 'Yes')).to.eq(true);
                expect(poll.vote('192.168.1.101', 'No')).to.eq(true);
                expect(poll.vote('192.168.1.102', 'Yeah')).to.eq(true);
            });

            describe('and not revotable', function () {
                beforeEach(function () {
                    poll.revotable = false;
                });

                it('should not allow to vote multiple times', function () {
                    expect(poll.vote('192.168.1.100', 'Yes')).to.eq(true);

                    expect(poll.vote('192.168.1.100', 'No')).to.eq(false);
                    expect(poll.vote('192.168.1.100', 'Yes')).to.eq(false);
                });
            });

            describe('and revotable', function () {
                beforeEach(function () {
                    poll.revotable = true;
                });

                it('should allow to vote multiple times', function () {
                    expect(poll.vote('192.168.1.100', 'Yes')).to.eq(true);
                    expect(poll.vote('192.168.1.100', 'No')).to.eq(true);
                });
            });

            it('should not count vote for non-existing answer', function () {
                expect(poll.vote('192.168.1.100', 'XAXA')).to.eq(false);
            });

            it('should not count vote for invalid voter', function () {
                expect(poll.vote(undefined, 'Yeah')).to.eq(false);
                expect(poll.vote(null, 'Yeah')).to.eq(false);
                expect(poll.vote('', 'Yeah')).to.eq(false);
                expect(poll.vote(0, 'Yeah')).to.eq(false);
                expect(poll.vote(123, 'Yeah')).to.eq(false);
            });

            it('sets its opening time', function () {
                var delta = Date.now() - poll.timeOpened;
                expect(delta).to.be.below(500);
            });
        });

        describe('if poll is closed', function () {
            beforeEach(function () {
                poll.open();
                poll.close();
            });

            it('should not count any votes for anything', function () {
                expect(poll.vote('192.168.1.100', 'Yes')).to.eq(false);
                expect(poll.vote('192.168.1.100', 'XAXA')).to.eq(false);
                expect(poll.vote(null, 'Yes')).to.eq(false);
                expect(poll.vote(null, 'XAXA')).to.eq(false);
            });

            it('should ignores closing for multiple times', function () {
                poll.close();

                expect(poll.opened).to.eq(false);
            });

            it('should set its closing time', function () {
                expect(poll.timeClosed).to.not.eq(null);
            });

            it('should clear closing time if re-opened again', function () {
                poll.open();
                expect(poll.timeClosed).to.eq(null);
            });
        });

        it('should be not count vote on closed poll', function () {
            poll.close();
            poll.vote('127.0.0.1', 'Yes');
            expect(poll.opened).to.eq(false);
        });

        describe('votes', function () {
            beforeEach(function () {
                poll.open();

                poll.vote('John', 'Yes');
                poll.vote('Colin', 'No');
            });

            it('should be remember vote keys', function () {
                expect(poll.votes.John.key).to.eq('Yes');
                expect(poll.votes.Colin.key).to.eq('No');
            });

            it('should be remember vote time', function () {
                expect(poll.votes.John.time).to.exist();
            });

            it('should be remember last vote time', function (done) {
                poll.revotable = true;
                var firstTime = poll.votes.John.time;

                setTimeout(function () {
                    poll.vote('John', 'No');
                    expect(poll.votes.John.time).to.be.gt(firstTime);
                    done();
                }, 20);
            });
        });

        describe('statistics', function () {
            beforeEach(function () {
                poll.open();

                poll.vote('John', 'Yes');
                poll.vote('Colin', 'Yeah');
                poll.vote('David', 'No');
            });

            it('should be right in simple case', function () {
                expect(poll.countVotes()).to.eql({
                    'Yes': 1,
                    'No': 1,
                    'Yeah': 1
                });
            });

            it('should stay right even someone tries to cheat', function () {
                poll.revotable = false;
                poll.vote('John', 'No');

                expect(poll.countVotes()).to.eql({
                    'Yes': 1,
                    'No': 1,
                    'Yeah': 1
                });
            });

            it('should stay right if someone has changed his mind', function () {
                poll.revotable = true;
                poll.vote('John', 'No');

                expect(poll.countVotes()).to.eql({
                    'Yes': 0,
                    'No': 2,
                    'Yeah': 1
                });
            });

            it('should be able to return voters list', function () {
                expect(poll.getVoters().sort()).to.eql([
                    'Colin', 'David', 'John'
                ]);
            });
        });
    });

});
