var database = require("../lib/database");
var query    = require("../lib/query")





/**
 * Query Explore queries explore for a specific type of data schema/subject/author/size and returns a list of that data 
 * @param {Object} req
 * @param {Object} res
 */
exports.queryExplore = function(req, res){
	
	var query = req.body.query;// [ { 'admin':{  includes:['bob','at'], descending:true, ascending:false   }  }  ]
	
	//var fingerprint = req.body.fp;
	//if(req.session.)
	
	
	query.queryExplore(query, function(d){
		res.send(d)
	})
	
	
	
	
	
	
}
