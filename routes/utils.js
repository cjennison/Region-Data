var sqltomongo = require("../lib/sql-to-mongo");



exports.parseSQLToMongo = function(req, res){
	var cmd = req.body.cmd;
	
	sqltomongo.parseSQL(cmd, function(d){
		res.json(d);
	});
}
