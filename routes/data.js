var database = require("../lib/database");
var uploader = require("../lib/uploader");
var downloader = require("../lib/downloader");
var saver		= require("../lib/modelsaver")

exports.getDataByDate = function(req, res){
	
	console.log("Attempting to retrieve data: ");
	console.log(req.body);
	
	database.getDataByDate(req.body, function(d){
		
		res.json({data: d});
		
	});
	
}



/**
 * uploadData Uploads Data to the Database
 * @param {Object} req {
 * 	username: User name of the current user
 *  key:	  Key being used by the client and user
 *  file:	  File information
 * }
 * @param {Object} res
 */
exports.uploadData = function(req, res){
	
	console.log("uploadData req body -->");
	console.log(req.body);
	console.log("<-- uploadData req body");
	
	uploader.startUpload(req, res);
	
	
}

exports.addRelation = function(req, res){
	
	database.addRelation(req.session.username, req.body.database, req.body.attribute, req.body.relateddb, req.body.relateto, function(d){
		
		res.json(d);
		
	});
	
}

exports.getRelations = function(req, res){
	
	database.getRelations(req.session.username, req.body.database, function(d){
		
		/*console.log("The following is d -->");
		console.log(d);
		
		res.json(d);*/
		
		if (d == undefined){
			
			res.json([]);
			
		}else {
			
			res.json(d);
			
		}
		
		
	});
	
}

/**
 * Returns all Databases of a given user
 * @param {Object} req {
 * 	username: username of the user	
 * }
 * @param {Object} res
 */
exports.exportDatabases = function(req, res){
	
	database.getUserDatabases(req.session.username, function(d){
		res.json(d);
	})
	
}


exports.download = function(req, res){
	var db = req.body.db;
	var user = req.session.username;
	var format = req.body.format;
	var explored = req.body.explore;
	
	console.log(explored)
	
	//DATA IS PUBLIC AND BEING SHARED
	if(explored == 'true'){
		console.log("DATA IS SHARED");
		user = req.body.username;
	}
	
	
	downloader.prepareDownload(res, user, db, format, function(d){
		res.json(d)
	})
	
}


exports.showDatabaseOfUser = function(req, res){
	var db = req.body.db;
	var limit = parseFloat(req.body.limit);
	
	if(limit == null) limit = 0;
	
	
	database.getDatabase(req.session.username, db, limit, function(d){
		res.json(d);
	})
}


exports.sendResults = function(req, res){
	var resx = req.body.results;
	
	console.log(resx);
	
	saver.saveOutput(resx, function(d){
		res.json(d)
	})
	
	
}

exports.getMoreRows = function(req, res){
	var last = req.body.last;
	var next = req.body.next;
	var db	 = req.body.db;
	var user = req.session.username;
	
	database.getMoreRows(db, last, next, user, function(d){
		res.json(d);
	})
	
	
}

exports.createDatabase = function(req, res){
	
	database.createDatabase(req.session.username, req.body, function(d){
		
		res.json(d);
		
	});
	
}

exports.removeDatabase = function(req, res){
	
	database.removeDatabase(req.body.db, req.body.user, function(d){
		
		res.json(d);
		
	});
	
}

exports.getAllData = function(req, res){
	
	database.returnAllDatabases(function(d){
		res.json(d);
	})
}

exports.getSingleDatabase =  function(req, res){
	var db = req.body.db;
	var user = req.body.user;
	var you  = req.session.username;
	var limit = req.body.limit;
	var id = req.body.id;
	
	console.log(limit);
	
	
	database.getSingleDatabase(id, db, user, you, limit, function(d){
		res.json(d);
	})
	
	
}
