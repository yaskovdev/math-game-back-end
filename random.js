const random = {
    generate: (n) => Math.floor(Math.random() * n),
    pick: (array) => array[random.generate(array.length)]
}

module.exports = random
