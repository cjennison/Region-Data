var db = "";
var dragsenterred = 0;
var dragsexited = 0;
var schemaconf = [];
var colors = [];
var filledout = false;
var options = ["Integer", "String/Word", "Boolean"];

var fullschema = {
	
	title: "",
	schema: []
	
}

$("#tab_public").click(function(){
	
	window.location.href = "schema?view=public" + db;
	
});

$("#tab_mine").click(function(){
	
	window.location.href = "schema?view=mine" + db;
	
});

$("#btn_createschema").click(function(){
	
	window.location.href = "schema?view=edit&schema=new" + db;
	
});

$("#btn_addattr").attr("onclick", "addBlankSchema()");

$("#btn_openall").attr("onclick", "toggleAll('open')");
$("#btn_closeall").attr("onclick", "toggleAll('close')");

$(document).ready(function(){
	
	$(".select-type").bind('change', function(){
		
		var options_attr = $(this).parent().parent().next();
		options_attr.find(".options").hide();
		
		if ($(this).val() == "Integer"){
			
			options_attr.find(".options-integer").show();
			
		}else if ($(this).val() == "String/Word"){
			
			options_attr.find(".options-string").show();
			
		}else if ($(this).val() == "Boolean"){
			
			options_attr.find(".options-boolean").show();
			
		}
		
	});
	
	$(".select-type").trigger('change');
	
});

$("#btn_conformdataset").attr("onclick", "conformDataset()");

$(".listitem_params").hover(
	
	function(){
	
	},
	
	function(){
		
		
	}
	
	
);

function renderSchemaConf(){
	
	$(".listitem_params").css("background-color", "white");
	
	$("#btn_conformdataset").prop("disabled", false);
	
	for (var i = 0; i < schemaconf.length; i++){
		
		if (schemaconf[i][1] == null){
			
			$("#btn_conformdataset").prop("disabled", true);
			
		}
		
		$(".listitem_params").each(function(index){
			
			if ($(this).text() == schemaconf[i][1]){
				
				$(this).css("background-color", colors[i]);
				
			}
			
		});
		
		$(".field-schema").each(function(index){
			
			if ($(this).val() == schemaconf[i][1]){
				
				$(this).css("background-color", colors[i]);
				
			}
			
		})
		
	}
	
}

function addBlankSchema(){
	
	console.log("ADDING NEW BLANK SCHEMA");
	
	var newschema = {
		
		typeformal: "Integer",
		specs : {
			
			floating_point:0
			
		},
		name: null,
		open: false
		
	};
	
	fullschema.schema.push(newschema);
	
	renderSchemaEdit();
}

function deleteSchema(index){
	
	console.log("DELETING SCHEMA AT " + index);
	
	fullschema.schema.splice(index, 1);
	renderSchemaEdit();
	
	
}

function renderSchemaEdit(){
	
	$("#params_schema").empty();
	
	for (mapping in fullschema.schema){
		
		var panel = $("<div class='panel panel-default' id='panel_var_" + mapping + "'></div>");
		var panelbody = $("<div class='panel-body panel-regiondata'></div>");
		var col1 = $("<div class='col-sm-1 col-regiondata'></div>");
		var col8 = $("<div class='col-sm-8 col-regiondata'></div>");
		var col2 = $("<div class='col-sm-2 col-regiondata'></div>");
		var col1b = $("<div class='col-sm-1 col-regiondata col-expansion'></div>");
		var paramname = $("<input type='text' class='form-control' placeholder='Variable Name'>")
		var selection = $("<select class='form-control select-type'>");
		var deletionbutton = $("<button type='button' class='btn btn-default btn-sm delete'><span class='glyphicon glyphicon-remove'></span></button>")
		var expansionbutton = $("<button type='button' class='btn btn-default btn-sm chevron'>");
		var chevron = $("<span class='glyphicon glyphicon-chevron-down chevron-icon'></span>");
		var hiddendiv = $("<div class='opts-schemavar' hidden></div>");
		var horizontalruler = $("<hr class='hr-regiondata'>");
		var optionsinteger = $("<div class='options options-integer'></div>");
		var optionsstring = $("<div class='options options-string'></div>");
		var optionsboolean = $("<div class='options options-boolean'>BOOLEAN</div>");
		
		//Integer Form
		
		var integer_form_horz = $("<form class='form-horizontal' role='form'></form>");
		var integer_form_group = $("<div class='form-group'></div>");
		var integer_label = $("<label class='col-sm-4 control-label'>Num. of Floating Points</label>");
		var integer_textbox = $("<div class='col-sm-8'><input class='form-control' placeholder='enter here'></div>")
		
		integer_form_group.append(integer_label);
		integer_form_group.append(integer_textbox);
		integer_form_horz.append(integer_form_group);
		optionsinteger.append(integer_form_horz);
		
		//String Form
		
		var string_form_horz = $("<form class='form-horizontal' role='form'></form>");
		var string_form_group = $("<div class='form-group'></div>");
		var string_label = $("<label class='col-sm-4 control-label'>Lowercase</label>");
		var string_col8 = $("<div class='col-sm-8'></div>")
		var string_selection = $("<select class='form-control select-type'></select>");
		var string_opt_yes = $("<option>Yes</option>");
		var string_opt_no = $("<option>No</option>");
		
		string_selection.append(string_opt_yes);
		string_selection.append(string_opt_no);
		string_form_horz.append(string_form_group);
		string_form_group.append(string_label);
		string_form_group.append(string_col8);
		string_col8.append(string_selection);
		optionsstring.append(string_form_horz);
		
		//Boolean Form
		
		hiddendiv.append(horizontalruler);
		hiddendiv.append(optionsinteger);
		hiddendiv.append(optionsstring);
		hiddendiv.append(optionsboolean);
		
		expansionbutton.append(chevron);
		
		col1b.append(expansionbutton);
		
		col1.append(deletionbutton);
		
		deletionbutton.attr("onclick", "deleteSchema(" + mapping + ")");
		
		for (option in options){
			
			selection.append("<option>" + options[option] + "</option>");
			
		}
		
		col2.append(selection);
		
		col8.append(paramname);
		
		panelbody.append(col1);
		panelbody.append(col8);
		panelbody.append(col2);
		panelbody.append(col1b);
		
		panel.append(panelbody);
		panel.append(hiddendiv);
		
		if (fullschema.schema[mapping]["open"] == true){
			
			hiddendiv.show();
			chevron.removeClass("glyphicon-chevron-down");
			chevron.addClass("glyphicon-chevron-up");
			
		}
		
		selection.attr("onchange", "changeOptions(" + mapping + ")");
		paramname.attr("onchange", "setSchemaName('name', " + mapping + ")"); 
		
		paramname.val(fullschema.schema[mapping]["name"]);
		selection.val(fullschema.schema[mapping]["typeformal"]);
		
		expansionbutton.attr("onclick", "toggleOptionsVisible(" + mapping + ")");
		
		$("#params_schema").append(panel);
		
		selection.trigger("change");
		
	}
	
}

