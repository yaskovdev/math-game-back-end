const values = require('./values')

const CHALLENGE_RESULT = {
    CORRECT_FIRST_ANSWER: 'CORRECT_FIRST_ANSWER',
    CORRECT_LATE_ANSWER: 'CORRECT_LATE_ANSWER',
    WRONG_ANSWER: 'WRONG_ANSWER'
}

const usersRatingAfter = (round) => {
    const { challenge } = round
    const suggestedAnswerCorrect = challenge.suggestedAnswer === challenge.correctAnswer
    return values.of(round.userIdToAnswer).map(a => ({
        id: a.userId,
        timeOfAnswer: a.timeOfAnswer,
        userGaveAnswer: a.userAnswer !== null,
        userWasRight: a.userAnswer === suggestedAnswerCorrect
    })).sort((a, b) => a.timeOfAnswer - b.timeOfAnswer)
}

const resultsOf = (round) => {
    const fastestUsersFirst = usersRatingAfter(round)
    const winner = fastestUsersFirst.filter(answer => answer.userGaveAnswer && answer.userWasRight)[0]
    const losers = fastestUsersFirst.filter(answer => answer.userGaveAnswer && !answer.userWasRight)
    const winnerId = winner ? winner.id : null
    return {
        winner: winnerId,
        losers: losers.map(user => user.id),
        gaveAnswer: fastestUsersFirst.filter(user => user.userGaveAnswer).map(user => user.id)
    }
}

module.exports = {
    roundSummary: (userId, round) => {
        const roundResults = resultsOf(round)
        if (roundResults.losers.includes(userId)) {
            return CHALLENGE_RESULT.WRONG_ANSWER
        } else if (roundResults.winner === userId) {
            return CHALLENGE_RESULT.CORRECT_FIRST_ANSWER
        } else if (roundResults.gaveAnswer.includes(userId)) {
            return CHALLENGE_RESULT.CORRECT_LATE_ANSWER
        }
    },

    userScoreDelta: (userId, round) => {
        const roundResults = resultsOf(round)
        if (userId === roundResults.winner) {
            return 1
        } else {
            return roundResults.losers.includes(userId) ? -1 : 0
        }
    }
}
