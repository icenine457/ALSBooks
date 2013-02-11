var mongoskin = require('mongoskin');
exports.db = mongoskin.db('localhost/alsBooks', {safe:true, database: 'alsBooks'});
