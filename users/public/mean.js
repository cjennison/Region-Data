var model = {
	
	
	name: "MEAN",
	data:null,
	variable:null,
	by:"YEAR",
	
	container:null,
	statusbar:null,
	
	v_data:[],
	results:null,
	
	//Show Dependancies
	init:function(el){
		console.log("Showing Mean");
		console.log(el);
		this.container = $(el).parent();
		
		var html = $("<hr></hr><p>Please choose a variable to take the mean of: <select></select></p>" + 
			"<p>By default, this will take the mean of each year</p>" + 
			"<button class='btn btn-warning runmodel' onclick='model.runModel()'>Run Model</button>" + 
			"<div class='status'><div class='progress progress-striped active'><div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div>" + 
			"</div></div><button class='btn btn-success viewresults' onclick='model.viewResults()' disabled>View Results</button><div class='console'>Console <button class='btn btn-default expandconsole' onclick='model.showConsole()'><span class='glyphicon glyphicon-resize-small'><span></button></div>"
		);
		
		
		
		//$(html).find(".status").append(statusbar);
		
		
		for(var item in variables){
			var opt = $("<option value='" + variables[item] + "'>" + variables[item] + "</option>");
			$(html).find('select').append(opt);
		}
		
		return html;
	},
	
	
	runModel:function(){
		this.variable = $(model.container).find("select").find("option:selected").val();
		
		if(this.variable.length = 0) return;
		$(".runmodel").attr('disabled', 'true')
		
		
		
		
		this.loadData();
		
	},
	
	
	loadData:function(){
		$(model.container).find(".progress-bar").css("width", "10%");
		
		$(model.container).find(".console").append("<p> -- Getting Database</p>")
		
		$.post("/showdatabase", {db:db}, function(d){
			model.data = d;
			
			$(model.container).find(".progress-bar").css("width", "30%");
			$(model.container).find(".console").append("<p> -- Received Database</p>");
			
			model.validateData();
		})
	},
	
	
	validateData:function(){
		$(model.container).find(".console").append("<p> -- Validating Variable as [Number] ..</p>");
		var dat = model.data;
		
		var numErrors = 0;
		
		for(var i = 0;i < dat.length; i++){
			if(typeof(dat[i][model.variable]) != "number"){
				if(dat[i][model.variable] == ""){
					$(model.container).find(".console").append("<p> -- WARNING: Found Empty Entry, Disregarding..</p>");
					numErrors++;
				} else {
					$(model.container).find(".console").append("<p> -- WARNING: " + dat[i][model.variable] + " is not a [Number] ..</p>");
					//$(model.container).find(".console").append("<p> -- TOOLBOX: attempting to parse as [Number] ..</p>");
					numErrors++;
				}
			} else {
				model.v_data.push(dat[i]);
			}
		}
		
		
		if(numErrors == 0){
			$(model.container).find(".console").append("<p> -- Validation Compelte: No Errors</p>");
		} else {
			$(model.container).find(".console").append("<p> -- Validation Compelte: Found: " + numErrors + " Errors.. Running with only validated data</p>");
		}
		
		$(model.container).find(".progress-bar").css("width", "50%");
		
		this.calculate();
		
	},
	
	calculate:function(){
		var dat = model.v_data;
		console.log(model.v_data);
		
		if(dat.length == 0){
			$(model.container).find(".console").append("<p> -- No Validated Data.. Stopping Model</p>");
			$(model.container).find(".progress-bar").removeClass("progress-bar-success");
			$(model.container).find(".progress-bar").addClass("progress-bar-danger");
			return;
		}
		
		var mean = {};
		var lastYear = null;
		var numEntries = 0;
		
		for(var i = 0;i < dat.length;i ++){
			
			
			
			//Calculate the Year
			var item = dat[i];
			var date = new Date(item.Date);
			var year = date.getFullYear();
			
			console.log(year);
			
			//if this year is different, do teh average
			if(year != lastYear){
				console.log("Year changed: " + year)
				if(lastYear != null)
					mean[lastYear] = mean[lastYear]/numEntries;
				
				
				//take the average
				//console.log(mean[lastYear] + "/" + numEntries);
				
				
				
				//reset last year
				lastYear = year;
				
				//Reset the entries and make a new year
				numEntries = 1;
				mean[year] = item[model.variable];
				continue;
			} 
			
			
			//Add the new item and increment entries
			mean[year] += item[model.variable];
			numEntries++;
			
		}
		
		//And close it out
		mean[lastYear] = mean[lastYear]/numEntries;
		
		
		$(model.container).find(".console").append("<p> Model Complete! </p>");
		$(model.container).find(".progress-bar").css("width", "100%");
		
		$(model.container).find('.viewresults').attr('disabled', false);
		
		
		this.results = mean;

		
	},
	
	showConsole:function(){
		if($(model.container).find(".console").hasClass("active")){
			$(model.container).find(".console").removeClass("active")
		} else{
			$(model.container).find(".console").addClass("active");
		}
	},
	
	
	viewResults:function(){
		var res = JSON.stringify(model.results);
		console.log(res);
		console.log("SENDING RESULTS");
		
		$.post("/send-results", {results:res}, function(d){
			document.location.href = "/view-results?model=mean&f=" + d
		})
	}
	
	
	
}
