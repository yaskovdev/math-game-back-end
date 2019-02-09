const assert = require('assert')
const roundService = require('./roundService')

describe('roundService', () => {
    describe('isRoundInProgress', () => {
        it('should return false if the round has not yet been started', () => {
            assert.equal(roundService.isRoundInProgress(), false)
        })

        it('should return true if the round has been started', () => {
            roundService.startNewRound()
            assert.equal(roundService.isRoundInProgress(), true)
        })

        it('should return false if the round has been started and then finished', () => {
            roundService.startNewRound()
            roundService.finishCurrentRound()
            assert.equal(roundService.isRoundInProgress(), false)
        })
    })

    describe('startNewRound', () => {
        it('should return only question and suggested answer', () => {
            const round = roundService.startNewRound()
            assert.deepStrictEqual(Object.keys(round), ['question', 'suggestedAnswer'])
            assert.ok(round.question)
            assert.ok(round.suggestedAnswer)
        })
    })

    describe('finishCurrentRound', () => {
        it('should return empty object if nobody registered an answer', () => {
            const userIdToScoreDeltaAndRoundSummary = roundService.finishCurrentRound()
            assert.deepStrictEqual(userIdToScoreDeltaAndRoundSummary, {})
        })
    })
})
