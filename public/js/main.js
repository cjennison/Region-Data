var downloadableFormats = ["CSV", "JSON"];

$("#button_mydata").attr("onclick", "window.location.href = '/main'");
$("#button_explore").attr("onclick", "window.location.href = '/explore'");
$("#logo").attr("onclick", "window.location.href = '/main'");
$("#btn_download").attr("onclick", "downloadFile()");

$("#btn_upload").click(function(){
	
	var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "filename").val(convertToValidFilename($("#field_name").val()));
               
	$('#form_upload').append(input);
	
});

$("#btn_choosefile").on("change", function(){
	
    var value = this.value.split(/[\/\\]/).pop();
    value = value.substr(0, value.lastIndexOf('.'));
    //console.log(value);
    $("#field_filename").val(value);
    
});

window.onload = function(){
	
	$.get('/user-databases', function(response){
		
		console.log(response);
		
		response.forEach(function(entry){
			
			$("#content_data").append("<tr> <td>" + entry.name + "</td> <td>" + entry.size + "</td> <td class='cell-btn'> <div class='btn-group btn-group-sm nav-dataoptions'> " + 
				"<button type='button' id='btn_browse_" + entry.name + "' class='btn btn-default'>Browse</button> "  + 
				"<button type='button' id='btn_settings_" + entry.name + "' class='btn btn-default'>Settings</button> " +
				"<button type='button' class='btn btn-default' id='btn_viewer_" + entry.name + "' >View</button> " + 
				"<button type='button' id='btn_model_" + entry.name + "' class='btn btn-default'>Model</button> " +
				"<button type='button' id='btn_share_" + entry.name + "' class='btn btn-default'>Share</button> " +
				"<button type='button' id='btn_delete_" + entry.name + "' class='btn btn-default btn-danger'>Delete</button> " +
				"<div class='btn-group btn-group-sm'> <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> Download as <span class='caret'></span> </button>" + 
				"<ul class='dropdown-menu' id='dropdown_format_" + entry.name + "'></ul> </div> </div> </td> </tr>");
			
			var maxScreen = Math.floor((window.innerHeight - 300)/51);
			
			
			$("#btn_browse_" + entry.name).attr("onclick", "browseData('" + entry.name + "', " + maxScreen + ")");
			$("#btn_model_" + entry.name).attr("onclick", "modelData('" + entry.name + "')");
			$("#btn_share_" + entry.name).attr("onclick", "shareData('" + entry.name + "')");
			$("#btn_viewer_" + entry.name).attr("onclick", "viewData('" + entry.name + "')");
			$("#btn_settings_" + entry.name).attr("onclick", "settingsData('" + entry.name + "')");
			$("#btn_delete_" + entry.name).attr("onclick", "deleteData('" + entry.name + "')");
			
			
			downloadableFormats.forEach(function(format){
				$("#dropdown_format_" + entry.name).append("<li><a id='btn_download_" + entry.name + "_" + format + "'>" + format + "</a></li>");
				$("#btn_download_" + entry.name + "_" + format).attr("onclick", "downloadFile('" + entry.name + "', '" + format + "')");
			})
			
		})
		
	});	
}

function downloadFile(name, format){
	
	console.log("Trying to download " + name + " as " + format);
	
	var downloadData = {
		db: name,
		format: format
	}
	
	$.post("/download", downloadData, function(response){
		
		console.log(response);
		window.location.href = "http://felek.cns.umass.edu:1337/" + response;
		//$("#downloadframe").src = "http://felek.cns.umass.edu:1337" + response;
		
	})
	
}

function settingsData(name){
	
	window.location.href = "/data-settings?db=" + name;
	
}

function modelData(name){
	
	window.location.href = "/model?db=" + name;
	
}

function browseData(name, limit){
	
	window.location.href = "/edit?file=old&db=" + name + "&limit=" + limit;
	
}


function viewData(name){
	document.location.href = "/data-viewer?db=" + name;
}

function deleteData(name){
	
	$.get('/whoami', function(response){
		
		console.log(response);
		
		var ob_removedata = {
			
			db: name,
			user: response
			
		}
		
		$.post('/remove-database', ob_removedata, function(response){
			
			console.log(response);
			
		});
		
	});
	
}

function shareData(name){
	$.get("/whoami", function(d){
		console.log(d);
		document.location.href = "/db?db=" + name + "&user=" + d + "&shared=true";
		
	});
}

