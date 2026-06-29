/**
 * ระบบทะเบียนข้อมูลอนุมัติบัตรผ่านยานพาหนะ กองบิน 21
 */

function doGet() {
  // ✅ FIX: ต้องใช้ createTemplateFromFile แล้ว set ค่าตัวแปร scriptlet
  // index.html ใช้ <?!= credit ?>, <?!= youtube ?>, <?!= facebook ?>
  // ถ้าไม่กำหนดค่าใน template จะเกิด ReferenceError ตอน evaluate()
  var tmpl = HtmlService.createTemplateFromFile('index');

  // ✅ กำหนดค่าตัวแปร scriptlet — แก้ URL ตามจริง
  tmpl.credit   = 'https://line.me/ti/p/skelparn';   // ← แก้ URL ติดต่อผู้พัฒนา
  tmpl.youtube  = 'https://www.youtube.com/@wing21airbase82'; // ← แก้ YouTube channel
  tmpl.facebook = 'https://www.facebook.com/wing21rtaf'; // ← แก้ Facebook page

  return tmpl.evaluate()
      .setTitle('ระบบทะเบียนข้อมูลอนุมัติบัตรผ่านยานพาหนะ กองบิน 21')
      .setFaviconUrl('https://cdn-icons-png.flaticon.com/512/1170/1170170.png')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheet() {
  var ws   = SpreadsheetApp.getActive();
  var ss   = ws.getSheetByName('Data');
  var sht1 = ws.getSheetByName('setting');
  return { ws, ss, sht1 };
}

// แปลง base64 dataURL → Blob สำหรับ Drive
function base64ToBlob(dataUrl, filename) {
  var matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) return null;
  var mimeType   = matches[1];
  var base64Data = matches[2];
  var decoded    = Utilities.base64Decode(base64Data);
  return Utilities.newBlob(decoded, mimeType, filename || 'upload_' + new Date().getTime());
}

/** บันทึกข้อมูลใหม่ */
function addRecord(obj) {
  var { ss, sht1 } = getSheet();

  // ✅ PERF: อ่าน setting ทีเดียว (fd, token, onoff) แทนอ่านทีละ cell
  var settings = sht1.getRange(2, 2, 3, 1).getValues();
  var fd       = settings[0][0]; // row 2 = folder id
  var token    = settings[1][0]; // row 3 = LINE token
  var OnOffLine = settings[2][0]; // row 4 = on/off

  var folder = DriveApp.getFolderById(fd);
  var newId  = creatId(ss);
  var ucFile = '';

  if (obj.myFile && obj.myFile.length > 0) {
    var blob = base64ToBlob(obj.myFile, 'img_' + newId + '.jpg');
    if (blob) {
      var file = folder.createFile(blob).getId();
      ucFile = 'https://lh5.googleusercontent.com/d/' + file;
    }
  }

  var daytime = getDayTime();
  var rowData = [
    newId,
    obj.fname,
    obj.status || 'รออนุมัติ',
    obj.subject,
    obj.details,
    obj.email,
    "'" + obj.phone,
    daytime,
    ucFile,
    'รออนุมัติ'
  ];
  ss.appendRow(rowData);
  CacheService.getScriptCache().remove('allData'); // invalidate cache

  var data = ss.getRange(ss.getLastRow(), 1, 1, ss.getLastColumn()).getDisplayValues()[0];

  if (OnOffLine == true) {
    var msg   = '\nชื่อผู้แจ้ง: ' + obj.fname
              + '\nรายการ: '       + obj.subject
              + '\nรายละเอียด: '   + obj.details
              + '\nอีเมล์: '       + obj.email
              + '\nเบอร์โทร: '     + obj.phone
              + '\nภาพ: '          + ucFile
              + '\nวันที่แจ้ง: '   + daytime
              + '\n📝 สถานะ: '     + data[2];
    sendNotify(msg, token);
  }

  return data;
}

/** Auto increment ID */
function creatId(ss) {
  if (!ss) ss = getSheet().ss;
  if (ss.getLastRow() === 1) return 1;
  var ids   = ss.getRange(2, 1, ss.getLastRow() - 1, 1).getValues().map(r => r[0]);
  var maxId = 0;
  ids.forEach(function(id) { if (Number(id) > maxId) maxId = Number(id); });
  return maxId + 1;
}

/** ค้นหาข้อมูลตาม ID */
function findRecord(record) {
  var { ss } = getSheet();
  var data   = ss.getDataRange().getDisplayValues();
  var index  = -1;
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == record) { index = i; break; }
  }
  if (index > -1) {
    return ss.getRange(index + 1, 1, 1, ss.getLastColumn()).getDisplayValues();
  }
  return [];  // ✅ FIX: คืน [] แทน data ทั้งหมดเมื่อหาไม่เจอ เพื่อป้องกัน client crash
}

