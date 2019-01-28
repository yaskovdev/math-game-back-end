const OPERANDS = ['*', '/', '+', '-'];

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
        const leftOperand = Math.floor(Math.random() * 10) + 1;
        const rightOperand = Math.floor(Math.random() * 10) + 1;
        const operator = OPERANDS[Math.floor(Math.random() * 4)];
        const wrongOperator = OPERANDS[Math.floor(Math.random() * 4)];

        const correctAnswer = calculate(leftOperand, rightOperand, operator);
        const wrongAnswer = calculate(leftOperand, rightOperand, wrongOperator);

        yield {
            question: `${leftOperand} ${operator} ${rightOperand}`,
            answer: wrongAnswer,
            correctAnswer
        };
    }
};
