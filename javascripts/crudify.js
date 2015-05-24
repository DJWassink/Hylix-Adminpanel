(function($) {
  $.fn.crudify = function(options) {
    var $crudContainer = this;

    //set some defaults
    var defaultUrl = 'localhost';
    var defaultName = "crudify-" + Math.floor((Math.random() * 9999999999999));
    var defaults = {
      name: defaultName,
      rootElement: $crudContainer.selector,
      domainUrl: defaultUrl,
      createUrl: defaultUrl + '/' + defaultName,
      listUrl: defaultUrl + '/' + defaultName,
      readUrl: defaultUrl + '/' + defaultName + '/{{id}}',
      deleteUrl: defaultUrl + '/' + defaultName + '/{{id}}',
      updateUrl: defaultUrl + '/' + defaultName + '/{{id}}',
      schema: {
        theme: 'bootstrap3',
        disable_edit_json: true,
        disable_collapse: true,
        disable_properties: true,
        schema: {
          type: "object",
          title: "Car",
          properties: {
          }
        }
      },
      table: ['make', 'model']
    };
    options = $.extend(defaults, options);

    //our table with records
    var $table = $('<table class="table table-striped table-hover crud-table">' +
      '<thead>' +
      '<tr>' +
      '<th>' +
      '<div class="checkbox crud-table-head-checkbox">' +
      '<label>' +
      '<input type="checkbox">' +
      '</label>' +
      '</div>' +
      '</th>' +
      '<th class="crud-id">ID</th>' +
      '<th>Actions</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '</tbody>' +
      '</table>');

    //add the headings for the table
    for (var i = options.table.length - 1; i >= 0; i--) {
      $table.find('th.crud-id').after('<th>' + options.table[i] + '</th>');
    }

    //fetch the records and display them
    $.ajax({
      url: options.listUrl,
      type: 'GET',
      dataType: 'json',
      success: function(result) {
        console.log(result);
        for (var i = 0; i < result.length; i++) {
          var record = result[i];
          var tableRow = '<tr><td><div class="checkbox"><label><input type="checkbox" class="crud-table-row-checkbox"><span class="ripple"></span><span class="check"></span></label></div></td>';
          tableRow += '<td class="crud-id">' + record.id + '</td>';
          for (var j = 0; j < options.table.length; j++) {
            var tableRecord = options.table[j];
            tableRow += '<td>' + record[tableRecord] + '</td>';
          }
          tableRow += '<td><button class="btn btn-icon crud-row-edit"><i class="md md-edit"></i></button><button class="btn btn-icon crud-row-inspect"><i class="md md-search"></i></button><button class="btn btn-icon crud-row-delete"><i class="md md-delete"></i></button></td></tr>';
          $table.find('tbody').append(tableRow);
        }

      },
      error: function(jqXHR, textStatus, errorThrown) {
        $.snackbar({
          content: 'Failed to fetch records: ' + jqXHR.statusText
        });
      }
    });
  
    //add a header and the table
    this.prepend('<h1 class="page-header crud-header-title">' + options.name + '</h1>');
    this.append($table);
    //adds the buttons and the slide-out edit window
    this.append('<button class="crud-add btn btn-fab btn-raised btn-material-teal"><i class="md md-add"></i></button><button class="crud-delete-multi slide-hide btn btn-fab btn-raised btn-material-red"><i class="md md-delete"></i></button>');
    var $editWindow = $('<div id="' + options.name + '-edit-window" class="edit-window shadow-z-2"><button class="edit-window-close btn btn-fab btn-raised btn-material-red"><i class="md md-close"></i></button><div id="editor_holder_' + options.name + '"></div><button id="editor-submit-' + options.name + '" class="btn btn-primary pull-right"><i class="md md-send"></i> Submit</button></div>');
    $(options.rootElement).prepend($editWindow);

    //create the bootstrap3 form with the given schema
    var editor = new JSONEditor(document.getElementById('editor_holder_' + options.name), options.schema);

    /*
      Listener for closing the slide out edit window
     */
    $(document).on('click', '#' + options.name + '-edit-window .edit-window-close', function() {
      $(this).closest('.edit-window').removeClass('show');
    });

    /*
      Listener for the edit button
     */
    $crudContainer.on('click', '.crud-row-edit', function() {
      var id = $(this).parents('tr').find('.crud-id').text();

      $.ajax({
        url: options.readUrl.replace('{{id}}', id),
        type: 'GET',
        success: function(result) {
          editor.setValue(result);
          $('#' + options.name + '-edit-window').addClass('show');

          $('#editor-submit-' + options.name).show();
          $('#editor-submit-' + options.name).unbind();
          $('#editor-submit-' + options.name).on('click', function() {
            var data = JSON.stringify(editor.getValue());
            $.ajax({
              url: options.updateUrl.replace('{{id}}', id),
              type: 'PATCH',
              data: data,
              success: function(result) {
                $.snackbar({
                  content: 'Updated record.'
                });
              },
              error: function(jqXHR, textStatus, errorThrown) {
                $.snackbar({
                  content: 'Failed to update record: ' + jqXHR.statusText
                });
              }
            });
          });

        },
        error: function(jqXHR, textStatus, errorThrown) {
          $.snackbar({
            content: 'Failed to fetch record: ' + jqXHR.statusText
          });
        }
      });
    });

    /*
      Listener for the inspect button
     */
    $crudContainer.on('click', '.crud-row-inspect', function() {
      var id = $(this).parents('tr').find('.crud-id').text();

      $.ajax({
        url: options.readUrl.replace('{{id}}', id),
        type: 'GET',
        success: function(result) {
          editor.setValue(result);
          $('#' + options.name + '-edit-window').addClass('show');
          $('#editor-submit-' + options.name).hide();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          $.snackbar({
            content: 'Failed to fetch record: ' + jqXHR.statusText
          });
        }
      });
    });

    /*
      Listener for the add button
     */
    $crudContainer.on('click', '.crud-add', function() {
      //since there is no proper way to clear the contents, lets destroy it and re-create it.
      editor.destroy();
      editor = new JSONEditor(document.getElementById('editor_holder_' + options.name), options.schema);
      
      $('#' + options.name + '-edit-window').addClass('show');
      $('#editor-submit-' + options.name).show();
      $('#editor-submit-' + options.name).unbind();
      $('#editor-submit-' + options.name).on('click', function() {
        var data = JSON.stringify(editor.getValue());
        $.ajax({
          url: options.createUrl,
          type: 'POST',
          data: data,
          success: function(result) {
            $.snackbar({
              content: 'Saved record.'
            });
          },
          error: function(jqXHR, textStatus, errorThrown) {
            $.snackbar({
              content: 'Failed to save record: ' + jqXHR.statusText
            });
          }
        });
      });
    });

    /*
      Listener for the checkboxes
     */
    $crudContainer.on('change', '.crud-table-row-checkbox', function() {
      checkDelete();
    });

    /*
      Listener for clicking the toggle all selectbox in the table-head
     */
    $crudContainer.on('change', '.crud-table-head-checkbox', function() {
      var table = $(this).closest('.crud-table');
      var checkboxes = table.find('.crud-table-row-checkbox');
      checkboxes.each(function() {
        $(this).prop('checked', !$(this).prop('checked'));
      });
      checkDelete();
    });

    /*
      Function to check if we have any selected records, if so show the delete multi button
     */
    function checkDelete() {
      var checkedBoxes = $crudContainer.find('.crud-table-row-checkbox:checked');
      if (checkedBoxes.length > 0) {
        $crudContainer.find('.crud-delete-multi').removeClass('slide-hide');
      } else {
        $crudContainer.find('.crud-delete-multi').addClass('slide-hide');
      }
    }

    /*
        Delete a record
     */
    $crudContainer.on('click', '.crud-row-delete', function() {
      var row = $(this).parent().parent();
      var id = row.find('.crud-id').text();

      bootbox.confirm('Are your sure you want to delete this record?', function(result) {
        if (result) {
          deleteRecord(id);
        }
      });
    });

    /*
      Delete multiple records
     */
    $crudContainer.on('click', '.crud-delete-multi', function() {
      var checkedBoxes = $crudContainer.find('.crud-table-row-checkbox:checked');
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
          for (var i = ids.length - 1; i >= 0; i--) {
            deleteRecord(ids[i]);
          }
        }
      });
    });

    /*
      Helper functions to remove a single record
     */
    function deleteRecord(id) {
      $.ajax({
        url: options.deleteUrl.replace('{{id}}', id),
        type: 'DELETE',
        success: function(result) {
          row.remove();
          $.snackbar({
            content: 'Deleted record with id: ' + id + '.'
          });
        },
        error: function(jqXHR, textStatus, errorThrown) {
          $.snackbar({
            content: 'Failed to delete record: ' + jqXHR.statusText
          });
        }
      });
    }
  };
})(jQuery);
