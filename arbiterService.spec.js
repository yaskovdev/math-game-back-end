const assert = require('assert')
const arbiterService = require('./arbiterService')

const challenge = () => ({ suggestedAnswer: 3, correctAnswer: 4 })
const userAnswer = (userId, value, timeOfAnswer) => ({ userId, answer: value, timeOfAnswer })

describe('arbiterService', () => {
    describe('roundSummary', () => {
        it('should return nothing if the user did not give any answer', () => {
            const round = {
                challenge: challenge(),
                userIdToAnswer: { '559dd4ab': userAnswer('559dd4ab', true) }
            }
            assert.equal(arbiterService.roundSummary('62f7c14a', round), undefined)
        })

        it('should return WRONG_ANSWER if the user gave wrong answer in this round', () => {
            const round = {
                challenge: challenge(),
                userIdToAnswer: { '559dd4ab': userAnswer('559dd4ab', true) }
            }
            assert.equal(arbiterService.roundSummary('559dd4ab', round), 'WRONG_ANSWER')
        })

        it('should return CORRECT_FIRST_ANSWER if the user gave the first correct answer in this round', () => {
            const round = {
                challenge: challenge(),
                userIdToAnswer: {
                    '559dd4ab': userAnswer('559dd4ab', true, 0),
                    '62f7c14a': userAnswer('62f7c14a', false, 1),
                    '7b5e0e2d': userAnswer('7b5e0e2d', false, 2),
                }
            }
            assert.equal(arbiterService.roundSummary('62f7c14a', round), 'CORRECT_FIRST_ANSWER')
        })

        it('should return CORRECT_LATE_ANSWER if the user gave a correct answer, but someone was faster', () => {
            const round = {
                challenge: challenge(),
                userIdToAnswer: {
                    '559dd4ab': userAnswer('559dd4ab', true, 0),
                    '62f7c14a': userAnswer('62f7c14a', false, 1),
                    '7b5e0e2d': userAnswer('7b5e0e2d', false, 2),
                }
            }
            assert.equal(arbiterService.roundSummary('7b5e0e2d', round), 'CORRECT_LATE_ANSWER')
        })
    })

    describe('userScoreDelta', () => {
        it('should not change score if the user did not give any answer', () => {
            const round = {
                challenge: challenge(),
                userIdToAnswer: { '559dd4ab': userAnswer('559dd4ab', true) }
            }
            assert.equal(arbiterService.userScoreDelta('62f7c14a', round), 0)
        })

        it('should not change score if the user gave a correct answer, but someone was faster', () => {
            const round = {
                challenge: challenge(),
                userIdToAnswer: {
                    '559dd4ab': userAnswer('559dd4ab', true, 0),
                    '62f7c14a': userAnswer('62f7c14a', false, 1),
                    '7b5e0e2d': userAnswer('7b5e0e2d', false, 2),
                }
            }
            assert.equal(arbiterService.userScoreDelta('7b5e0e2d', round), 0)
        })

        it('should decrement score if user gave wrong answer in this round', () => {
            const round = {
                challenge: challenge(),
                userIdToAnswer: { '559dd4ab': userAnswer('559dd4ab', true) }
            }
            assert.equal(arbiterService.userScoreDelta('559dd4ab', round), -1)
        })

        it('should increment score if user gave the first correct answer in this round', () => {
            const round = {
                challenge: challenge(),
                userIdToAnswer: {
                    '559dd4ab': userAnswer('559dd4ab', true, 0),
                    '62f7c14a': userAnswer('62f7c14a', false, 1),
                    '7b5e0e2d': userAnswer('7b5e0e2d', false, 2),
                }
            }
            assert.equal(arbiterService.userScoreDelta('62f7c14a', round), 1)
        })
    })
})
