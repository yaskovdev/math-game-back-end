const http = require('http');
const WebSocketServer = require('websocket').server;
const uuid = require('uuid/v1');

const random = require('./random');
const Challenge = require('./challenge');
const resultsService = require('./resultsService');

const httpServer = http.createServer((request, response) => {
});

const webSocketServer = new WebSocketServer({httpServer});

let challenge = null;

const users = {};

const generateName = () => {
    const adjectives = ['Acid', 'Blue', 'Chilly', 'Dramatic', 'Elegant', 'Fancy', 'Graceful', 'Heavy', 'Illegal',
        'Jolly', 'Kind', 'Lucky', 'Macho', 'Naughty', 'Oval', 'Puffy', 'Quarrelsome', 'Rapid', 'Slow', 'Toxic',
        'Useful', 'Vulgar', 'Wise'];
    const nouns = ['Dog', 'Cat', 'Cow', 'Sheep', 'Rabbit', 'Duck', 'Hen', 'Horse', 'Pig', 'Turkey', 'Chicken', 'Donkey',
        'Goat', 'Zebra', 'Lama', 'Squirrel', 'Snail', 'Mouse', 'Chameleon', 'Deer', 'Raccoon', 'Beaver', 'Mole'];
    return random.pick(adjectives) + ' ' + random.pick(nouns);
};

webSocketServer.on('request', request => {
    const connection = request.accept(null, request.origin);
    const id = uuid();

    const user = {id, connection, name: generateName(), score: 0, answer: null, timeOfAnswer: null};
    users[id] = user;

    connection.sendUTF(JSON.stringify({
        type: 'WELCOME',
        user: {id, name: user.name},
        ratingTable: ratingTableOf(users)
    }));

    connection.on('message', message => {
        if (message.type === 'utf8') {
            console.log('Message received', message);
            const {utf8Data} = message;
            user.answer = utf8Data.trim() === 'true';
            user.timeOfAnswer = Date.now();
        }
    });

    connection.on('close', () => {
        delete users[id];
        console.log('User ' + id + " disconnected");
    });
});

const values = (object) => {
    return Object.keys(object).map(key => object[key]);
};

const ratingTableOf = (users) =>
    values(users).map(user => ({id: user.id, name: user.name, score: user.score})).sort((a, b) => b.score - a.score);

setInterval(() => {
    if (challenge) {
        const results = resultsService.roundResults(values(users), challenge);
        Object.keys(users).forEach(id => {
            const {score} = users[id];
            users[id].score = score + resultsService.userScoreDelta(id, results);
            users[id].answer = null;
            users[id].timeOfAnswer = null;
            users[id].result = resultsService.roundResultsToSummary(id, results);
        });
        challenge = null;

        const ratingTable = ratingTableOf(users);
        Object.keys(users).forEach(id => {
            const {connection} = users[id];
            connection.sendUTF(JSON.stringify({
                type: 'END_ROUND',
                score: users[id].score,
                result: users[id].result,
                ratingTable
            }));
        });
    } else {
        challenge = Challenge().next().value;
        Object.keys(users).forEach(id => {
            const {connection, score} = users[id];
            connection.sendUTF(JSON.stringify({
                type: 'START_ROUND',
                challenge
            }));
        });
    }
}, 5000);

httpServer.listen(8080);

console.log('Server started');
