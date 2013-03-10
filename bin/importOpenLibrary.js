var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')
  , fs = require('fs')
  , csv = require('csv')

mongoose.connect(config.db)

var modelsPath = __dirname + '/../lib/models'
fs.readdirSync(modelsPath).forEach(function (modelFile) {
  require(modelsPath+'/'+modelFile)
});

var Publication = mongoose.model('Publication')
   , Member = mongoose.model('Member')
   , PublicationMedia = mongoose.model('PublicationMedia')

Member.pFind()

  
}

