var variables = [];
var db;

$("#button_mydata").attr("onclick", "window.location.href = '/main'");
$("#button_explore").attr("onclick", "window.location.href = '/explore'");
$("#logo").attr("onclick", "window.location.href = '/main'");

function init(){
	db = getURLVariable('db');
	console.log(db);
	
	$("#db-tomodel").find("h3").html(db);
	
	
	$.post("/showdatabase", {db:db, limit:3}, function(d){
		console.log(d);
		
		var data = d;
		
		var item = data[0];
		for(var key in item){
			if(key != "_id"){
				variables.push(key);
				var td = $("<th> " + key + "</th>");
				$("#db-tomodel").find("thead").find("tr").append(td);
			}
		}
		
		for(var i = 0;i < data.length; i++){
			var tr = $("<tr></tr>");
			
			for(var key in data[i]){
				if(key != "_id"){
					var td = $("<td> " + data[i][key] + "</td>");
					$(tr).append(td);
				}
			}
			
			$("#db-tomodel").find("tbody").append(tr);
		}
	});
}


function useModel(m, el){
	require([m], function(d){
		var newhtml = model.init(el);
		
		$(el).parent().find(".modelinfo").html(newhtml);
	})
}
