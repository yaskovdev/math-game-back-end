# Math Game

Implement a real-time browser-based math game for up to 10 concurrent users. The game is structured as a continuous series of rounds, where all connected players compete to submit the correct answer first. The number of rounds is not limited, players can connect at any time and start competing.

At the beginning of each round a simple math challenge is sent to all connected players, consisting of a basic operation (+ - * /), two operands in range 1..10 and a potential answer. All players are presented with the challenge and have to answer whether the proposed answer is correct using a simple yes/no choice.

The first player to submit a correct answer gets 1 point for the round and completes the round. All incorrect answers subtract a point from the players' score. Correct late answers do not affect the score. After completing the round all remaining players are informed that the round is over. A new round starts in 5 seconds after the end of last one.

Add meaningful unit tests.

## Restrictions

Implement the game server using node.js/io.js. It is recommended to use Angular or React for the user interface. The game has to support Chrome browser. Extra points for automated test coverage and installation scripts.

Use GitHub for version control.

Make it as you would do it for production with all the relevant aspects.

## Local Deployment

Run `node ./index.js`.
