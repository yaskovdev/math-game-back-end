module.exports = {
    of: (object) => Object.keys(object).map(key => object[key])
}
