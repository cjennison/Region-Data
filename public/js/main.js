var downloadableFormats = ["CSV", "JSON"];
var supportedFiletypes = ["CSV", "TSV", "ZIP", "JSON"];
var subjects = [["ecology", 33], ["astronomy", 25], ["biology", 18], ["preservation", 5], ["prehistoric culture", 3]];
var oldsubjectval = "";

$("#button_mydata").attr("onclick", "window.location.href = '/main'");
$("#button_explore").attr("onclick", "window.location.href = '/explore'");
$("#logo").attr("onclick", "window.location.href = '/main'");
$("#btn_download").attr("onclick", "downloadFile()");

$("#field_subject").focusin(function(){
	
	$("#opts_subject").show();
	
});

$("#field_subject").focusout(function(){
	
	if (overlistoption == false){
		
		$("#opts_subject").hide();		
		
	}

});

$("#btn_upload").click(function(){
	
	var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "filename").val(convertToValidFilename($("#field_name").val()));
               
	$('#form_upload').append(input);
	
});

$("#btn_choosefile").on("change", function(){
	
    var value = this.value.split(/[\/\\]/).pop();
    filename = value.substr(0, value.lastIndexOf('.'));
    filetype = value.substr(value.lastIndexOf('.') + 1, value.length);
    
    console.log(filetype);
    
    $("#field_name").val(filename);
    
    if ($.inArray(filetype.toUpperCase(), supportedFiletypes) == -1){
    	
    	var newoption = $("<option>" + filetype.toUpperCase() + "</option>");
    	$("#select_filetype").append(newoption);	
    	
    }
    
    $("#select_filetype").val(filetype.toUpperCase());
    checkFiletype();
    
});

$("#select_filetype").change(function(){
	
	console.log("I changed!");
	checkFiletype();
	
});

function checkFiletype(){
	
	$("#warning_unsupported").remove();
	
	if ($.inArray($("#select_filetype").val(), supportedFiletypes) == -1){
	
    	var warning = $("<div class='alert alert-warning' id='warning_unsupported'>Warning: <strong>." + $("#select_filetype").val().toLowerCase() + "</strong> is not an officially supported file type.</div>");
		$("#select_filetype").after(warning);
	
	}
	
}

