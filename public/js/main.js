var downloadableFormats = ["CSV", "JSON"];

$("#button_mydata").attr("onclick", "window.location.href = '/main'");
$("#button_explore").attr("onclick", "window.location.href = '/explore'");
$("#logo").attr("onclick", "window.location.href = '/main'");
$("#btn_download").attr("onclick", "downloadFile()");

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
				"<button type='button' class='btn btn-default' id='btn_viewer_" + entry.name + "' >View</button> " + 
				"<button type='button' id='btn_model_" + entry.name + "' class='btn btn-default'>Model</button> " +
				"<button type='button' id='btn_share_" + entry.name + "' class='btn btn-default'>Share</button> " +
				"<div class='btn-group btn-group-sm'> <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> Download as <span class='caret'></span> </button>" + 
				"<ul class='dropdown-menu' id='dropdown_format_" + entry.name + "'></ul> </div> </div> </td> </tr>");
			
			$("#btn_browse_" + entry.name).attr("onclick", "browseData('" + entry.name + "', " + 5 + ")");
			$("#btn_model_" + entry.name).attr("onclick", "modelData('" + entry.name + "')");
			$("#btn_share_" + entry.name).attr("onclick", "shareData('" + entry.name + "')");
			$("#btn_viewer_" + entry.name).attr("onclick", "viewData('" + entry.name + "')");
			
			
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

function modelData(name){
	
	window.location.href = "/model?db=" + name;
	
}

function browseData(name, limit){
	
	//console.log("Browsing for: " + name + ", " + limit);
	window.location.href = "/browse?db=" + name + "&limit=" + limit;
	
	/*var browseDataset = {
		db: name,
		limit: limit
	}
	
	$.post("/showdatabase", browseDataset, function(response){
		console.log(response);
	})*/
	
}


function viewData(name){
	document.location.href = "/data-viewer?db=" + name;
}

function shareData(name){
	$.get("/whoami", function(d){
		console.log(d);
		document.location.href = "/db?db=" + name + "&user=" + d + "&shared=true";
		
	});
}

