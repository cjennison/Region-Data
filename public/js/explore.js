$("#button_mydata").attr("onclick", "window.location.href = '/main'");
$("#button_explore").attr("onclick", "window.location.href = '/explore'");

function init(){
	$.get("/getAllData", function(d){
		console.log(d);
		
		for(var i = 0;i < d.length; i++){
			var data = d[i];
			
			var tr = $("<tr></tr>");
			$(tr).append("<td><a href='/db?db=" + data.database + "&user=" + data.admin + "'>" + data.database + "<a></td>");
			$(tr).append("<td>" + data.admin + "</td>");
			$(tr).append("<td>" + data.size + "</td>");
			$(tr).append("<td><button class='btn btn-default' onclick='download( &#39;" + data.database +  "&#39;, &#39;" + data.admin + "&#39;)'>Download</button></td>");
			$("#db-explore").find("tbody").append(tr);
			
		}
		
	})
}

function download(db, user){
	console.log(db, user)
	
	$.post('/download', {db:db, username:user, format:"CSV", explore:true}, function(d){
		console.log(d);
		document.location.href = "/" + d;
	})
}
