var db = null;
var limit = null;

lastEntry = 0;

var modifiedentries = [];

$("#btn_back").attr("onclick", "window.location.href = '/main';");
$("#btn_save").attr("onclick", "saveChanges()");

$("#button_mydata").attr("onclick", "window.location.href = '/main'");
$("#button_explore").attr("onclick", "window.location.href = '/explore'");
$("#logo").attr("onclick", "window.location.href = '/main'");

window.onload = function(){
	
	
	$(window).scroll(function() {
	   if($(window).scrollTop() + $(window).height() == $(document).height()) {
	    getMoreEntries();
	   }
	});
	
	
	console.log("Browse loaded");
	
	db = getURLVariable("db");
	limit = getURLVariable("limit");
	lastEntry = limit;
	
	var browseDataset = {
		db: db,
		limit: limit
	}
	
	$.post("/showdatabase", browseDataset, function(response){
		
		console.log(response[0]);
		
		$("#content_head").append("<tr id='content_headers'>");
		
		for (var key in response[0]){
			
			if (key != "_id"){
				
				$("#content_headers").append("<th>" + key + "</th>");
				
			}
			
		}
		
		$("#content_headers").append("</tr>");
		
		response.forEach(function(entry){
			
			var tr = $("<tr id='entry_" + entry._id + "'></tr>");
			
			for (var key in response[0]){
				
				if (key != "_id"){
					
					var field_edit = $("<input type='text' class='form-control' value='" + entry[key] + "'>");
					var th = $("<th></th>");
					
					console.log(entry[key]);
					
					field_edit.focus(function(){
					
						//console.log(hey);
						
					});
					
					field_edit.blur(function(){
						
						finishEditField(field_edit);
						
					});
					
					th.append(field_edit)
					
					$(tr).append(th);
				
				}
			}
			
			
			
			$("#content_data").append(tr);
			
		})
		
	})
	
}

function appendError(text){
	
	$("#alert").remove();
	$("#btn_save").before("<div id='alert' style='margin-top:10px; display:none;' class='alert alert-success'>" + text + "</div>");
	$("#alert").fadeOut(100).fadeIn(100);
}

function editField(field, val){
	
	
}

function finishEditField(field){
	
	field.parent().parent().css("background-color", "#FFE2B3");
	$("#alert").remove();
	
}

function saveChanges(){
	
	$("#content_data").find('tr').each(function(){
		$(this).css("background-color", "white");
	});
	
	appendError("Save successful!")
	
}

function getMoreEntries(){
	var next = 10;
	$.post('/morerows', { last:lastEntry, next:next, db:db }, function(response){
		response.forEach(function(entry){
			
			var tr = $("<tr id='entry_" + entry._id + "'></tr>");
			
			for (var key in response[0]){
				
				if (key != "_id"){
					
					var field_edit = $("<input type='text' class='form-control' value='" + entry[key] + "'>");
					var th = $("<th></th>");
					
					console.log(entry[key]);
					
					field_edit.focus(function(){
					
						//console.log(hey);
						
					});
					
					field_edit.blur(function(){
						
						finishEditField(field_edit);
						
					});
					
					th.append(field_edit)
					
					$(tr).append(th);
				
				}
			}
			
			
			
			$("#content_data").append(tr);
			
		})
		
		lastEntry = lastEntry + next;
	})
}
