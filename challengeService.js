const random = require('./random');

const OPERATORS = ['*', '/', '+', '-'];

const gcd = (a, b) => b ? gcd(b, a % b) : a;

let challenge = null;

const answers = {};

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

module.exports = {
	isChallengeInProgress: () => Boolean(challenge),

	isSuggestedAnswerCorrect: () => challenge.answer === challenge.correctAnswer,

	startNewChallenge: () => {
		challenge = ChallengeGenerator().next().value;
		return challenge;
	},

	finishCurrentChallenge: () => {
		challenge = null;
	}
};
