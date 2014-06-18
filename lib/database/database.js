var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var client_userdb = null;
var data_tempdb = null;

var databases = {};
var clients = {};
var servers = {};

function openDatabase() {
	server = new mongodb.Server("127.0.0.1", 27017, {
		safe : false
	});

	database = new mongodb.Db('users_regiondata', server, {}).open(function(err, client) {
		client_userdb = client;
	});

	
	MongoClient.connect('mongodb://127.0.0.1:27017/bobsaffet', function(err, db){
		if(err) throw err;
		
		console.log("... connected");
		
		var collection = db.collection("config");
		collection.insert({a:2}, function(err, docs){
			
			
			
			db.close();
		})
		
		
		
		
	})
	
	
	/*
	var db = new mongodb.Db('bsagget', new mongodb.Server('newserver', 27017), {safe:true}, function(err, client){
		if(err) throw err;
		
		console.log(client);
		console.log("new DB>..");
	})
	*/
}

function registerUser(opts, cb) {

	var collection = new mongodb.Collection(client_userdb, 'users_regiondata');

	collection.insert({

		"username" : opts.username,
		"email" : opts.email,
		"password" : opts.password//,
		//"MyData" : []

	})

	var ret = {

		USER_REGISTERED : true,
		"username" : opts.username,
		"email" : opts.email,
		"password" : opts.password

	}

	cb(ret);

}

function loginUser(opts, cb) {

	console.log("Attempting to log in user: " + opts.username)

	var collection = new mongodb.Collection(client_userdb, 'users_regiondata');

	collection.findOne({
		"username" : opts.username
	}, function(err, document) {

		if (document == null || document.password != opts.password) {

			cb("Login failed!")

		} else {
			
			var ret = {
					email: document.email,
					username: document.username
				}
			
			cb(
				ret
			);

		}

	});

}


function getUserDatabases(username, cb){
	MongoClient.connect('mongodb://127.0.0.1:27017/users_regiondata', function(err, db){
		if(err) throw err
		
		var collection = db.collection("users_regiondata");
		collection.find({username:username}).toArray(function(err, docs){
			if(err) throw err;
			console.log(docs);
			
			cb(docs[0].MyData);
		})
		
	})
	
	
	

}


function getDatabase(username, database, lim, cb){
	MongoClient.connect('mongodb://127.0.0.1:27017/' + username, function(err, db){
		if(err) throw err
		
		var collection = db.collection(database);
		
		if(lim > 0){
			collection.find().limit(lim).toArray(function(err, docs){
				if(err) console.log(err);
				
				cb(docs);
			})
		} else {
			collection.find().toArray(function(err, docs){
				if(err) console.log(err);
				
				cb(docs);
			})
		}
		
		
		
		
	})
}


function getDataByDate(opts, cb) {
	
	

	MongoClient.connect('mongodb://127.0.0.1:27017/test_data', function(err, db) {
		if (err)
			throw err;

		console.log("... connected to test_data");

		var collection = db.collection("test");
		
		collection.find().limit(10).toArray(function(err, res){
			console.log(res);
			
			
			cb(res);
			
		});
		
	})

}

//Adds a database to users record
function addDatabaseToUser(user, database, size){
	MongoClient.connect('mongodb://127.0.0.1:27017/users_regiondata', function(err, db){
		if(err) throw err
		
		var collection = db.collection("users_regiondata");
		//	var collection = new mongodb.Collection(client_userdb, 'users_regiondata');

		
		console.log(user);
		console.log(database);
		
		
		
		collection.update({'username':user},  {$push:{ 'MyData' :  {'name': database, 'size' : size} }}  , function(err, docs){			
			if(err) console.log(err);
			console.log(docs);
			
			
			
			collection.findOne({
				"username" : user
				}, function(err, document) {
					console.log(document);		
			});
			
			addDatabaseToUniverse(user, database, size);
			//cb(docs);
		})
		
	});
	
	
	
	
}


function addDatabaseToUniverse(user, database, size){
	MongoClient.connect('mongodb://127.0.0.1:27017/universe', function(err, db){
		if(err) throw err
		var collection = db.collection("universe");
		
		console.log("Adding Database to Universe");
		
		collection.insert({'database': database, 'owner':[user], 'size':size}, function(err, docs){
			if(err) console.log(err)
			console.log(docs);
			
			
		});
		
		
	})
}


function returnAllDatabases(cb){
	MongoClient.connect('mongodb://127.0.0.1:27017/universe', function(err, db){
		if(err) throw err
		var collection = db.collection("universe");
		
		
		collection.find().toArray(function(err, docs){
			if(err) console.log(err)
			
			cb(docs);
			
			
		});
		
		
	})
}

/**
 * getSingleDatabase returns a single chosen database 
 * @param {Object} cb
 */
function getSingleDatabase(id, col, user, you, lim, cb){
	var printOut = null; //Put actual database print here
	var summary  = null; //put all universal data here
	var objectId = new ObjectID();
	
	// 1) First check if we have permissions
	MongoClient.connect('mongodb://127.0.0.1:27017/universe', function(err, db){
		if(err) throw err
		var collection = db.collection('universe');
		
		
		
		collection.find({'database':col}).toArray(function(err, docs){
			if(err) console.log(err)
			
			console.log(docs);
			summary = docs[0];
			
			if(docs[0] == undefined){
				//No entries match
				cb({ERROR:"NO ENTRIES FOUND"})
				return;
			}
			
			
					// 2) Get the DB
			MongoClient.connect('mongodb://127.0.0.1:27017/' + user, function(err, db){
				if(err) throw err
				var collection = db.collection(col);
				
				
				
				collection.find().limit(parseInt(lim)).toArray(function(err, docs){
					if(err) console.log(err)
					
					printOut = docs;
					
					cb({summary:summary, data:printOut});
					
					
				});
				
				
			})

			
		});
		
		
	})
	
	
	
}

exports.getSingleDatabase  = getSingleDatabase;
exports.returnAllDatabases = returnAllDatabases;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getDataByDate = getDataByDate;
exports.getUserDatabases  =getUserDatabases;
exports.getDatabase = getDatabase;
exports.addDatabaseToUser = addDatabaseToUser;

openDatabase();
