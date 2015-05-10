$(document).ready(function() {
  $('aside').metisMenu();
  $.material.ripples(".nav a");
  $('.nano').nanoScroller();

  $('#page-content').load('pages/dashboard.html', function(response, status, xhr) {
    if (xhr.status === 200) {
      $.material.init();
    } else {
      $('#page-loader').attr('aria-busy', 'false');
      $.snackbar({content: 'Error loading page!'});
    }
  });


  $('.sidebar-nav a').on('click', function(e) {
    e.preventDefault();
    var $link = $(this);
    if ($link.hasClass('active'))
      return;

    var re = /.*\.html/;
    if ($link.attr('href').match(re)) {
      $('#page-loader').attr('aria-busy', 'true');
      $('#page-content').fadeOut('fast', function() {
        $('#page-content').load($link.attr('href'), function(response, status, xhr) {
          if (xhr.status === 200) {
            $('.sidebar-nav a').removeClass('active');
            $link.addClass('active');
            $.material.init();
            $('#page-loader').attr('aria-busy', 'false');
          } else {
            $('#page-loader').attr('aria-busy', 'false');
            $.snackbar({content: 'Error loading page!'});
          }
          $('#page-content').show().focus();
        });
      });
    }
  });

});
