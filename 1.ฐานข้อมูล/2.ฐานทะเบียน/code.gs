function doGet() {
return HtmlService.createTemplateFromFile('index').evaluate()
      .setTitle("DATABASE VEHICLE PERMIT WING 21")
      .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/1170/1170170.png')
      .addMetaTag('viewport','width=device-width , initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
} 

/** ดึงไฟล์ */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/** ดึงข้อมูลให้ไปแสดง DataTable */
function getData() {
  var id = '1iH-npUr7weR9YEE0GXdhH7qPnhJ7LIGVHxmLJOmUIF0' 
  var ss = SpreadsheetApp.openById(id)
  var sheet = ss.getSheetByName('Data')
  var range = sheet.getDataRange()
  var values = range.getDisplayValues()
//  Logger.log(values)
  return values
  }

