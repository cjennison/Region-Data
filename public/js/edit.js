var datamatrix = [["", "", ""], ["", "", ""], ["", "", ""]];
var relations = [];

$("#btn_savedata").attr("onclick", "saveData()");
$("#btn_confirmrelate").attr("onclick", "addRelation()");

$("#field_selectdb_other").change(function(){
	
	/*$.get('/whoami', function(username){
		
		var dataget = {
			
			db: $("#field_selectdb_other").find(":selected").text(),
			user: username,
			limit: 1
			
		}
		
		$.post('/viewDatabase', dataget, function(response){
			
			$("#field_selectprop_other").empty();
			
			if (response == null){
				
				console.log("Response was null!");
					
			}else{
			
				for (var key in response.data[0]){
				
					if (key != "_id"){
					
						$("#field_selectprop_other").append("<option>" + key + "</option>");
					
					}
				
				}
				
			}
			
		});
		
	});*/
	
	
	refreshRelatedAttr();
	
});

window.onload = function(){
	
	//loadRelations();
	
	if (getURLVariable("file") == "old"){
		
		console.log("Old file!");
		
		$("#field_dataname").val(getURLVariable("db"));
		$("#header_dataname").text(getURLVariable("db"));
		
		$.post("/showdatabase", {db: getURLVariable("db"), limit: getURLVariable("limit")}, function(response){
			
			console.log(response);
			
			var existingmatrix = [];
			var existingheaders = [];
			existingheaders.push("");
			
			for (var key in response[0]){
			
				if (key != "_id"){
					
					existingheaders.push(key);
						
				}
				
			}
			
			existingheaders.push("");
			
			existingmatrix.push(existingheaders);
			
			for (var i = 0; i < response.length; i++) {
				
				var existingdatarow = [];
				existingdatarow.push("");
				
				for (var key in response[i]) {

					if (key != "_id") {

						existingdatarow.push(response[i][key]);

					}

				}
				
				existingdatarow.push("");
				
				existingmatrix.push(existingdatarow);

			}
			
			existingmatrix.push(new Array(existingmatrix[0].length));
			
			console.log(existingmatrix);
			
			datamatrix = existingmatrix;
			
			refreshRelations(function(){
				
				renderTable();
				
			});
			
			
			
		});
		
	}else if (getURLVariable("file") == "new"){
		
		$("#header_dataname").text("New Dataset");
		
		console.log("New file!");
		renderTable();
		
	}
	
	getOtherDatasets(function(){
		
		refreshRelatedAttr();
		
	});
	
};

function renderTable(){
	
	var headercolor = "#666666";
	var oddcolor = "white";
	var evencolor = "#F5F5F5";
	
	for (var i = 0; i < datamatrix.length; i++){
		
		var newrow = $("<tr></tr>");
		
		if (i == 0 || i == datamatrix.length - 1){
			
			newrow.css("background-color", headercolor);
			
		}else{
			
			if (i % 2 == 0){
				
				newrow.css("background-color", evencolor);
				
			}else{
				
				newrow.css("background-color", oddcolor);
				
			}
			
		}
		
		for (var j = 0; j < datamatrix[i].length; j++){
			
			var newcol = $("<td></td>");
			
			if (j == 0){
				
				if (i > 0 && i < datamatrix.length-1){
					
					if (datamatrix.length > 3){
					
						var btn_delete_row = $("<button type='button' class='btn'><span class='glyphicon glyphicon-remove'></span></button>");
						btn_delete_row.attr("onclick", "removeRow(" + i + ")");
						
						newcol.append(btn_delete_row);
					
					}
					
				}else if (i == datamatrix.length-1){
					
					var btn_add_row = $("<button type='button' class='btn'>+ROW</button>");
					btn_add_row.attr("onclick", "addRow()");
					
					newcol.append(btn_add_row);
					
					newcol.width(btn_add_row.width());
					
				}
				
			}else if (j > 0 && j < datamatrix[i].length-1){
				
				
				if (i != datamatrix.length-1){
					
				
					var txt_cell_info = $("<input class='form-control' id = 'input_" + i + "_" + j + "'>");
					txt_cell_info.val(datamatrix[i][j]);
					
					txt_cell_info.attr("onchange", "modCell(" + i + ", " + j + ")");
					
					if (i != 0 || datamatrix[0].length == 3){
						
						newcol.append(txt_cell_info);
						
					}else if (i == 0 && datamatrix[0].length > 3){
						
						var input_group = $("<div class='input-group'></div>");
					
						input_group.append(txt_cell_info);
						
						var input_group_btn = $("<span class='input-group-btn'></span>");
						var btn_delete_col = $("<button type='button' class='btn btn-default'><span class='glyphicon glyphicon-remove'></span></button>");
						btn_delete_col.attr("onclick", "removeCol(" + j + ")");
						
						input_group_btn.append(btn_delete_col);
						input_group.append(input_group_btn);
	
						newcol.append(input_group);
					}
				
				}
				
			}else if (j == datamatrix[i].length-1){
				
				if (i == 0){
					
					var btn_add_col = $("<button type='button' class='btn'>+COL</button>");
					btn_add_col.attr("onclick", "addCol()");
					btn_add_col.css("float", "right");
					
					newcol.append(btn_add_col);
					
				}
				
			}
			
			newrow.append(newcol);
			
		}
		
		$("#datatable").append(newrow);
		
	}
	
	renderRelations();
	
	refreshProperties();
	
	//addPropertiesToRelations(); //
	
}

