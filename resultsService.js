const CHALLENGE_RESULT = {
	CORRECT_FIRST_ANSWER: 'CORRECT_FIRST_ANSWER',
	CORRECT_LATE_ANSWER: 'CORRECT_LATE_ANSWER',
	WRONG_ANSWER: 'WRONG_ANSWER',
	NO_ANSWER: 'NO_ANSWER'
};

module.exports = {
	roundResults: (fastestUsersFirst) => {
		const winner = fastestUsersFirst.filter(answer => answer.userGaveAnswer && answer.userWasRight)[0];
		const losers = fastestUsersFirst.filter(answer => answer.userGaveAnswer && !answer.userWasRight);
		const winnerId = winner ? winner.id : null;
		return {
			winner: winnerId,
			losers: losers.map(user => user.id),
			didNotGiveAnswer: fastestUsersFirst.filter(user => !user.userGaveAnswer).map(user => user.id)
		}
	},

	roundResultsToSummary: (id, roundResults) => {
		if (roundResults.didNotGiveAnswer.includes(id)) {
			return CHALLENGE_RESULT.NO_ANSWER;
		} else if (roundResults.losers.includes(id)) {
			return CHALLENGE_RESULT.WRONG_ANSWER;
		} else if (roundResults.winner === id) {
			return CHALLENGE_RESULT.CORRECT_FIRST_ANSWER
		} else {
			return CHALLENGE_RESULT.CORRECT_LATE_ANSWER;
		}
	},

	userScoreDelta: (userId, roundResults) => {
		if (userId === roundResults.winner) {
			return 1;
		} else {
			return roundResults.losers.includes(userId) ? -1 : 0;
		}
	}
};
