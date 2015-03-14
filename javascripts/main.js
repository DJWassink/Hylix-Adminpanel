$(document).ready(function() {
	$('aside').metisMenu();
	$.material.ripples(".nav a");
	$('.nano').nanoScroller();

    $('#page-content').load('pages/dashboard.html', function() {
		$.material.init();
	});


	$('.sidebar-nav a').on('click', function(e) {
	    e.preventDefault();
	    var link = this;

	    var re = /.*\.html/;
	    if ($(this).attr('href').match(re)) {
	        $('#page-content').load($(this).attr('href'), function() {
	        	$('.sidebar-nav a').removeClass('active');
	        	$(link).addClass('active');
	    		$.material.init();
	    	});
	    }
	});

});