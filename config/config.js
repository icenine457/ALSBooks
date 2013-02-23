module.exports = {
  development: {
    root: require('path').normalize(__dirname + '/..'),
    app: {
      name: 'ALS Books'
    },
    db: 'mongodb://localhost/alsBooks'
  }
  , test: {

  }
  , production: {

  }
}
