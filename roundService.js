const random = require('./random');
const arbiterService = require('./arbiterService');

const OPERATORS = ['*', '/', '+', '-'];

const gcd = (a, b) => b ? gcd(b, a % b) : a;

const round = {
    challenge: null,
    userIdToAnswer: {}
};

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
    isRoundInProgress: () => Boolean(round.challenge),

    startNewRound: () => {
        round.challenge = ChallengeGenerator().next().value;
        return {question: round.challenge.question, answer: round.challenge.answer};
    },

    finishCurrentRound: () => {
        const userIdToScoreDeltaAndRoundSummary = {};
        Object.keys(round.userIdToAnswer).forEach(userId => {
            userIdToScoreDeltaAndRoundSummary[userId] = {
                scoreDelta: arbiterService.userScoreDelta(userId, round),
                roundSummary: arbiterService.roundSummary(userId, round)
            };
        });
        round.userIdToAnswer = {};
        round.challenge = null;
        return userIdToScoreDeltaAndRoundSummary;
    },

    registerUserAnswer: (userId, answer) => {
        round.userIdToAnswer[userId] = {userId, answer, timeOfAnswer: Date.now()};
    }
};
