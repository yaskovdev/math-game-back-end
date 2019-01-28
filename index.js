const http = require('http');
const WebSocketServer = require('websocket').server;

const server = http.createServer((request, response) => {
    response.writeHead(200);
    response.end('Welcome to Math Game!');
});

const webSocketServer = new WebSocketServer({httpServer: server});

const generateName = () => {
    const adjectives = ['Acid', 'Blue', 'Chilly', 'Dramatic', 'Elegant', 'Fancy', 'Graceful', 'Heavy', 'Illegal',
        'Jolly', 'Kind', 'Lucky', 'Macho', 'Naughty', 'Oval', 'Puffy', 'Quarrelsome', 'Rapid', 'Slow', 'Toxic',
        'Useful', 'Vulgar', 'Wise'];
    const nouns = ['Dog', 'Cat', 'Cow', 'Sheep', 'Rabbit', 'Duck', 'Hen', 'Horse', 'Pig', 'Turkey', 'Chicken', 'Donkey',
        'Goat', 'Guinea Pig', 'Lama', 'Squirrel', 'Snail', 'Mouse', 'Chameleon', 'Deer', 'Raccoon', 'Beaver', 'Mole'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective + ' ' + noun;
};

webSocketServer.on('request', request => {
    const connection = request.accept(null, request.origin);

    connection.sendUTF(JSON.stringify({
        user: {id: 'id', name: generateName()},
        challenge: {question: '9 * 3', answer: '28'}
    }));

    connection.on('message', message => {
        if (message.type === 'utf8') {
            console.log('Message received', message)
        }
    });

    connection.on('close', connection => {
        console.log('User ' + connection.remoteAddress + " disconnected");
    });
});

server.listen(8080);

console.log('Server started');