window.onload = function(){
	
	$.get('/subjectsbypopularity', function(response){
		
		console.log("Subjects by popularity");
		console.log(response);
		
	});
	
	subjects.forEach(function(subject){
		
		var listgroupitem = $("<li class='list-group-item list-subjects'></li>");
		var badge = $("<span class='badge'>" + subject[1] + "</span>");
		var txt_subject = $("<p>" + subject[0] + "</p>");
		listgroupitem.append(badge);
		listgroupitem.append(txt_subject);
		$("#opts_subject").append(listgroupitem);
		
		listgroupitem.hover(function(){
			
			$(this).css("background-color", "rgb(223, 255, 250)");
			overlistoption = true;
			
		}, function(){
			
			$(this).css("background-color", "white");
			overlistoption = false;
			
		});
		
		listgroupitem.click(function(){
			
			$("#field_subject").val($(this).find("p").text());
			$("#opts_subject").hide();	
			
		});
			
		
	});
	
	$("#field_subject").bind("properychange keyup input paste", function(event){
		
		if (oldsubjectval != $(this).val()){
			
			console.log("I changed!");
			oldsubjectval = $(this).val();
			
			$(".list-subjects").each(function(index){
				
				subjectname = $(this).find("p");
				
				if (subjectname.text().indexOf(oldsubjectval) == 0){
					
					$(this).show();
					
				}else{
					
					$(this).hide();
					
				}
				
			})
			
		}
		
	});
	
	$.get('/user-databases', function(response){
		
		console.log(response);
		
		supportedFiletypes.forEach(function(type){
			
			var opt_filetype = $("<option>" + type + "</option>");
			$("#select_filetype").append(opt_filetype);
			
		});
		
		response.forEach(function(entry){
			
			var maxScreen = Math.floor((window.innerHeight - 300)/51);
			$("#content_data").append("<tr class='row-db' id='row_" + entry.name + "'> <td id='rowclickable1_" + entry.name + "'>" + entry.name + "</td> <td id='rowclickable2_" + entry.name + "'>" + entry.size + "</td> <td class='cell-btn'> <div class='btn-group btn-group-sm nav-dataoptions'> " + 
				"<button type='button' id='btn_browse_" + entry.name + "' class='btn btn-default'>Browse</button> "  + 
				"<button type='button' id='btn_settings_" + entry.name + "' class='btn btn-default'>Settings</button> " +
				"<button type='button' class='btn btn-default' id='btn_viewer_" + entry.name + "' >View</button> " + 
				"<button type='button' id='btn_model_" + entry.name + "' class='btn btn-default'>Model</button> " +
				"<button type='button' id='btn_share_" + entry.name + "' class='btn btn-default'>Share</button> " +
				"<button type='button' id='btn_delete_" + entry.name + "' class='btn btn-default btn-danger'>Delete</button> " +
				"<div class='btn-group btn-group-sm'> <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> Download as <span class='caret'></span> </button>" + 
				"<ul class='dropdown-menu' id='dropdown_format_" + entry.name + "'></ul> </div> </div> </td> </tr>");
			
			
			
			
			$("#btn_browse_" + entry.name).attr("onclick", "browseData('" + entry.name + "', " + maxScreen + ")");
			$("#rowclickable1_" + entry.name).attr("onclick", "browseData('" + entry.name + "', " + maxScreen + ")");
			$("#rowclickable2_" + entry.name).attr("onclick", "browseData('" + entry.name + "', " + maxScreen + ")");
			//$("#row_" + entry.name).attr("onclick", "browseData('" + entry.name + "', " + maxScreen + ")");
			$("#btn_model_" + entry.name).attr("onclick", "'modelData(" + entry.name + "')");
			$("#btn_share_" + entry.name).attr("onclick", "shareData('" + entry.name + "')");
			$("#btn_viewer_" + entry.name).attr("onclick", "viewData('" + entry.name + "')");
			$("#btn_settings_" + entry.name).attr("onclick", "settingsData('" + entry.name + "')");
			$("#btn_delete_" + entry.name).attr("onclick", "deleteData('" + entry.name + "')");
			
			$("#rowclickable1_" + entry.name).css("cursor", "pointer");
			$("#rowclickable2_" + entry.name).css("cursor", "pointer");
			
			$("#rowclickable1_" + entry.name).hover(function(){
				
				$(this).css("background", "linear-gradient(to right, #dffffa, white)");
				
				
			},
			
			function(){
				
				$(this).css("background", "white");
				
			});
			
			$("#rowclickable2_" + entry.name).hover(function(){
				
				$("#rowclickable1_" + entry.name).css("background", "linear-gradient(to right, #dffffa, white)");
				
			},
			
			function(){
				
				$("#rowclickable1_" + entry.name).css("background", "white");
				
			});
			
			
			downloadableFormats.forEach(function(format){
				$("#dropdown_format_" + entry.name).append("<li><a id='btn_download_" + entry.name + "_" + format + "'>" + format + "</a></li>");
				$("#btn_download_" + entry.name + "_" + format).attr("onclick", "downloadFile('" + entry.name + "', '" + format + "')");
			})
			
		})
		
		
		
	});	
}

function downloadFile(name, format){
	
	event.stopPropagation();
	
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
	event.stopPropagation();
	
}

function modelData(name){
	
	window.location.href = "/model?db=" + name;
	event.stopPropagation();
	
}

function browseData(name, limit){
	
	window.location.href = "/edit?file=old&db=" + name + "&limit=" + limit;
	event.stopPropagation();
	
}


function viewData(name){
	
	document.location.href = "/data-viewer?db=" + name;
	event.stopPropagation();
}

function deleteData(name){
	
	$.get('/whoami', function(response){
		
		console.log(response);
		
		var ob_removedata = {
			
			db: name,
			user: response
			
		}
		
		$.post('/remove-database', ob_removedata, function(){
			location.reload();
		});
		
	});
	
	event.stopPropagation();
	
}

function shareData(name){
	$.get("/whoami", function(d){
		console.log(d);
		document.location.href = "/db?db=" + name + "&user=" + d + "&shared=true";
		
	});
}


function aggregateSchema(){
	$.post("/createNewFromSchema", {
		
		schema:"Scoring",
		db:"playscores",
		transform:[
			{
				"native":"PlayerUsernames",
				"map":"Player"
			},
			{
				"native":"Points",
				"map":"Score"
			}
		
		],
		config:{
			"new_name":"PlayerScores_Conformed"
		}
		
		
	}, function(ret){
		console.log(ret);
	})
}