function refreshProperties(){
	
	for (var i = 1; i < datamatrix[0].length - 1; i++){

		$("#field_selectprop_self").append("<option>" + datamatrix[0][i] + "</option>");
		
	}
	
}

function refreshRelatedAttr(){
	
	console.log("Refreshing related attributes!");
	
	$.get('/whoami', function(username){
		
		var dataget = {
			
			db: $("#field_selectdb_other").find(":selected").text(),
			user: username,
			limit: 1
			
		}
		
		$.post('/viewDatabase', dataget, function(response){
			
			$("#field_selectprop_other").empty();
			
			if (response == null){
				
				console.log("Response was null!");
					
			}else{
			
				for (var key in response.data[0]){
				
					if (key != "_id"){
					
						$("#field_selectprop_other").append("<option>" + key + "</option>");
					
					}
				
				}
				
			}
			
		});
		
	});
	
}

function getOtherDatasets(cb){
	
	$.get('/user-databases', function(response){
		
		response.forEach(function(entry){
			
			
			if (entry.name != getURLVariable("db")) {

				$("#field_selectdb_other").append("<option>" + entry.name + "</option>");
			
			}
			
		});
		
		cb();
		
	});
	
}

/*function createRelationButtons(lookfor, relateto, relatedb){
	
	$("#relationModal").modal('hide');
	var lookfor = $("#field_selectprop_self").val();
	var relateto = $("#field_selectprop_other").val();
	var relatedb = $("#field_selectdb_other").val();
	
	
	
	$.each(datamatrix[0], function(index, value){
		
		if (value == lookfor){
			
			for (var i = 1; i < datamatrix.length - 1; i++){
				
				var dropdown = $("<div class='dropdown'></div>");
				var caret = $("<span class='caret'></span>");
				var btn_dropdown = $("<button class='btn btn-default btn-sm dropdown-toggle btn-regiondata' type='button' data-toggle='dropdown'></button>");
				var menu_dropdown = $("<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'></ul>");
				var list_dropdown = $("<li></li>");
				var entry_dropdown = $("<a role='menuitem' tabindex = '-1' href ='#'>" + relatedb + ": " + relateto + "</a>");
				
				entry_dropdown.attr("onclick", "getRelatedData('" + relatedb + "', '" + relateto + "', '" + $("#input_" + i + "_" + index).val() +  "')");
				
				btn_dropdown.append("Relations  ");
				btn_dropdown.append(caret);
				
				list_dropdown.append(entry_dropdown);
				menu_dropdown.append(list_dropdown);
				
				dropdown.append(btn_dropdown);
				dropdown.append(menu_dropdown);
				
				dropdown.css("margin-top", "10px");
				
				$("#input_" + i + "_" + index).after(dropdown);
				
			}
			
		}
		
	});
	
	var newrelation = {
		
		database: getURLVariable('db'),
		attribute: lookfor,
		relateddb: relatedb,
		relateto: relateto
		
	}
	
	console.log(newrelation);
	
	$.post('/add-relation', newrelation, function(response){
		
		console.log(response);
		
	});
	
}*/

function addRelation(){

	var newrelation = {
		
		database: getURLVariable('db'),
		attribute: $("#field_selectprop_self").val(),
		relateddb: $("#field_selectdb_other").val(),
		relateto: $("#field_selectprop_other").val()
		
	}
	
	$.post('/add-relation', newrelation, function(response){
		
		console.log(response);
		
		refreshRelations(function(){
		
			renderRelations();
		
		});
		
	});
	
}

