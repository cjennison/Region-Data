/*Related to settings.ejs.*/

window.onload = function(){
	
	$.get('/whoami', function(username){
		
		var dataget = {
			
			db: getURLVariable("db"),
			user: username,
			limit: 10
			
		}
		
		$.post('/viewDatabase', dataget, function(response){
			
			$("#field_name").val(response.summary.name);
			$("#field_subject").val(response.summary.subject);
			$("#field_description").val(response.summary.description);
			$("#field_size").text(response.summary.size);
			
		});
		
	});
	
}

$('.btn-toggle').click(function() {
    $(this).find('.btn').toggleClass('active');  
    
    if ($(this).find('.btn-primary').size()>0) {
    	$(this).find('.btn').toggleClass('btn-primary');
    }
    
    $(this).find('.btn').toggleClass('btn-default');
       
});