function toggleOptionsVisible(index){
	
	console.log("TRYING TO TOGGLE OPTIONS FOR:");
	console.log(index);
	
	var targetpanel = $("#panel_var_" + index);
	var expandbutton = targetpanel.find(".panel-body").find(".col-expansion").find(".btn");
	var icon_chevron = expandbutton.find(".chevron-icon");
	var section_opts = targetpanel.find(".panel-body").next();
	
	if (icon_chevron.hasClass("glyphicon-chevron-up")){
		
		icon_chevron.removeClass("glyphicon-chevron-up");
		icon_chevron.addClass("glyphicon-chevron-down");
		section_opts.slideUp();
		fullschema.schema[index]["open"] = false;
		
	}else if (icon_chevron.hasClass("glyphicon-chevron-down")){
		
		icon_chevron.removeClass("glyphicon-chevron-down");
		icon_chevron.addClass("glyphicon-chevron-up");
		section_opts.slideDown();
		fullschema.schema[index]["open"] = true;
		
	}
	
}

function changeOptions(index){
	
	
	var targetpanel = $("#panel_var_" + index);
	var select_opts = targetpanel.find(".panel-body").find(".col-sm-2").find("select");
	var section_opts = targetpanel.find(".opts-schemavar");
	var selectval = select_opts.val()
	
	
	section_opts.find(".options").hide();
	
	if (selectval == "Integer"){
		section_opts.find(".options-integer").show();
	}else if (selectval == "String/Word"){
		section_opts.find(".options-string").show();
	}else if (selectval == "Boolean"){
		section_opts.find(".options-boolean").show();
	}
	
	setSchemaType(selectval, index);
	
}

function setSchemaName(name, index){
	
	var targetpanel = $("#panel_var_" + index);
	var nameparam = targetpanel.find(".panel-body").find(".col-sm-8").find(".form-control");

	fullschema.schema[index][name] = nameparam.val();
	
	console.log("Updated Object: ");
	console.log(fullschema);
	
}

function setSchemaType(name, index){
	
	fullschema.schema[index]["typeformal"] = name;
	console.log("Updated Object (setSchemaType): ");
	console.log(fullschema);
	
}

function toggleAll(how){
	
	console.log("I enter " + how + " all!");
	
	if (how == "open"){
		
		for (schematic in fullschema.schema){
			
			console.log(fullschema.schema[schematic]);
			
			fullschema.schema[schematic].open = true;
			
		}
		
	}else if (how == "close"){
		
		for (schematic in fullschema.schema){
			
			console.log(fullschema.schema[schematic]);
			
			fullschema.schema[schematic].open = false;
			
		}
		
	}
	
	renderSchemaEdit();
	
}