function getRelatedData(db, field, lookfor){
	
	console.log("I enter getRelatedData!");
	console.log("db: " + db);
	console.log("field: " + field);
	console.log("lookfor: " + lookfor);
	
	$.get('/whoami', function(username){
		
		var dataget = {
			
			db: db,
			user: username,
			limit: 50
			
		}
		
		$.post('/viewDatabase', dataget, function(response){
			
			console.log("Got a response!");
			console.log(response);
			var founddata = "";
			
			if (response == null){
				
				console.log("Response was null!");
					
			}else{
				
				for (var i = 0; i < response.data.length; i++){
					
					if (response.data[i][field] == lookfor){
						
						console.log("Found a match!");
						console.log(response.data[i]);
						
						founddata += JSON.stringify(response.data[i]) + "\n";
						
					}else{
						
						console.log("Failed to find a match!");
						
					}
					
				}
				
				$("#datarelationModal").modal("show");
				$("#txt_relateddata").text(founddata);
				
			}
			
		});
		
	});
	
}

function refreshRelations(cb){
	
	console.log("I enter refreshRelations()");
	
	var refreshobject = {
		
		database: getURLVariable('db')
		
	}
	
	$.post('/get-relations', refreshobject, function(response){
		
		relations = response;
		
		console.log("Relations -->");
		console.log(relations);
		
		cb();
		
	});
	
}

function renderRelations(){
	
	$(".dropdown").remove();
	
	for (var i = 0; i < relations.length; i++){
		
		targetattribute = relations[i].attribute;
		
		$.each(datamatrix[0], function(index, value){
			
			if (value == targetattribute){
				
				console.log("index is now " + index);
				
				for (var j = 1; j < datamatrix.length - 1; j++){
					
					var dropdown = $("<div class='dropdown'></div>");
					var caret = $("<span class='caret'></span>");
					var btn_dropdown = $("<button class='btn btn-default btn-sm dropdown-toggle btn-regiondata' type='button' data-toggle='dropdown'></button>");
					var menu_dropdown = $("<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'></ul>");
					var list_dropdown = $("<li></li>");
					
					btn_dropdown.append("Relations  ");
					btn_dropdown.append(caret);
					
					for (var n = 0; n < relations[i].relations.length; n++){
						
						var entry_dropdown = $("<a role='menuitem' tabindex = '-1' href ='#'>" + relations[i].relations[n].relateddb + ": " + relations[i].relations[n].relatedattr + "</a>");
						entry_dropdown.attr("onclick", "getRelatedData('" + relations[i].relations[n].relateddb + "', '" + relations[i].relations[n].relatedattr + "', $('#input_" + j + "_" + index + "').val())");
						
						list_dropdown.append(entry_dropdown);
						
					}
					
					menu_dropdown.append(list_dropdown);
					
					dropdown.append(btn_dropdown);
					dropdown.append(menu_dropdown);
					
					dropdown.css("margin-top", "10px");
					
					$("#input_" + j + "_" + index).after(dropdown);
					
				}
				
			}
			
		})
		
	}
	
	/*$.each(datamatrix[0], function(index, value){
		
		if (value == lookfor){
			
			for (var i = 1; i < datamatrix.length - 1; i++){
				
				var dropdown = $("<div class='dropdown'></div>");
				var caret = $("<span class='caret'></span>");
				var btn_dropdown = $("<button class='btn btn-default btn-sm dropdown-toggle btn-regiondata' type='button' data-toggle='dropdown'></button>");
				var menu_dropdown = $("<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'></ul>");
				var list_dropdown = $("<li></li>");
				var entry_dropdown = $("<a role='menuitem' tabindex = '-1' href ='#'>" + relatedb + ": " + relateto + "</a>");
				
				entry_dropdown.attr("onclick", "getRelatedData('" + relatedb + "', '" + relateto + "', '" + $("#input_" + i + "_" + index).val() +  "')");
				
				btn_dropdown.append("Relations  ");
				btn_dropdown.append(caret);
				
				list_dropdown.append(entry_dropdown);
				menu_dropdown.append(list_dropdown);
				
				dropdown.append(btn_dropdown);
				dropdown.append(menu_dropdown);
				
				dropdown.css("margin-top", "10px");
				
				$("#input_" + i + "_" + index).after(dropdown);
				
			}
			
		}
		
	});
	*/
}

