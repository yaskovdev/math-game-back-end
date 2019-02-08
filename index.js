const http = require('http');
const WebSocketServer = require('websocket').server;

const resultsService = require('./resultsService');
const usersService = require('./usersService');
const challengeService = require('./challengeService');

const httpServer = http.createServer((request, response) => {
	response.writeHead(200);
	response.end('Math Game server is running');
});

const webSocketServer = new WebSocketServer({ httpServer });

const bind = (user, connection) => {
	connection.id = user.id;
};

const send = (connection, object) => {
	connection.sendUTF(JSON.stringify(object));
};

webSocketServer.on('request', (request) => {
	if (usersService.thereAreEnoughFreeSlots()) {
		const connection = request.accept(null, request.origin);
		const user = usersService.registerUser(connection);
		bind(user, connection);

		send(connection, {
			type: 'WELCOME',
			user: usersService.getUserInfo(connection.id),
			ratingTable: usersService.ratingTable()
		});

		connection.on('message', (message) => {
			if (message.type === 'utf8') {
				console.log('Message received', message);
				const { utf8Data } = message;
				challengeService.registerUserAnswer(connection.id, utf8Data.trim() === 'true');
			}
		});

		connection.on('close', () => {
			usersService.unregisterUser(connection.id);
		});
	} else {
		console.error('Maximum amount of connections is reached');
		request.reject();
	}
});

setInterval(() => {
	if (challengeService.isChallengeInProgress()) {
		const results = resultsService.roundResults(challengeService.allUserAnswers());
		const userIdToScoreDeltaAndResult = challengeService.finishCurrentChallenge(results);
		usersService.updateUsersScores(userIdToScoreDeltaAndResult);

		const ratingTable = usersService.ratingTable();
		usersService.allUserConnectionsAsList().forEach((connection) => {
			const { id } = connection;
			const { score } = usersService.getUserInfo(id);
			const { result } = userIdToScoreDeltaAndResult[id];
			send(connection, { type: 'END_ROUND', score, result, ratingTable });
		});
	} else {
		const challenge = challengeService.startNewChallenge();
		usersService.allUserConnectionsAsList().forEach((connection) => {
			send(connection, { type: 'START_ROUND', challenge });
		});
	}
}, 2000);

httpServer.listen(8080);

console.log('Server started');
