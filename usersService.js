const uuid = require('uuid/v1');
const random = require('./random');
const values = require('./values');

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
    thereAreEnoughFreeSlots: () => Object.keys(users).length < USERS_LIMIT,

    registerUser: (connection) => {
        const id = uuid();
        const user = {id, connection, name: generateName(), score: 0, answer: null, timeOfAnswer: null};
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
        return {id: user.id, name: user.name, score: user.score};
    },

    updateUsersScores: (userIdToScoreDeltaObject) => {
        values.of(users).forEach((user) => {
            const scoreDeltaObject = userIdToScoreDeltaObject[user.id];
            if (scoreDeltaObject) {
                const {scoreDelta} = scoreDeltaObject;
                user.score = user.score + scoreDelta;
            }
        })
    },

    ratingTable: () => values.of(users)
        .map(user => ({id: user.id, name: user.name, score: user.score}))
        .sort((a, b) => b.score - a.score),

    allUserConnectionsAsList: () => values.of(users).map(user => user.connection)
};
