$(document).ready(function() {

  $(document).on('click', '.edit-window .edit-window-close', function() {
    $(this).closest('.edit-window').removeClass('show');
  });

  $(document).on('click', '.crud-row-edit', function() {
    $('.edit-window').addClass('show');
    $('#editor_holder').empty();
    var editor = new JSONEditor(document.getElementById('editor_holder'), {
      theme: 'bootstrap3',
      disable_edit_json: true,
      disable_collapse: true,
      disable_properties: true,
      schema: {
        type: "object",
        title: "Car",
        properties: {
          make: {
            type: "string",
            enum: [
              "Toyota",
              "BMW",
              "Honda",
              "Ford",
              "Chevy",
              "VW"
            ]
          },
          model: {
            type: "string"
          },
          year: {
            type: "integer",
            enum: [
              1995, 1996, 1997, 1998, 1999,
              2000, 2001, 2002, 2003, 2004,
              2005, 2006, 2007, 2008, 2009,
              2010, 2011, 2012, 2013, 2014
            ],
            default: 2008
          }
        }
      }
    });
    $.material.init();
  });

  $(document).on('click', '.crud-row-inspect', function() {
    $('.edit-window').addClass('show');
  });

  $(document).on('click', '.crud-add', function() {
    $('.edit-window').addClass('show');
  });

  $(document).on('change', '.crud-table-row-checkbox', function() {
    checkDelete();
  });

  $(document).on('change', '.crud-table-head-checkbox', function() {
    var table = $(this).closest('.crud-table');
    var checkboxes = table.find('.crud-table-row-checkbox');
    checkboxes.each(function() {
      $(this).prop('checked', !$(this).prop('checked'));
    });
    checkDelete();
  });

  function checkDelete() {
    var checkedBoxes = $('.crud-table-row-checkbox:checked');
    if (checkedBoxes.length > 0) {
      $('.crud-delete-multi').removeClass('slide-hide');
    } else {
      $('.crud-delete-multi').addClass('slide-hide');
    }
  }

  /*
      Delete functions
   */
  $(document).on('click', '.crud-row-delete', function() {
    var row = $(this).parent().parent();
    var id = row.find('.crud-id').text();

    bootbox.confirm('Are your sure you want to delete this record?', function(result) {
      if (result) {
        $.snackbar({
          content: 'Deleted record with ID: ' + id + '.'
        });
        //ajax call
      }
    });
  });

  $(document).on('click', '.crud-delete-multi', function() {
    var checkedBoxes = $('.crud-table-row-checkbox:checked');
    var ids = [];

    //id's get checked if they are a number, other db's like mongo might use ObjectID?!
    checkedBoxes.each(function() {
      var id = parseInt($(this).closest('tr').find('.crud-id').text());
      if (!isNaN(id)) {
        ids.push(id);
      }
    });

    bootbox.confirm('Are you sure you want to delete ' + ids.length + ' records?', function(result) {
      if (result) {
        $.snackbar({
          content: 'Deleted ' + ids.length + ' records.'
        });
        //ajax call
      }
    });

  });



});
