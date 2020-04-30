function myscript(){
  var sheet = SpreadsheetApp.getActiveSheet()
  var [rows, columns] = [sheet.getLastRow(), sheet.getLastColumn()-1]
  var data = sheet.getRange(5, 2, rows, columns).getValues()
  var map = new Object(); // or var map = {};

  for(var i=0; i < data.length; i++) {
    var dataRow = data[i];
    var name = dataRow[0] ? dataRow[0]: null
    map[name] = myvar;
  } 

}
