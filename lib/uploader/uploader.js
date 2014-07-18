var url = require("url");
var multipart = require("multipart");
var sys = require("sys");
var fs = require("fs");
var express = require('express');

var database = require("../database");
var uuid = require('node-uuid');

var sys = require('sys');
var exec = require('child_process').exec;
var child;

var unzip = require("unzip");

//Automatic File Deletion
var tmpFiles = [];
var Converter=require("csvtojson").core.Converter;


//
var zips = {};


//var stream = "No Stream Available";

function puts(error, stdout, stderr) {
	//sys.puts(stdout)
	console.log(stdout);
}

function startUpload(req, res) {

	var username = req.session.username;
	var title = req.body.filename;

	var subj = req.body.subject ? req.body.subject : "";
	var desc = req.body.description ? req.body.description : "";
	var name = req.body.name;
	var gotosettings = req.body.gotosettings;

	var filetype = req.body.filetype ? req.body.filetype : "csv";
	filetype = filetype.toLowerCase();

	var headerline = filetype == "csv" ? "--headerline" : "";

	console.log("FILENAME: ");
	console.log(req.files.uploadfile);

	console.log("FILETYPE: " + filetype);

	console.log("SENDING USERNAME: " + username);

	fs.readFile(req.files.uploadfile.path, function(err, data) {
		var newPath = "/home/dataadmin/tmp/" + uuid.v4() + "." + filetype;
		console.log(newPath);

		var size = bytesToSize(req.files.uploadfile.size);

		if (filetype == "zip") {

			var info = {
				data : data,
				title : title,
				subj : subj,
				desc : desc,
				name : name,
				files : req.files,
				filetype : filetype,
				username : username
			}

			handleZip(res, info);
			return;

		} else {

			fs.writeFile(newPath, data, function(err) {
				if (err)
					throw err;

				tmpFiles.push({
					file : newPath,
					time : 10
				})

				database.addDatabaseToUser(username, title, size, name, subj, desc);

				exec("mongoimport --db " + username + " --collection " + title + " --type " + filetype + " " + headerline + " --file " + newPath, puts);

				if (gotosettings == "on") {

					res.redirect("/data-settings?db=" + title);

				} else {

					res.redirect("/main?upload=complete");

				}

			});
		}
	});

}

function handleZip(res, info) {
	console.log(info);

	//fs.createReadStream('path/to/archive.zip').pipe(unzip.Extract({ path: 'output/path' }));

	var zipname = uuid.v4();

	//1) Place the Zip in a temporary place
	var newPath = "/home/dataadmin/tmp/zips/" + zipname + ".zip";
	fs.writeFile(newPath, info.data, function(err) {
		if (err)
			throw err;

		var stream = fs.createReadStream(newPath); //.pipe(unzip.Extract({ path: "/home/dataadmin/tmp/zips/" + zipname }));
		var pipe = stream.pipe(unzip.Extract({ path: "/home/dataadmin/tmp/zips/" + zipname, callback:rec }).on('close', rec)).on('close', rec);
		
		
		checkStream(stream, function(){
			parseZipDirectory(res, "/home/dataadmin/tmp/zips/" + zipname, info);
		});
		


	})

}

function checkStream(stream, cb){
	setTimeout(function(){
		
		if(stream.destroyed == false){
			checkStream(stream, cb);
		} else {
			cb();
		}
		
	},100)
}


function getStream(cb){
	console.log("GET STREAM:  ");
	cb(zips);
}

function rec(){
	console.log("Clear")
}

