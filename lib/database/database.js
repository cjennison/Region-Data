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
function addDatabaseToUser(user, database, size, name, subject, description){
	MongoClient.connect('mongodb://127.0.0.1:27017/users_regiondata', function(err, db){
		if(err) throw err
		
		var collection = db.collection("users_regiondata");
		//	var collection = new mongodb.Collection(client_userdb, 'users_regiondata');

		
		console.log(user);
		console.log(database);
		
		
		
		collection.update({'username':user},  {$push:{ 'MyData' :  {'name': database, 'size' : size, 'formalname': name, 'subject':subject, 'description':description} }}  , function(err, docs){			
			if(err) console.log(err);
			console.log(docs);
			
			
			
			collection.findOne({
				"username" : user
				}, function(err, document) {
					console.log(document);		
			});
			
			addDatabaseToUniverse(user, database, size, name, subject, description);
			//cb(docs);
		})
		
	});
	
	
	
	
}


function addDatabaseToUniverse(user, database, size, name, subject, description){
	MongoClient.connect('mongodb://127.0.0.1:27017/universe', function(err, db){
		if(err) throw err
		var collection = db.collection("universe");
		
		console.log("Adding Database to Universe");
		
		collection.insert({'database': database, 'admin': user, 'contributors':[user], 'size':size, 'name':name, 'subject':subject, 'description':description}, function(err, docs){
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
	
	/*MongoClient.connect('mongodb://127.0.0.1:27017/users_regiondata', function(err, db){
		
		
		if (err) throw err
		var collection = db.collection('users_regiondata');
		
		collection.find({'username': you}).toArray(function(err, docs){
			
			console.log(docs);
			
		})
		
		
	});*/
	
	
	
}


function getMoreRows(col, last, next, user, cb){
	var lim = last + next;
	
	
	MongoClient.connect('mongodb://127.0.0.1:27017/' + user, function(err, db) {
		if (err)
			throw err
		var collection = db.collection(col);

		collection.find().limit(parseInt(lim)).toArray(function(err, docs) {
			if (err)
				console.log(err)

			console.log(docs);
			
			var rows = docs.splice(last, next);
			
			cb(rows)
			

		});

	})
	

	
}

function createDatabase(username, data, cb){
	
	console.log("'I must go. My people need me.");
	console.log("Username: " + username);
	
	MongoClient.connect('mongodb://127.0.0.1:27017/' + username, function(err, db) {
		
		if(err){
			throw err
		}
		
				
		var newcollection = db.collection(data.filename);
		
		newcollection.insert(data.data, function(err, records){
			
			console.log(records);
			
		});
		
		//newcollection.update({}, )
		
		addDatabaseToUser(username, data.filename, data.size, data.name);
		
	});
	
	cb("Reached database.createDatabase()!");
	
}

function removeDatabase(db, user, cb){
	
	var targetdatabase = db
	
	MongoClient.connect('mongodb://127.0.0.1:27017/universe', function(err, db){
		
		if(err) throw err
		var collection = db.collection("universe");
		
		collection.remove( { 'database' : targetdatabase, 'admin' : user }, 1, function(err, resp){
			
			console.log(err);
			console.log(resp);
			
		});
		
	});
	
	MongoClient.connect('mongodb://127.0.0.1:27017/users_regiondata', function(err, db){
		
		if(err) throw err
		var collection = db.collection("users_regiondata");
		
		collection.update(
			
			{ 'username': user },
			{ $pull: { 'MyData': { 'formalname': targetdatabase } } }, 
			
			function(err, resp){
				
				console.log(err);
				console.log(resp);
				
			}
			
		);
		
	});
	
	MongoClient.connect('mongodb://127.0.0.1:27017/' + user, function(err, db){
		
		if(err) throw err
		
		var collection = db.collection(targetdatabase);
		/*collection.remove(function(err, resp){
			
			console.log(err);
			console.log(resp);
			
		});*/
		
		collection.drop(function(err, resp){
			
			console.log(err);
			console.log(resp);
			
		});
		
	});
	
	cb("Removed dataset: " + targetdatabase);
	
}

function getRelations(user, database, cb){
	
	//var myrelations = [];
	
	MongoClient.connect('mongodb://127.0.0.1:27017/users_regiondata', function(err, db){
		
		if (err) throw err
		
		var collection = db.collection('users_regiondata');
		
		collection.find( {username: user} ).toArray( function(err, docs){
			
			if (err) throw err
			
			for (var i = 0; i < docs[0].MyData.length; i++){
				
				if (docs[0].MyData[i].name == database){
					
					cb(docs[0].MyData[i].relations);
					
				}
				
			}
			
		})
		
	})
	
}

function addRelation(user, database, attribute, relateddb, relateto, cb){
	
	MongoClient.connect('mongodb://127.0.0.1:27017/users_regiondata', function(err, db){
		
		var collection = db.collection('users_regiondata');
		
		/*collection.update( 
			
			{ name: user, 'MyData.name': database},
			
			{$set: {'MyData.$.relations': []}},
			
			function(err, res){
				
				console.log(res);
				
			}
			
		
		)
		
		collection.update(
			
			{name: user, 'MyData.name': database},
			
			{$addToSet: {'MyData.$.relations': 'Test!'}},
			
			function(err, res){
				
				console.log(res);
				console.log(err);
				
			}
			
		);*/
		
		collection.find( {username: user}).toArray( function(err, docs){
			
			console.log(docs);
			console.log(docs[0].MyData);
			
			for (var i = 0; i < docs[0].MyData.length; i++){
				
				if (docs[0].MyData[i].name == database){
					
					if (docs[0].MyData[i].relations == null){
					
						docs[0].MyData[i].relations = [];
						
					}
					
					var relationindex = -1;
					
					console.log("------Testing for existence------");
					
					for (var j = 0; j < docs[0].MyData[i].relations.length; j++){
						
						console.log("The attribute is: " + attribute);
						console.log("What we found is: " + docs[0].MyData[i].relations[j].attribute);
						
						if (docs[0].MyData[i].relations[j].attribute == attribute){
							
							console.log("They are equivalent!"); //
							
							relationindex = j;
							break;
							
						}
						
					}
					
					console.log("------Testing for existence------");
					
					
					
					if (relationindex == -1){
						
						var newrelation = {
							
							attribute: attribute,
							relations: [{relateddb: relateddb, relatedattr: relateto}]
							
						}
						
						docs[0].MyData[i].relations.push(newrelation);
						
					}else{
						
						var additionalrelation = {
							
							relateddb: relateddb,
							relatedattr: relateto
							
						}
						
						docs[0].MyData[i].relations[relationindex].relations.push(additionalrelation);
						
					}
					
					console.log("Relations: ");
					console.log(docs[0].MyData[i].relations);
					console.log("Relations[0]: ");
					console.log(docs[0].MyData[i].relations[0]);
					
					collection.update( {username: user}, docs[0], function(err, docs){
						
						console.log(docs);
						
					});
						
					break;
					
				}
				
			}
			console.log("-----------------");
			console.log(docs[0].MyData);
			
		});
		
	})
	
	cb("I added a relation!");
	
	//
	
}

exports.removeDatabase = removeDatabase;
exports.getMoreRows = getMoreRows;
exports.getSingleDatabase  = getSingleDatabase;
exports.returnAllDatabases = returnAllDatabases;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getDataByDate = getDataByDate;
exports.getUserDatabases  =getUserDatabases;
exports.getDatabase = getDatabase;
exports.addDatabaseToUser = addDatabaseToUser;
exports.createDatabase = createDatabase;
exports.addRelation = addRelation;
exports.getRelations = getRelations;

openDatabase();
