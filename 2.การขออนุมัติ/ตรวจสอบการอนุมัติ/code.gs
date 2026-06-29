function doGet() {
  return HtmlService.createTemplateFromFile('index')
  .evaluate()
  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  .setTitle('ระบบตรวจสอบข้อมูลอนุมัติบัตรผ่านยานพาหนะ กองบิน 21')
  .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/1170/1170170.png')
}

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

function getData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheets()[1]
  var range = sheet.getDataRange()
  var values = range.getDisplayValues()
 // Logger.log(values)
  return values
  }

function getData2() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheets()[2]
  var range = sheet.getDataRange()
  var values = range.getDisplayValues()
 // Logger.log(values)
  return values
  }

function searchData(user){
   
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheets()[3]
  var data = ss.getDataRange() .getDisplayValues()
  var result = data.filter(r=> r[1]== user.name)
  // Logger.log(result)
  return result
}