/** แก้ไขข้อมูล */
function updateRecord(obj) {
  var { ss, sht1 } = getSheet();
  var data   = ss.getDataRange().getDisplayValues();
  var ucFile = '';

  // ✅ PERF: อ่าน setting ทีเดียว
  var settings  = sht1.getRange(2, 2, 3, 1).getValues();
  var fd        = settings[0][0];
  var token     = settings[1][0];
  var OnOffLine = settings[2][0];

  if (obj.myFile && obj.myFile.length > 0) {
    var folder = DriveApp.getFolderById(fd);
    var blob   = base64ToBlob(obj.myFile, 'img_' + obj.numid + '_edit.jpg');
    if (blob) {
      var file = folder.createFile(blob).getId();
      ucFile = 'https://lh5.googleusercontent.com/d/' + file;
    }
  }

  var index = -1;
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == obj.numid) { index = i; break; }
  }

  if (index === -1) {
    throw new Error('ไม่พบรายการ ID: ' + obj.numid); // ✅ FIX: throw ถ้าหาไม่เจอ
  }

  // ✅ PERF: เขียนทีเดียวด้วย setValues() แทน setValue() ทีละ cell
  var row = ss.getRange(index + 1, 1, 1, ss.getLastColumn()).getValues()[0];
  row[1] = obj.fname;
  row[2] = obj.status;
  row[3] = obj.subject;
  row[4] = obj.details;
  row[5] = obj.email;
  row[6] = "'" + obj.phone;
  if (ucFile !== '') { row[8] = ucFile; }
  row[9] = obj.status === 'ดำเนินการแล้ว' ? 'ดำเนินการแล้ว' : 'รออนุมัติ';
  ss.getRange(index + 1, 1, 1, row.length).setValues([row]);
  CacheService.getScriptCache().remove('allData');

  var result = ss.getRange(index + 1, 1, 1, ss.getLastColumn()).getDisplayValues()[0];

  var OnOffLineUpdate = OnOffLine;
  if (OnOffLineUpdate == true) {
    var msg   = '\nชื่อผู้แจ้ง: '   + obj.fname
              + '\nรายการ: '         + obj.subject
              + '\nรายละเอียด: '     + obj.details
              + '\nอีเมล์: '         + obj.email
              + '\nเบอร์โทร: '       + obj.phone
              + '\nภาพ: '            + result[8]
              + '\nวันที่แจ้ง: '     + result[7]
              + '\n📌📌 สถานะ: '     + obj.status;
    sendNotify(msg, token);
  }
  return result;
}

/** ดึงข้อมูลทั้งหมด — ใช้ CacheService ลดการอ่าน Sheet ซ้ำ */
function getData() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('allData');
  if (cached) {
    return JSON.parse(cached);
  }
  var { ws } = getSheet();
  var data = ws.getSheetByName('Data').getDataRange().getDisplayValues();
  // ✅ PERF: เพิ่ม cache เป็น 120 วินาที (จาก 30) — ลดการอ่าน Sheet เมื่อมีหลายคนเปิดพร้อมกัน
  try { cache.put('allData', JSON.stringify(data), 120); } catch(e) { /* data เกิน 100KB ก็ไม่เป็นไร */ }
  return data;
}

/** ✅ PERF: รวม getData + getStatus เป็น call เดียว ลด round-trip และลดการเปิด Spreadsheet */
function getInitData() {
  var { ws } = getSheet();

  // ✅ อ่าน cache ก่อน — ถ้ามีให้ใช้เลย ไม่ต้องเปิด sheet ซ้ำ
  var cache  = CacheService.getScriptCache();
  var cached = cache.get('allData');
  var tableData;
  if (cached) {
    tableData = JSON.parse(cached);
  } else {
    tableData = ws.getSheetByName('Data').getDataRange().getDisplayValues();
    try { cache.put('allData', JSON.stringify(tableData), 120); } catch(e) {}
  }

  // ✅ นับสถานะจาก tableData โดยตรง — ไม่ต้องเปิด sheet Status แยก
  var all     = tableData.length > 1 ? tableData.length - 1 : 0; // ไม่นับ header
  var success = 0;
  var wait    = 0;
  for (var i = 1; i < tableData.length; i++) {
    if (tableData[i][2] === 'ดำเนินการแล้ว') success++;
    else wait++;
  }
  var statusData = [all, success, wait];

  return { tableData: tableData, statusData: statusData };
}

/** ชุดวันที่/เวลา ภาษาไทย */
function getDayTime() {
  var d         = new Date();
  var monthCut  = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  var time      = Utilities.formatDate(d, 'Asia/Bangkok', 'HH:mm:ss');
  return d.getDate() + ' ' + monthCut[d.getMonth()] + ' ' + (d.getFullYear() + 543) + ',  ' + time;
}

function sendNotify(msg, token) {
  var options = {
    method:  'post',
    payload: { message: msg },
    headers: { Authorization: 'Bearer ' + token }
  };
  UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
}

function getStatus() {
  var { ws } = getSheet();
  var st     = ws.getSheetByName('Status');
  var data   = st.getDataRange().getDisplayValues().slice(1);
  return data[0];
}

function loginData(obj) {
  var { ws } = getSheet();
  var ls     = ws.getSheetByName('Admin');
  var data   = ls.getDataRange().getDisplayValues();
  // ✅ FIX: เปรียบเทียบ trim() ป้องกัน whitespace นำหน้า/ท้าย
  var found  = data.find(function(r) {
    return (r[0].toString().trim() + r[1].toString().trim())
        === (obj.username.toString().trim() + obj.password.toString().trim());
  });
  return found || null;
}