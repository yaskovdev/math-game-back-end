const random = require('./random');

const OPERATORS = ['*', '/', '+', '-'];

const gcd = (a, b) => b ? gcd(b, a % b) : a;

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

module.exports = function* ChallengeGenerator() {
    while (true) {
        const leftOperand = random.generate(10) + 1;
        const rightOperand = random.generate(10) + 1;
        const operator = random.pick(OPERATORS);
        const wrongOperator = random.pick(OPERATORS);

        yield {
            question: `${leftOperand} ${operator} ${rightOperand}`,
            answer: calculate(leftOperand, rightOperand, wrongOperator),
            correctAnswer: calculate(leftOperand, rightOperand, operator)
        };
    }
};
