const uuid = require('uuid/v1');
const random = require('./random');
const values = require('./values');
const resultsService = require('./resultsService');

const USERS_LIMIT = 10;

const users = {};

const generateName = () => {
	const adjectives = ['Acid', 'Blue', 'Chilly', 'Dramatic', 'Elegant', 'Fancy', 'Graceful', 'Heavy', 'Illegal',
		'Jolly', 'Kind', 'Lucky', 'Macho', 'Naughty', 'Oval', 'Puffy', 'Quarrelsome', 'Rapid', 'Slow', 'Toxic',
		'Useful', 'Vulgar', 'Wise'];
	const nouns = ['Dog', 'Cat', 'Cow', 'Sheep', 'Rabbit', 'Duck', 'Hen', 'Horse', 'Pig', 'Turkey', 'Chicken', 'Donkey',
		'Goat', 'Zebra', 'Lama', 'Squirrel', 'Snail', 'Mouse', 'Chameleon', 'Deer', 'Raccoon', 'Beaver', 'Mole'];
	return random.pick(adjectives) + ' ' + random.pick(nouns);
};

module.exports = {
	thereAreEnoughFreeSlots: () => {
		return Object.keys(users).length < USERS_LIMIT;
	},

	registerUser: (connection) => {
		const id = uuid();
		const user = { id, connection, name: generateName(), score: 0, answer: null, timeOfAnswer: null };
		users[id] = user;
		console.log('User ' + id + " joined the game");
		return user;
	},

	unregisterUser: (id) => {
		delete users[id];
		console.log('User ' + id + " left the game");
	},

	getUserInfo: (id) => {
		const user = users[id];
		return { id: user.id, name: user.name };
	},

	registerAnswer: (id, answer) => {
		const user = users[id];
		user.answer = answer;
		user.timeOfAnswer = Date.now();
	},

	ratingTable: () => values.of(users)
		.map(user => ({ id: user.id, name: user.name, score: user.score }))
		.sort((a, b) => b.score - a.score),

	allUserAnswers: (challenge) =>
		values.of(users).map(user => ({
			id: user.id,
			answer: user.answer,
			timeOfAnswer: user.timeOfAnswer,
			userGaveAnswer: user.answer !== null,
			userWasRight: user.answer === (challenge.answer === challenge.correctAnswer)
		})).sort((a, b) => a.timeOfAnswer - b.timeOfAnswer),

	allUserConnectionsAsList: () => {
		return values.of(users).map(user => user.connection);
	},

	finishRoundWithResults: (results) => {
		Object.keys(users).forEach(id => {
			const { score } = users[id];
			users[id].score = score + resultsService.userScoreDelta(id, results);
			users[id].answer = null;
			users[id].timeOfAnswer = null;
			users[id].result = resultsService.roundResultsToSummary(id, results);
		});
	},

	roundScoreAndResultOfUser: (id) => {
		const user = users[id];
		return { score: user.score, result: user.result };
	}
};
