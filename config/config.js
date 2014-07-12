module.exports = {
  development: {
    root: require('path').normalize(__dirname + '/..'),
    app: {
      name: 'ALS Books'
    },
    db: 'mongodb://localhost/alsBooks',
    googleApiKey: 'AIzaSyDrgLtAS6CBk9nw_6fnOlog_z2wfjLEHzU',
    contactDetails: {
      user:     "archibaldrumsfeld@gmail.com",
      password: "pnnAMA!@#",
      host:     "smtp.gmail.com",
      ssl:      true,
    }
  }
  , test: {

  }
  , production: {
    root: require('path').normalize(__dirname + '/..'),
    app: {
      name: 'ALS Books'
    },
    db: 'mongodb://localhost/alsBooks',
    googleApiKey: 'AIzaSyDrgLtAS6CBk9nw_6fnOlog_z2wfjLEHzU',
    contactDetails: {
      user:     "alspubtracker@gmail.com"
     , password: "DaKyba4!"
     , host:     "smtp.gmail.com"
     , ssl:      true
    }
  }
}
