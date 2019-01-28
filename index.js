const http = require('http');
const WebSocketServer = require('websocket').server;

const server = http.createServer((request, response) => {
	response.writeHead(200);
	response.end('Welcome to Math Game!');
});

const webSocketServer = new WebSocketServer({ httpServer: server });

webSocketServer.on('request', request => {
	const connection = request.accept(null, request.origin);

	connection.sendUTF(JSON.stringify({
		user: { id: 'id', name: 'Peppa Pig' },
		challenge: { question: '9 * 3', answer: '28' }
	}));

	connection.on('message', message => {
		if (message.type === 'utf8') {
			console.log('Message received', message)
		}
	})
});

server.listen(8080);

console.log('Server started');
