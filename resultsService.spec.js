const assert = require('assert');
const resultsService = require('./resultsService');

const user = (id, answer, timeOfAnswer) => ({id, answer, timeOfAnswer});

describe('resultsService', () => {

    describe('roundResults', () => {
        it('should return empty results if there are no users', () => {
            const challenge = {answer: '3', correctAnswer: '4'};
            const expected = {
                winner: null,
                losers: [],
                didNotGiveAnswer: []
            };
            assert.deepEqual(resultsService.roundResults([], challenge), expected)
        });

        it('should return a correct winner, correct losers and correct users without answer', () => {
            const challenge = {answer: '3', correctAnswer: '4'};
            const expected = {
                winner: '7b5e0e2d',
                losers: ['459dd4ab'],
                didNotGiveAnswer: ['659dd4ab']
            };
            const users = [
                user('459dd4ab', true, 1),
                user('52f7c14a', false, 10),
                user('659dd4ab', null, 4),
                user('7b5e0e2d', false, 5)
            ];
            assert.deepEqual(resultsService.roundResults(users, challenge), expected)
        });
    });

    describe('roundResultsToSummary', () => {
        it('should return NO_ANSWER if the user did not give any answer', () => {
            assert.equal(resultsService.roundResultsToSummary('559dd4ab', {didNotGiveAnswer: ['559dd4ab']}), 'NO_ANSWER')
        });

        it('should return WRONG_ANSWER if the user is a loser in this round', () => {
            const results = {
                didNotGiveAnswer: [],
                losers: ['559dd4ab']
            };
            assert.equal(resultsService.roundResultsToSummary('559dd4ab', results), 'WRONG_ANSWER')
        });

        it('should return CORRECT_FIRST_ANSWER if the user is the winner of this round', () => {
            const results = {
                didNotGiveAnswer: [],
                winner: '62f7c14a',
                losers: ['559dd4ab']
            };
            assert.equal(resultsService.roundResultsToSummary('62f7c14a', results), 'CORRECT_FIRST_ANSWER')
        });

        it('should return CORRECT_LATE_ANSWER if the user gave an answer, but is neither winner, nor loser', () => {
            const results = {
                didNotGiveAnswer: ['7b5e0e2d'],
                winner: '62f7c14a',
                losers: ['559dd4ab', '548f38d8']
            };
            assert.equal(resultsService.roundResultsToSummary('a1b545df', results), 'CORRECT_LATE_ANSWER')
        });
    });

    describe('userScoreDelta', () => {
        it('should not change score if user is neither a winner, nor a loser', () => {
            assert.equal(resultsService.userScoreDelta('559dd4ab', {losers: []}), 0)
        });

        it('should decrement score if user is a loser', () => {
            assert.equal(resultsService.userScoreDelta('559dd4ab', {losers: ['559dd4ab']}), -1)
        });

        it('should increment score if user is a winner', () => {
            assert.equal(resultsService.userScoreDelta('62f7c14a', {winner: '62f7c14a', losers: ['559dd4ab']}), 1)
        });
    });
});
