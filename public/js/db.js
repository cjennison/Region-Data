//test http://felek.cns.umass.edu:1337/db?db=StreamTempData&user=janesmith


var db = null;
var user = null; 

function init(){
	db = getURLVariable('db');
	user = getURLVariable('user');
	
	
	//var me = $.get("/whoami")
	//get fingerprint
	var fp = localStorage.getItem('fingerprint');
	if(fp == null){
		//generate fingerprint
		fp = guid();
		localStorage.setItem('fingerprint', fp);
	}
	
	
	$.post("/record-view" ,{db:db, user:user, fp:fp});
	
	
	$.post("/viewDatabase", {
		db:db,
		user:user,
		limit:20,
		_id: "53a02a801dae28e206e93f15"

		
	} , function(d){
		console.log(d);
		
		if(d.ERROR){
			console.log("ERROR FOUND")
			return;
		}
		
		
		var summ = d.summary;
		$(".db-title").html(summ.database);
		
		//TODO: Append more owners
		var authors = summ.admin;
		$(".db-authors").html(authors);
		
		
		var data = d.data;
		var first = data[0];
		for(var key in first){
			if(key != "_id"){
				var td = $("<td>" + key + "</td>");
				$(".table").find("thead").find("tr").append(td);
			}
		}
		
		for(var i = 0;i < data.length; i++){
			var tr = $("<tr></tr>");
			for(var key in data[i]){
				if(key != "_id"){
					var td = $("<td>" + data[i][key] + "</td>");
					$(tr).append(td);
				}
			}
			
			$(".table").find("tbody").append(tr);
		}
		
		
		
		
	})
}

function download(){
	$.post('/download', {db:db, username:user, format:"CSV", explore:true}, function(d){
		console.log(d);
		document.location.href = "/" + d;
	})
}

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();
