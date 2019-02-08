const http = require('http');
const WebSocketServer = require('websocket').server;
const usersService = require('./usersService');
const roundService = require('./roundService');

const httpServer = http.createServer((request, response) => {
    response.writeHead(200);
    response.end('Math Game server is running');
});

const webSocketServer = new WebSocketServer({httpServer});

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
                const {utf8Data} = message;
                roundService.registerUserAnswer(connection.id, utf8Data.trim() === 'true');
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
    if (roundService.isRoundInProgress()) {
        const userIdToScoreDeltaAndRoundSummary = roundService.finishCurrentRound();
        usersService.updateUsersScores(userIdToScoreDeltaAndRoundSummary);

        const ratingTable = usersService.ratingTable();
        usersService.allUserConnectionsAsList().forEach((connection) => {
            const {id} = connection;
            const {score} = usersService.getUserInfo(id);
            if (userIdToScoreDeltaAndRoundSummary.hasOwnProperty(id)) {
                const {roundSummary} = userIdToScoreDeltaAndRoundSummary[id];
                send(connection, {type: 'END_ROUND', score, roundSummary, ratingTable});
            } else {
                send(connection, {type: 'END_ROUND', score, ratingTable});
            }
        });
    } else {
        const challenge = roundService.startNewRound();
        usersService.allUserConnectionsAsList().forEach((connection) => {
            send(connection, {type: 'START_ROUND', challenge});
        });
    }
}, 2000);

httpServer.listen(8080);

console.log('Server started');
