$("#btn_addcol").attr("onclick", "addCol()");
$("#btn_addrow").attr("onclick", "addRow()");

var datamatrix = [];

datamatrix.push(["", ""]);

window.onload = function(){
	renderTable();
};

function renderTable(){
	
	console.log("Trying to render table!");
	console.log(datamatrix);
	
	for (var i = 0; i < datamatrix.length; i++){
		
		var newrow = $("<tr></tr>");
		
		for (var j = 0; j < datamatrix[i].length; j++){
			
			var newcol = $("<td></td>");
				
			if (j > 0){
			
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
			
				if (i == 0){
					
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
	
	console.log("Trying to remove col " + ind);
	
	for (var h = 0; h < datamatrix.length; h++){
		
		datamatrix[h].splice(ind, 1);
		
	}
	
	$("#datatable tbody").remove();
	renderTable();
	
}