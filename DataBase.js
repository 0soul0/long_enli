var SCHEMA = {
  users: ['id', 'user_id', 'line_user_id', 'real_name', 'birth_year', 'match_hash', 'phone', 'address', 'point_balance', 'status', 'created_at', 'update_at'],
  accounts: ['id', 'accounts_id', 'account', 'password_hash', 'role', 'merchant_id', 'status', 'created_at', 'update_at'],
  products: ['id', 'merchant_id', 'name', 'price_point', 'stock_qty', 'is_active', 'created_at', 'update_at'],
  transactions: ['id', 'user_id', 'type', 'amount', 'merchant_id', 'product_id', 'created_at', 'update_at'],
  unclaimed_points: ['id', 'match_hash', 'amount', 'batch_id', 'is_claimed', 'created_at', 'update_at'],
  config: ['key', 'value', 'created_at', 'update_at'],
  logs: ['timestamp', 'level', 'message', 'context', 'created_at', 'update_at']
};


/**
 * 取得 Spreadsheet 物件 (優先使用 Active，若無則依 ID 開啟)
 */
function getSS() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
}

/**
 * 初始化資料庫
 */
function initDatabase() {
  var ss = getSS();
  Object.keys(SCHEMA).forEach(function (sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(SCHEMA[sheetName]);
      sheet.getRange(1, 1, 1, SCHEMA[sheetName].length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  });

  // 初始化 API Token
  var token = dbFind('config', { key: 'API_TOKEN' })[0];
  if (!token) {
    dbInsert('config', { key: 'API_TOKEN', value: 'ABC-123-SECRET' });
  }

  return "Database initialized.";
}

/**
 * 列印並儲存 Log 到 Google Sheet
 * @param {string} message 
 * @param {string} level 
 * @param {any} context 
 */
function writeLog(message, level, context) {
  level = level || 'INFO';
  context = context || '';
  console.log("[" + level + "] " + message);
  try {
    dbInsert('logs', {
      timestamp: new Date(),
      level: level,
      message: message,
      context: typeof context === 'object' ? JSON.stringify(context) : context
    });
  } catch (e) {
    console.error('Failed to write log to DB: ' + e.toString());
  }
}

// ==========================================
// 資料庫核心函式 (DB Functions)
// ==========================================

function getSheet(sheetName) {
  var ss = getSS();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet " + sheetName + " not found.");
  return sheet;
}

function dbFindAll(sheetName) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  return data.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function dbFind(sheetName, query) {
  var all = dbFindAll(sheetName);
  return all.filter(function (item) {
    return Object.keys(query).every(function (key) { return item[key] == query[key]; });
  });
}

function dbInsert(sheetName, params) {
  var sheet = getSheet(sheetName);
  var headers = SCHEMA[sheetName];
  var now = new Date();

  if (!params.id && headers.indexOf('id') > -1) params.id = Utilities.getUuid();
  if (!params.created_at && headers.indexOf('created_at') > -1) params.created_at = now;
  if (!params.update_at && headers.indexOf('update_at') > -1) params.update_at = now;

  var row = headers.map(function (h) { return params[h] !== undefined ? params[h] : ''; });
  sheet.appendRow(row);

  var result = {};
  headers.forEach(function (h, i) { result[h] = row[i]; });
  return result;
}

function dbUpdate(sheetName, id, params) {
  var sheet = getSheet(sheetName);
  var all = dbFindAll(sheetName);
  var rowIndex = all.findIndex(function (item) { return item.id == id; });
  if (rowIndex === -1) return null;

  var headers = SCHEMA[sheetName];
  var now = new Date();

  if (headers.indexOf('update_at') > -1) params.update_at = now;

  var updatedData = Object.assign({}, all[rowIndex], params, { id: id });
  var newRow = headers.map(function (h) { return updatedData[h]; });

  sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([newRow]);
  return updatedData;
}

function dbDelete(sheetName, id) {
  var sheet = getSheet(sheetName);
  var all = dbFindAll(sheetName);
  var rowIndex = all.findIndex(function (item) { return item.id == id; });
  if (rowIndex === -1) return false;
  sheet.deleteRow(rowIndex + 2);
  return true;
}

function changePassword(body) {
  var account = body.data.account;
  var old_password_hash = body.data.old_password_hash;
  var new_password_hash = body.data.new_password_hash;

  var user = dbFind('accounts', { account: account })[0];
  if (!user || user.password_hash !== old_password_hash) return response({ error: 'Invalid credentials' }, 403);

  var success = !!dbUpdate('accounts', user.id, { password_hash: new_password_hash });
  return response({ success: success });
}