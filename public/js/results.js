var model = getURLVariable('model');
var json = getURLVariable('f');

$("#button_mydata").attr("onclick", "window.location.href = '/main'");
$("#button_explore").attr("onclick", "window.location.href = '/explore'");
$("#logo").attr("onclick", "window.location.href = '/main'");

function init(){
	
	$("#model-results").find("h3").html("Results of " + model);
	
	$.getJSON("/" + json, function(d){
		console.log(d);
		
		for(var key in d){
			var name = key;
			var data = d[key];
			
			var tr = $("<tr><td>" + name + "</td><td>" + data + "</td></tr>");
			
			$("#model-results").find('tbody').append(tr);
		}
		
	})
}