function conformDataset(){
	
	var conformobject = {
		
		schema: getURLVariable("schema"),
		db: getURLVariable("db"),
		transform: [],
		config: {
			
			new_name: $("#input_newname").val()
			
		}
		
	}
	
	$(".form-horizontal").each(function(i, obj){
		
		conformobject.transform.push({
			
			native: $(this).find("input").val(),
			map: $(this).find("label").text()
			
		});
		
	});
	
	$.post("/createNewFromSchema", conformobject, function(response){
		
		console.log("SCHEMA RESPONSE: ");
		console.log(response);
		
		
	});
	
}

function drag(ev){
	
	ev.dataTransfer.setData("attr", $(ev.target).text());
	
}

function allowDrop(ev){
	
	ev.preventDefault();
	
}

function dragEnter(ev){
	
	ev.preventDefault();
	
	var div_target = $(ev.target);
	
	while (!($(div_target).hasClass("list-group-item"))){
		
		div_target = $(div_target).parent();
		
	}
	
}

function cancelDrop(ev){
	
	ev.preventDefault();
	
}

function drop(ev){
	
	ev.preventDefault();
	
	var data = ev.dataTransfer.getData("attr");
	var div_target = $(ev.target);
	
	while (!($(div_target).hasClass("list-group-item"))){
		
		div_target = $(div_target).parent();
		
	}
	
	var labeltext = div_target.find(".form-horizontal").find(".form-group").find(".control-label").text();
	div_target.find(".form-horizontal").find(".form-group").find(".form-control").val(data);
	
	for (var i = 0; i < schemaconf.length; i++){
		
		if (schemaconf[i][0] == labeltext){

			schemaconf[i][1] = data;
			break;
			
		}
		
	}
	
	renderSchemaConf();
	
}

window.onload = function(){
	
	if (getURLVariable("db") != false){
		
		db = "&db=" + getURLVariable("db");
		
	}
	
	if (getURLVariable("view") == "edit"){
		
		$("#sec_navschema").hide();
		$("#sec_createschema").show();
		
		if (getURLVariable("schema") == "new"){
			
			$("#text_schemaname").text("New");
			
		}else{
			
			renderSchemaEdit();
			
		}
		
		
	}else if(getURLVariable("view") == "conform"){
		
		$("#sec_navschema").hide();
		$("#sec_conformschema").show();
		
		$("#input_newname").val(getURLVariable("db") + "_" + getURLVariable("schema"));
		
		
		$.post("/getSingleSchema", {title: getURLVariable("schema")}, function(response){
			
			$.each(response.schema, function(index, value){
				
				var listgrouprow = $("<li class='list-group-item listitem_schemaparams' ondrop='drop(event)' ondragover='allowDrop(event)' ondragenter='dragEnter(event)' ondragleave='dragLeave(event)'></li>");
				
				var form_horz = $("<form class='form-horizontal' role='form'></form>");
				var formgroup = $("<div class='form-group'></div>");
				var label = $("<label class='col-sm-3 control-label'>" + value.name + "</label>");
				var formcontrol = $("<div class='col-sm-7'><input class='form-control field-schema'  ></div>");
				
				formgroup.append(label)
				formgroup.append(formcontrol);
				form_horz.append(formgroup);
				listgrouprow.append(form_horz);
				
				$("#list_schemaparams").append(listgrouprow);
				
				schemaconf.push([value.name, null]);
				//colors.push("#" + Math.floor(Math.random()*16777215).toString(16));
				colors.push('rgba(' + (Math.floor((100)*Math.random()) + 100) + ',' + 
                                    (Math.floor((100)*Math.random()) + 100) + ',' + 
                                    (Math.floor((100)*Math.random()) + 100) + ',0.5)');
			})
			
		});
		
		$.post("/showdatabase", {db: getURLVariable("db"), limit: 5}, function(response){
			
			for (var key in response[0]){
				
				if (key != "_id"){
					
					$("#list_dbparams").append("<li class='list-group-item listitem_params' draggable='true' ondragstart='drag(event)'>" + key + "</li>");
					
				}
				
			}
			
		});
		
	}else{
	
		$("#btn_" + getURLVariable("view")).addClass("active");
	
	}
	
	$.get('/allSchemas', function(response){
		
		$.each(response, function(index, value){
			
			var newrow = $("<tr class='row_schema'></tr>");
			newrow.append("<td>" + value.title + "</td>");
			
			$("#list_schemas").append(newrow);
			
		});
		
		if (db != "") {

			$("#nav_schemas").before("<p class='text_hdr'>Please select a dataset to conform <strong>" + getURLVariable("db") + "</strong> to, or create a new one.</p>");

			$(".row_schema").click(function(){
				
				window.location.href = "/schema?view=conform&db=" + getURLVariable("db") + "&schema=" + $(this).children(":first").text();
				
			});
			
			$(".row_schema").hover(function(){
				
				$(this).css("background-color", "#dffffa");
				
			},
			
			function(){
				
				$(this).css("background-color", "white");
				
			});

		}

	});
	
}