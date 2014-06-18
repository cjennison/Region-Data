/*function createPost(title, content){
	
	var date = new Date();
	var date = date.getMonth() + 1 + "." + date.getDate() + "." + date.getFullYear();
	$("#section_updates").append("<p style='opacity:0.4'>[" + date + "]</p>");
	//$("#section_updates").append("<br>");
	$("#section_updates").append("<p style='font-size:25pt'>" + title + "</p>");
	$("#section_updates").append(content);
	$("#section_updates").append("<hr style='opacity:0.4'>");
	console.log("Tried to append post!");
}

/*var d = $.get("/ret-test", function(d){
	console.log(d);
})*/

/*var m = $.post("/add-new-user", function(data, status){
	console.log(status);
})

/*$("#button_login").attr("onclick", "insertUser"){
	var m = $.post("/insert-user", function(data, status){
	console.log(data);
	console.log(status);
})

*}*/

$("#row_register").hide();
$("#divider_register").hide();

$("#button_register").attr("onclick", "showRegistration()");
$("#button_registerfinish").attr("onclick", "register()");
$("#button_login").attr("onclick", "login()");
$("#button_explore").attr("onclick", "window.location.href = '/explore'");

$("#field_username").keyup(function(event){
	if (event.keyCode == 13){
		$("#button_login").click();
	}
});

$("#field_password").keyup(function(event){
	if (event.keyCode == 13){
		$("#button_login").click();
	}
});

function showRegistration(){
	
	$("#alert").remove();
	$("#divider_register").show();
	$("#row_register").slideDown();
	$("#button_register").text("Nevermind");
	$("#button_register").attr("onclick", "hideRegistration()");
	
}

function hideRegistration(){
		
		$("#divider_register").hide();
		$("#row_register").slideUp();
		$("#button_register").text("Register");
		$("#button_register").attr("onclick", "showRegistration()");
		
}

function appendError(text){
	
	$("#alert").remove();
	$("#button_register").before("<div id='alert' style='margin-top:10px; display:none;' class='alert alert-danger'>" + text + "</div>");
	$("#alert").fadeOut(100).fadeIn(100);
}

function register(){
	
	var registerInfo = {
		
		username: $("#field_registerusername").val(),
		email: $("#field_registeremail").val(),
		password: $("#field_registerpassword").val()
		
	}
	
	console.log(registerInfo);
	
	$.post('/register-user', registerInfo, function(response){
		console.log(response);
		
		var loginInfo = {
			username: response.data.username,
			password: response.data.password
		}
		
		
		$.post('/login-user', loginInfo, function(response){
			
			if (response == "Login failed!"){
				
				appendError("Incorrect username or password.");
				
			}else{
				
				localStorage.setItem("username", response.username);
				localStorage.setItem("email", response.email);
				
				window.location.href = 'main';
				
				
			}
			
		});
	});
	
	hideRegistration();
	
}

function login(){
		
	if ($("#field_username").val() == "" || $("#field_password").val() == ""){
		
		appendError("Please enter both a username and a password.");
		
	}else{
	
		var loginInfo = {
			
			username: $("#field_username").val(),
			password: $("#field_password").val()
			
		}
		
		$.post('/login-user', loginInfo, function(response){
			
			if (response == "Login failed!"){
				
				appendError("Incorrect username or password.");
				
			}else{
				
				localStorage.setItem("username", response.username);
				localStorage.setItem("email", response.email);
				
				//console.log(localStorage.getItem("username"));
				//console.log(localStorage.getItem("email"));
				
				window.location.href = 'main';
				//console.log(response);
				
			}
			
		});
		
	}
	
}
