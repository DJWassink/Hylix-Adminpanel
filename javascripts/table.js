$(document).ready(function() {

    /**
     * close the table-rows on document click
     */
    $(document).on('click', '*:not(.expand-table-row)', function(e) {
        e.stopPropagation();
        $('.expand-table-row').removeClass('wide');
    });

    /**
     * open the table-rows on row click
     */
    $(document).on('click', '.expand-table-row', function(e) {
        e.stopPropagation();
        $('.expand-table-row').removeClass('wide');
        $(this).addClass('wide');
    });

    $(document).on('click', '.expand-table-row *', function(e) {
        e.stopPropagation();
        $('.expand-table-row').removeClass('wide');
        $(this).parents('.expand-table-row').addClass('wide');
    });
});