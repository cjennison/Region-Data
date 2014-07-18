var database = require("../lib/database");
var schematics = require("../lib/schematics");

exports.submitSchema = function(req, res){
	var user = req.session.username;
	var schema = req.body.schema;
	var title  = req.body.title;
	
	if(schema == null || title == null){
		res.send(false)
		return;
	}
	
	database.submitSchema({
		user:user,
		schema:schema,
		title:title
	}, function(resp){
		res.send(resp);
	})
	
	
}

exports.getAllSchemas = function(req, res){
	database.returnSchemas(function(d){
		res.json(d);
	})
}


exports.createNewDBFromSchema = function(req, res){
		var user = req.session.username;
		
		//title of teh selected DB
		var db	 = req.body.db;
		
		//Name of schema to conform to
		var schema = req.body.schema;
		
		//List of variables and their schemed names
		var trans  = req.body.transform;
		
		//Extra options
		var config = req.body.config;
		
		
		
		
		if(user == null){
			console.log("User was null")
			res.redirect("/");
			return;
		}
		
		var obj = {
			user:user,
			db:db,
			schema:schema,
			trans:trans,
			config:config
		};
		
		console.log(obj)
		
		if(schema == null || trans == null || config == null){
			res.send("ERROR-- Some variables were null");
			return;
		}
		
		
		
		console.log(obj)
		
		schematics.aggregateDataFromSchema(obj, function(d){
			res.json(d);
		})
		
		
}

exports.getSingleSchema = function(req, res){
	database.getSingleSchema(req.body.title, function(d){
		res.json(d);
	})
}

