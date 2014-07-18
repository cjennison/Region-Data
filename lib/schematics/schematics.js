var database = require("../database");
var uploader = require("../uploader");
var types	 = require("../types");

/**
 * Aggregates a dataset into a schema given parameters
 * @param {Object} opts
 * var obj = {
 user:user,
 schema:schema,
 trans:trans,
 db:db
 config:config
 };

 * @param {Object} cb
 */
function aggregateDataFromSchema(opts, cb) {

	var schema, target_db;

	//get the Schema and Database
	database.getSingleSchema(opts.schema, function(schematic) {
		console.log(("Schema Retrieved"))

		schema = schematic;

		database.getSingleDatabase(null, opts.db, opts.user, opts.user, 0, function(db) {
			//console.log(db);
			target_db = db;

			var new_data = outputSchemedData(schema, target_db, opts.trans);

			var size = uploader.bytesToSize((JSON.stringify(new_data).length) * 8);

			var badges = target_db.badges;
			if (badges == undefined) {
				badges = [];
			}

			badges.push({
				badge : "Schema",
				info : opts.schema,
				date : new Date().toDateString()
			})

			var newDatabase = {
				name : opts.config.new_name,
				filename : opts.config.new_name,
				size : size,
				badges : badges,
				data : new_data
			}

			cb(newDatabase);

			/*
			 database.createDatabase(opts.user, newDatabase, function(d){
			 cb(new_data);
			 })
			 */

		})
	});

}

function outputSchemedData(schema, data, mapping) {
	
	console.log("SCHEMATIC: ------- ")
	console.log(schema);

	//This is the database to be returned, fully schemed
	var newDatabase = [];

	for (var i = 0; i < data.data.length; i++) {
		var d = data.data[i];

		var newdata = {};

		for (var key in d) {

			var foundkey = false;
			var map = null;

			//check the key in the mapping
			for (var j = 0; j < mapping.length; j++) {
				if (key == mapping[j].native) {
					foundkey = true;
					map = mapping[j].map;

				} else {

				}
			}

			if (foundkey == false) {
				//No map was found, put the variable back
				newdata[key] = d[key];
			} else {
				//Found a map, map it
				var val = d[key];

				//Edit teh value
				var keyScheme = findSchema(schema, map)
				val = fixValueFromSchema(val, keyScheme);
				//Put it to the mapped variable
				newdata[map] = val;

			}

		}

		newDatabase.push(newdata);

	}

	return newDatabase;

}

function fixValueFromSchema(val, scheme) {
	//console.log(scheme);
	var dataval
	switch (scheme.type) {
		case "integer": 
			if(checkPrimitive(val, 'number')){
				dataval = new types.DataInteger(scheme, val).val;
			} else {
				//Attempt conversion
				var newval = parseFloat(val);
				if(newval == NaN){
					//Failed to convert
					dataval = "ERROR 00001:Wrong Variable Type - Expected number, Recieved " + typeof(val);
				} else {
					dataval = new types.DataInteger(scheme, newval).val;
				}
				
			}

			break;
		case "string":
			if(checkPrimitive(val, 'string')){
				dataval = new types.DataString(scheme, val).val;
			} else {
				dataval = "ERROR 00001:Wrong Variable Type - Expected string, Recieved " + typeof(val);
			}
		
			
			break;
		
	}

	return dataval;

}

function checkPrimitive(val, type){
	if(typeof(val) != type){
		return false;
	}
	return true;
}


function findSchema(schema, key) {

	for (var i = 0; i < schema.schema.length; i++) {
		if (schema.schema[i].name == key) {

			return schema.schema[i];

		}
	}
}

exports.aggregateDataFromSchema = aggregateDataFromSchema;