function modCell(row, col){
	
	datamatrix[row][col] = $("#input_" + row + "_" + col).val();
	
	if (datamatrix[0][col] == ""){
		
		$("#input_" + 0 + "_" + col).attr("placeholder", "What's this?");
		
		for (var i = 1; i < datamatrix.length; i++){
			
			$("#input_" + i + "_" + col).parent().css("background-color", "#FFEADB");
		}
		
	}
	
}

function addCol(){
	
	for (var n = 0; n < datamatrix.length; n++){
		
		datamatrix[n].push("");
		
	}
	
	$("#datatable tbody").remove();
	
	renderTable();
	
}

function addRow(){
	
	var addarray = [];
	
	for (var m = 0; m < datamatrix[0].length; m++){
		
		addarray.push("");
		
	}
	
	datamatrix.push(addarray);
	
	$("#datatable tbody").remove();
	renderTable();
	
}

function removeRow(ind){
	
	datamatrix.splice(ind, 1);
	$("#datatable tbody").remove();
	renderTable();
	
}

function removeCol(ind){
	
	for (var h = 0; h < datamatrix.length; h++){
		
		datamatrix[h].splice(ind, 1);
		
	}
	
	$("#datatable tbody").remove();
	renderTable();
	
}

function saveData(ind){
	
	var dataToSend = {
		
		name: "",
		filename: "",
		size: "",
		data: []
			
	}
	
	if ($("#field_dataname").val() == ""){
		
		$("#field_dataname").attr("placeholder", "A name is required to save!");
		$("#field_dataname").css("background-color", "#e6f8f6");
		$("#field_dataname").css("border-color", "#0dc2a5");
		
	}else{
	
		dataToSend.name = $("#field_dataname").val();
		dataToSend.filename = convertToValidFilename($("#field_dataname").val());
		console.log(dataToSend.name);
		
		
		for (var i = 1; i < datamatrix.length-1; i++){
			
			var newEntry = {};
			
			for (var j = 1; j < datamatrix[0].length - 1; j++){
				
				newEntry[datamatrix[0][j]] = datamatrix[i][j];
				
			}
			
			dataToSend.data.push(newEntry);
				
		}
		
		var stringObject = JSON.stringify(dataToSend.data);
		
		dataToSend.size = bytesToSize(stringObject.length*8);
		
		$.post("/create-database", dataToSend, function(response){
			
			console.log(response);
			$("#my_data").append("<div class='alert alert-success' role='alert'>Save successful! You can <a href='/main'>go back to the home screen</a> or continue editing.</div>");
			
		});
	}
		
}

function bytesToSize(bytes) {
	
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
   
};

function convertToValidFilename(name){
	
	return name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_');
	
}

/*for (var i = 0; i < datamatrix.length; i++){
		
		var newrow = $("<tr></tr>");
		
		for (var j = 0; j < datamatrix[i].length; j++){
			
			var newcol = $("<td></td>");
				
			if (j > 0){
				
				if (j == datamatrix[i].length - 1){
					
					var btn_addrow = $("<button type='button'>+</button>");
					newcol.append(btn_addrow);
					
				}else{
			
					var text_newcol = $("<input type='text'>");
					
					text_newcol.val(datamatrix[i][j]);
					
					text_newcol.change(function(){
						
						console.log("This is the datamatrix: " + datamatrix);
						console.log("This is i: " + i);
						console.log("This is j: " + j);
						console.log(datamatrix[i-1][j-1]);
						console.log(text_newcol.val());
						
						datamatrix[i-1][j-1] = text_newcol.val();
						
						console.log("This is now the datamatrix: " + datamatrix);
						
					});
					
					newcol.append(text_newcol);
				
				}
			
				if (i == 0 && j != datamatrix[i].length - 1){
					
					if (datamatrix[0].length > 2){
						
						var btn_newcol = $("<button type='button'>x</button>");
						
						btn_newcol.attr("onclick", "removeCol(" + j + ")");
					
						newcol.append(btn_newcol);
						
					}
					
					newcol.css("background-color", "blue");
				
				}
			}else{
				
				if (i > 0){
					
					var btn_delrow = $("<button type='button'>x</button>");
					btn_delrow.attr("onclick", "removeRow(" + i + ")");
					
					newcol.append(btn_delrow);
				}
				
			}
			
			newrow.append(newcol);
			
		}
		
		$("#datatable").append(newrow);
		
	}*/