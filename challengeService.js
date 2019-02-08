const random = require('./random');
const resultsService = require('./resultsService');

const OPERATORS = ['*', '/', '+', '-'];

const gcd = (a, b) => b ? gcd(b, a % b) : a;

let challenge = null;
let userIdToAnswer = {};

const calculate = (leftOperand, rightOperand, operator) => {
	if (operator === '*') {
		return leftOperand * rightOperand;
	} else if (operator === '/') {
		const commonDivisible = gcd(leftOperand, rightOperand);
		const numerator = leftOperand / commonDivisible;
		const denominator = rightOperand / commonDivisible;
		return denominator === 1 ? `${numerator}` : `${numerator}/${denominator}`;
	} else if (operator === '+') {
		return leftOperand + rightOperand;
	} else if (operator === '-') {
		return leftOperand - rightOperand;
	} else {
		throw new Error(`unknown operation: ${leftOperand} ${operator} ${rightOperand}`);
	}
};

function* ChallengeGenerator() {
	while (true) {
		const leftOperand = random.generate(10) + 1;
		const rightOperand = random.generate(10) + 1;
		const operator = random.pick(OPERATORS);
		const wrongOperator = random.generate(2) ? operator : random.pick(OPERATORS.filter(o => o !== operator));

		yield {
			question: `${leftOperand} ${operator} ${rightOperand}`,
			answer: calculate(leftOperand, rightOperand, wrongOperator),
			correctAnswer: calculate(leftOperand, rightOperand, operator)
		};
	}
}

const isSuggestedAnswerCorrect = () => challenge.answer === challenge.correctAnswer;

module.exports = {
	isChallengeInProgress: () => Boolean(challenge),

	startNewChallenge: () => {
		challenge = ChallengeGenerator().next().value;
		return challenge;
	},

	finishCurrentChallenge: (results) => {
		const userIdToScoreDeltaAndResult = {};
		Object.keys(userIdToAnswer).forEach(userId => {
			userIdToScoreDeltaAndResult[userId] = {
				scoreDelta: resultsService.userScoreDelta(userId, results),
				result: resultsService.roundResultsToSummary(userId, results)
			};
		});
		userIdToAnswer = {};
		challenge = null;
		return userIdToScoreDeltaAndResult;
	},

	registerUserAnswer: (userId, answer) => {
		userIdToAnswer[userId] = { userId, answer, timeOfAnswer: Date.now() };
	},

	allUserAnswers: () =>
		values.of(userIdToAnswer).map(a => ({
			id: a.userId,
			answer: a.answer,
			timeOfAnswer: a.timeOfAnswer,
			userGaveAnswer: a.answer !== null,
			userWasRight: a.answer === isSuggestedAnswerCorrect()
		})).sort((a, b) => a.timeOfAnswer - b.timeOfAnswer)
};
