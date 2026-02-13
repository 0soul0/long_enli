/**
 * HTML UI 說明頁面
 */

function getHtmlDocs() {
  var config = dbFind('config', { key: 'API_TOKEN' })[0];
  var apiToken = config ? config.value : 'YOUR_TOKEN';

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>里民系統操作說明</title>' +
    '<style>' +
    'body { font-family: "Microsoft JhengHei", sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; background: #f8fafc; color: #1e293b; }' +
    '.card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 25px; border: 1px solid #e2e8f0; }' +
    'h1 { text-align: center; color: #1e40af; } ' +
    'h2 { border-bottom: 2px solid #3b82f6; padding-bottom: 8px; color: #1e40af; }' +
    'h3 { border-left: 4px solid #3b82f6; padding-left: 15px; color: #2563eb; }' +
    'code { background: #f1f5f9; padding: 2px 5px; border-radius: 4px; color: #ef4444; font-family: monospace; }' +
    'pre { background: #1e293b; color: #f8fafc; padding: 20px; border-radius: 8px; overflow-x: auto; font-size: 0.9em; }' +
    '.token-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 8px; text-align: center; font-size: 1.1em; margin: 10px 0; }' +
    '.badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold; margin-right: 5px; }' +
    '.get { background: #dcfce7; color: #166534; } .post { background: #dbeafe; color: #1e40af; }' +
    '</style></head><body>' +
    '<h1>🚀 里民數位貨幣系統</h1>' +

    '<div class="card"><h2>🔑 認證資訊</h2>' +
    '<div class="token-box">當前 Token: <code>' + apiToken + '</code></div>' +
    '<p>請在所有開發者 API 請求中包含此 Token。</p></div>' +

    '<div class="card"><h2>� 管理員指南</h2>' +
    '<h3>1. 初始化系統</h3><p>若為新專案，請先執行 <code>initDatabase</code> 函式以建立必要的資料表。</p>' +
    '<h3>2. 用戶管理</h3><p>在 <code>users</code> 分頁中管理里民資訊。系統會根據 <code>real_name</code> 與 <code>birth_year</code> 自動生成 <code>match_hash</code> 用於點數比對。</p>' +
    '<h3>3. 點數發放</h3><p>將未領取點數填入 <code>unclaimed_points</code> 分頁，系統將於里民透過 LINE 登入時自動核對並撥款。</p></div>' +

    '<div class="card"><h2>💻 開發者 API 指南</h2>' +
    '<p>所有請求皆需附帶 <code>token</code> 參數。</p>' +
    '<h3>取得資料 <span class="badge get">GET</span></h3>' +
    '<pre>?path={sheetName}&token=' + apiToken + '</pre>' +
    '<h3>新增/更新資料 <span class="badge post">POST</span></h3>' +
    '<pre>POST { URL }\n{\n  \"path\": \"users\",\n  \"method\": \"POST\",\n  \"data\": { ... }\n}</pre></div>' +

    '</body></html>';
  return html;
}

/**
 * 在試算表側邊欄顯示說明頁面
 */
function showManual() {
  var html = HtmlService.createHtmlOutput(getHtmlDocs())
    .setTitle('操作說明')
    .setWidth(450);
  SpreadsheetApp.getUi().showSidebar(html);
}
