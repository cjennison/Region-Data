var uuid = require('node-uuid');
var fs = require("fs");
var json2csv = require('json2csv');

var database = require("../database");

var zip = require('express-zip');
var AdmZip = require('adm-zip');

function prepareDownload(res, user, col, format,cb){
	console.log("preparing download with: " + user);
	console.log("collection: " + col);
	
	database.getDatabase(user, col, 0, function(data){
		//console.log(data);
		var c_data = cleanDownload(data);
		
		//TODO: CHECK FORMATTING
		
		switch(format){
			case "JSON":
				writeDataToFile(res, JSON.stringify(c_data.data), col,".json", cb)
				break;
			
			case "CSV":
				convertToCSV(c_data, function(d){
					writeDataToFile(res, d, col, ".csv", cb)
					
				})
				break;
			
			default:
				//JSON
				writeDataToFile(res, JSON.stringify(c_data.data), col, ".json" ,cb)
				break;
				
		}
		

	})

}




function convertToCSV(datax, cb) {
	console.log(datax.keys)
	
	json2csv({data: datax.data, fields: datax.keys}, function(err, csv) {
	  if (err) console.log(err);
	  
	  cb(csv);
	  
	});
	
}

function writeDataToFile(res, data, name, ext, cb){
	var title = uuid.v4() + "_" + name + ext;
	fs.writeFile("/home/dataadmin/todownload/" + title, data, function(err){
		if(err) throw err;
		
		var zip = new AdmZip();
		zip.addLocalFile("/home/dataadmin/todownload/" + title);
		zip.writeZip(/*target file name*/"/home/dataadmin/todownload/" + title + ".zip");
		
		
	
		cb(title + ".zip");

	});
}


//Cleans data by removing _id from it
function cleanDownload(data){	
	var olddata = data;
	var newdata = [];
	
	var keys = []
	
	for(var key in olddata[0]){
		if(key != "_id"){
			keys.push(key);
		}
	}
	
	
	for(var i = 0;i < olddata.length; i++){
		var newobj = {};
		for(var key in olddata[i]){
			var obj = olddata[i][key];
			if(key != "_id"){
				//keys.push(key);
				newobj[key] = olddata[i][key]
			}
		}	
		newdata.push(newobj)
	}
	return {data:newdata, keys:keys};
}



exports.prepareDownload = prepareDownload;
