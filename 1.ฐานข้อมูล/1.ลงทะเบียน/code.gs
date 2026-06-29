function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
    .setTitle("ลงทะเบียนทำบัตรผ่านยานพาหนะ บน.21")
    .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/1170/1170170.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}


var ss = SpreadsheetApp.getActive().getSheets()[0]
var data = ss.getDataRange().getDisplayValues()
var id = data.map(r => r[1]) //เช็คเลขทะเบียนรถ (column B = index 1)


//**เพิ่มข้อมูล */
function addRecord(obj){
 var index = id.indexOf(obj.input2) 
 var output = {}
   if(index > -1){
     output.result = false
   }else{
     output.result = true
     ss.appendRow(["'"+obj.input1, "'"+obj.input2, "'"+obj.input3, "'"+obj.input4, "'"+obj.input5, "'"+obj.input6, "'"+obj.input7, "'"+obj.input8, "'"+obj.input9, "'"+obj.input10, "'"+obj.input11, "'"+obj.input12, "'"+obj.input13, "'"+obj.input14, "'"+obj.input15, "'"+obj.input16 ])
     data = ss.getRange(ss.getLastRow(),1,1,ss.getLastColumn()).getValues()[0]
     output.data = data

  // var token = 'xxx'//Token   
  // var message = '\n📑 ฟอร์มลงทะเบียน' + '\nชื่อ: ' + data[0] +' '+ data[1] + '\nอีเมล์: ' + data[5]
  //     NotifyApp.sendNotify(token, message)
  }
  return output
}