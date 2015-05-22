$(document).on('click', '.slide', function() {
  $('.slide').removeClass('wide');
  $(this).addClass('wide');
  calculateSlideWidth();
});

function calculateSlideWidth() {
  $('.slide').css('width', '');

  var notWideSlides = $('.slide').not('.wide');
  $(notWideSlides).css('width', (20 / notWideSlides.length) + '%');
}