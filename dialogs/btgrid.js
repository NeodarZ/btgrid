const arrayRemove = (arr, values) => {
  return arr.filter(item => !values.includes(item));
}


CKEDITOR.dialog.add( 'btgrid', function( editor ) {
  var lang = editor.lang.btgrid;
  var commonLang = editor.lang.common;

  // Whole-positive-integer validator.
  function validatorNum(msg) {
    return function() {
      var value = this.getValue(),
        pass = !!(CKEDITOR.dialog.validate.integer()(value) && value > 0);

      if (!pass) {
        alert(msg); // jshint ignore:line
      }

      return pass;
    };
  }
  return {
    title: lang.editBtGrid,
    minWidth: 600,
    minHeight: 300,
    onShow: function() {
      // Detect if there's a selected table.
      var selection = editor.getSelection(),
        ranges = selection.getRanges();
      var command = this.getName();

      var rowsInput = this.getContentElement('info', 'rowCount'),
        colsInput = this.getContentElement('info', 'colCount'),
        nameGrid = this.getContentElement('info', 'nameGrid');
      if (command == 'btgrid') {
        var grid = selection.getSelectedElement();
        // Enable or disable row and cols.
        if (grid) {
          this.setupContent(grid);
          rowsInput && rowsInput.disable();
          colsInput && colsInput.disable();
        }
      }
    },
    contents: [
      {
        id: 'info',
        label: lang.infoTab,
        accessKey: 'I',
        elements: [
          {
            id: 'colCount',
            type: 'select',
            required: true,
            label: lang.selNumCols,
            items: [
              [ '2', 2],
              [ '3', 3],
              [ '4', 4],
              [ '6', 6],
              [ '12', 12],
            ],
            validate: validatorNum(lang.numColsError),
            setup: function( widget ) {
              if (widget.name == "btgrid") {
                selection = editor.getSelection();
                grid = selection.getSelectedElement();
                if (grid) {
                  rows = grid.getChildren().getItem(0).getChildren();
                  cols = rows.getItem(0).getChildren();
                  widget.setData( 'colCount', cols.count());
                  this.setValue(widget.data.colCount);
                }
              }
            },
            // When committing (saving) this field, set its value to the widget data.
            commit: function( widget ) {
              widget.setData( 'colCount', this.getValue());
            }
          },
          {
            id: 'rowCount',
            type: 'text',
            width: '50px',
            required: true,
            label: lang.genNrRows,
            validate: validatorNum(lang.numRowsError),
            setup: function( widget ) {
              if (widget.name == "btgrid") {
                selection = editor.getSelection();
                grid = selection.getSelectedElement();
                if (grid) {
                  rows = grid.getChildren().getItem(0).getChildren();
                  widget.setData( 'rowCount', rows.count());
                  this.setValue(widget.data.rowCount);
                }
              }
            },
            commit: function( widget ) {
              widget.setData( 'rowCount', this.getValue());
            }
          },
          {
            id: 'nameGrid',
            type: 'text',
            width: '100px',
            label: lang.nameGrid,
            setup: function( widget ) {
              if (widget.name == "btgrid") {
                selection = editor.getSelection();
                grid = selection.getSelectedElement();
                if (grid) {
                  containerGrid = grid.getChildren().getItem(0);
                  classGrid = containerGrid.getAttribute('class');
                  theClass = arrayRemove(classGrid.replace(/,/g, " ").split(" "), ["btgrid", "cke_widget_element", "undefined"]);
                  widget.setData( 'nameGrid', theClass.toString());
                  this.setValue( widget.data.nameGrid );
                }
              }
            },
            commit: function( widget ) {
              widget.setData( 'nameGrid', this.getValue());
            }
          }
        ]
      }
    ],
  };
});
