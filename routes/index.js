var database = require("../lib/database");

exports.index = function(req, res){
	res.render('index.ejs')
}

exports.registerUser = function(req, res){
	
	console.log("Attempting to register user: ");
	console.log(req.body);
	
	database.registerUser(req.body, function(d){
		
		res.json({data: d});
		
	});
	
}

exports.loginUser = function(req, res){
	
	database.loginUser(req.body, function(d){		
		req.session.username = d.username;
		
		
		res.json(d);
		
	});
	
}

exports.browsePage = function(req, res){
	
	res.render('browse.ejs');
}

exports.editPage = function(req, res){
	
	res.render('edit.ejs');
	
}

exports.modelPage = function(req, res){
	res.render('model.ejs');
}


exports.viewResults = function(req, res){
	res.render('results.ejs');
}

exports.viewData = function(req, res){
	res.render('viewer.ejs');
}


exports.exploreData = function(req, res){
	res.render('explore.ejs');
}

exports.showDatabase = function(req, res){
	res.render('db.ejs');
}

exports.newSchema = function(req, res){
	res.render('schema.ejs');
}

