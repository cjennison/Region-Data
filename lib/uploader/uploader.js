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

//Automatic File Deletion
var tmpFiles = [];


function puts(error, stdout, stderr) { 
	sys.puts(stdout) 
	
} 


function startUpload(req, res){
	
	var username = req.session.username;
	var title    = req.body.filename;
	
	console.log(req.files.uploadfile);
	
	console.log("SENDING USERNAME: " + username);
	
	fs.readFile(req.files.uploadfile.path, function (err, data) {
	  var newPath = "/home/dataadmin/tmp/" + uuid.v4() + ".csv";
	  console.log(newPath);
	  
	  var size = bytesToSize(req.files.uploadfile.size);
	  
	  fs.writeFile(newPath, data, function (err) {
	  	if(err) throw err;
	  	
	  	
	  	
	  	
	  	tmpFiles.push({
	  		file:newPath,
	  		time:10
	  	})
	  	
	  	
	  	database.addDatabaseToUser(username, title, size);
	  	
	  	exec("mongoimport --db " + username + " --collection " + title + " --type csv --headerline --file " + newPath, puts);
	  	
	  	res.redirect("/main?upload=complete");
	  });
	});
		
	
}


function checkTempFiles(){
	setInterval(function(){
		for(var i = 0;i < tmpFiles.length; i++){
			tmpFiles[i].time--;
			
			if(tmpFiles[i].time <= 0){
				console.log(tmpFiles);
				console.log("Preparing to delete: " + tmpFiles[i].file)
				deleteFile(tmpFiles[i].file)
				
				tmpFiles.splice(i, 1);
				console.log(tmpFiles);
			}
		}
	},1000)
}

function deleteFile(path){
	fs.unlink(path, function(err){
		if(err) throw err;
		console.log("Deleted Successfully")
	})
}

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};


checkTempFiles();




exports.startUpload = startUpload;
