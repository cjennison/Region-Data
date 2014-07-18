/*window.onload = function() {

	$("#btn_logout").click(function() {

		$.get('/logout', function(response) {

			console.log("I enter logout!");
			location.reload();

		});

	});

	function chickens() {

		console.log("chickens");

	}

}*/

function logOutUser(){
	
	console.log("I enter logoutuser!");
	
	$.get('/logout', function(response) {

		console.log("I enter logout!");
		location.reload();

	});
	
}
