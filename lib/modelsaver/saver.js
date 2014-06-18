var fs = require("fs");
var uuid = require('node-uuid');


function saveOutput(output, cb){
	var name = uuid.v4() + ".json";
	fs.writeFile("/home/dataadmin/tmp/" + name, output, function(err){
		cb(name);
	});
}


exports.saveOutput = saveOutput;
