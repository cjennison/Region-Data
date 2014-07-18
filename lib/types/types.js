
function DataInteger(opts, val){
	this.val = val;
	//A list of notes if the variable had to be changed
	var changenotes = "";
	
	//Integer has a maximum value
	var min = opts.min ? opts.min : null;
	if(min){
		if(this.val < min){
			this.val = min;
			changenotes += "[MIN] Changed val[" + val + "] to min[" + min + "]";
		}
	}
	//Integer has a maximum value
	var max = opts.max ? opts.max : null;
	if(max){
		if(this.val > max){
			this.val = max;
			changenotes += "[MAX] Changed val[" + val + "] to max[" + min + "]";
		}
	}
	//Integer has x floating points
	var floating_points = opts.floating_point ? opts.floating_point : null;
	if(floating_points){
		var val_with_float = truncateDecimal(this.val, floating_points)
		if(this.val != val_with_float){
			this.val = val_with_float;
			changenotes += "[FLOAT] Changed val[" + val + "] to float[" + min + "]";
		}
	}
	
	
	console.log(val);
	console.log(changenotes);
	
	
}

function DataString(opts, val){
	this.val = val;
	//A list of notes if the variable had to be changed
	var changenotes = "";
	
	var lowercase = opts.lowercase ? opts.lowercase : null;
	if(lowercase){
		this.val = this.val.toLowerCase();
		changenotes += "[Lowercase] Changed to lowercase -"
	}
	
	var uppercase = opts.uppercase ? opts.uppercase : null;
	if(uppercase){
		this.val = this.val.toUpperCase();
		changenotes += "[Lowercase] Changed to lowercase -"
	}
	
	
	
	
	function getval(){
		return val;
	}
}


//Utilities

/**
 * Truncates a decimal value by digits 
 * @param {Object} val
 * @param {Object} digits
 */
function truncateDecimal(val, digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = val.toString().match(re);
    return m ? parseFloat(m[1]) : val.valueOf();
};


exports.DataInteger = DataInteger;
exports.DataString  = DataString;