function parseZipDirectory(res, dir, info){
	
	var data = {};
	
	var name = info.files.uploadfile.name.split(".")[0];
	var native_dir = dir + '/';
	var dir = dir + '/' + name + '/';
	
	//find /home/dataadmin/tmp/zips/47eec462-1a1e-409f-8d0e-33351b7b2ff8/ -type f -exec mv {} /home/dataadmin/tmp/zips/47eec462-1a1e-409f-8d0e-33351b7b2ff8/ziptest/ \;
	//find /home/dataadmin/tmp/zips/47eec462-1a1e-409f-8d0e-33351b7b2ff8/ -type f -print0|xargs -0r mv -it /home/dataadmin/tmp/zips/47eec462-1a1e-409f-8d0e-33351b7b2ff8/ziptest/
	
	
	
	exec("chmod -R 0777 " + dir, puts);
	
	exec("find " + dir + " -type f -print0|xargs -0r mv -it " + dir, function(){
		getZipOverview(res, dir, info);
	});
	
	
	
}

function getZipOverview(res, dir, info){
	var data = {};
	var c = 0;
	fs.readdir(dir,function(err,files){
	    if (err) throw err;
	   
	    files.forEach(function(file){
	        c++;
	        
	       // fs.chmodSync(dir+file, 0777);
	        
	        //find -type f -exec mv {} ziptest/ \;

	        
	        //Only load in directories
	        if(fs.lstatSync(dir+file).isDirectory()){
	        	console.log("FOUND A DIRECTORY");
	        	//exec("ls -l", puts);
	        	c--;
	        	
	        } else {
	        	 fs.readFile(dir+file,'utf-8',function(err,html){
		            if (err) throw err;
		          	
		            data[file]= {
		            	name:file,
		            	dir:dir+file,
		            	size:bytesToSize(html.length*8)
		            };
		            
		            //Get the extension
		            var extension = file.split(".");
		            extension = extension[extension.length-1];
		            parseByExtension(extension, html, function(parsed_data){
		            	c--;
		            	
		            	//console.log(parsed_data);
		            	data[file].data = parsed_data;
		            	
		            	console.log("Finished: " + c)
		            	
		            	 if (0===c) {
			               // console.log(data);  //socket.emit('init', {data: data});
			               
			               //SEND DOWN THE META DATA
			               var id = uuid.v4();
			               zips[id] = data;
			               
			               
			               res.redirect("/zip-organize?zipid=" + id);
			               
			               //console.log("Finished Parsing");
			               //console.log(dir+file);
			            }
		            })
		            
		            
		            
		            
		            
		           
		        });
	        }
	        
	       
	    });
	});
}


function parseByExtension(ext, data, cb){
	
	console.log(ext);
	
	if(ext == "csv"){
		var csvConverter = new Converter();
		var conv = csvConverter.fromString(data, function(d){
			//console.log(conv)
			
		})
		
		csvConverter.on("end_parsed",function(jsonObj){
		  // console.log(jsonObj); //here is your result json object
		   
		   var last = jsonObj.length > 5 ? 5 : jsonObj.length;
		   var slicedArr = jsonObj.slice(0, last);
		   
		   
		   cb(slicedArr);
		});
		
	} else if(ext == "json"){
		
		var jsonObj = JSON.parse(data);
		
		var last = jsonObj.length > 5 ? 5 : jsonObj.length;
		var slicedArr = jsonObj.slice(0, last);
		
		
		cb(slicedArr);
	}
	
	
}


function checkTempFiles() {
	setInterval(function() {
		for (var i = 0; i < tmpFiles.length; i++) {
			tmpFiles[i].time--;

			if (tmpFiles[i].time <= 0) {
				console.log(tmpFiles);
				console.log("Preparing to delete: " + tmpFiles[i].file)
				deleteFile(tmpFiles[i].file)

				tmpFiles.splice(i, 1);
				console.log(tmpFiles);
			}
		}
	}, 1000)
}

function deleteFile(path) {
	fs.unlink(path, function(err) {
		if (err)
			throw err;
		console.log("Deleted Successfully")
	})
}

function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0)
		return '0 Byte';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};



checkTempFiles();

exports.bytesToSize = bytesToSize;
exports.getStream	= getStream;
exports.startUpload = startUpload;
