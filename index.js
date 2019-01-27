const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200);
    response.end('Welcome to Math Game!');
});

server.listen(8080);

console.log('Server started');
