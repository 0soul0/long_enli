/**
 * RESTful API 路由與驗證
 */

function validateToken(e) {
  var tokenInQuery = e.parameter.token;
  var tokenInHeader = e.postData ? JSON.parse(e.postData.contents).token : null;
  var config = dbFind('config', { key: 'API_TOKEN' })[0];
  var apiToken = config ? config.value : null;
  return (tokenInQuery === apiToken || tokenInHeader === apiToken);
}

function doGet(e) {
  var path = e.parameter.path;
  if (!path) {
    return HtmlService.createHtmlOutput(getHtmlDocs())
      .setTitle('Google Sheet API Documentation')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (!validateToken(e)) return response({ error: 'Unauthorized' }, 401);

  try {
    if (!SCHEMA[path]) return response({ error: 'Invalid path' }, 400);
    
    if (path === 'transactions' && e.parameter.user_id) {
      return response(dbFind('transactions', { user_id: e.parameter.user_id }));
    }
    
    if (e.parameter.id) {
       var res = dbFind(path, { id: e.parameter.id });
       return response(res[0] || { error: 'Not found' }, res[0] ? 200 : 404);
    }
    return response(dbFindAll(path));
  } catch (err) { return response({ error: err.message }, 500); }
}

function doPost(e) {
  if (!validateToken(e)) return response({ error: 'Unauthorized' }, 401);
  try {
    var body = JSON.parse(e.postData.contents);
    var path = body.path;
    var method = (body.method || 'POST').toUpperCase();
    if (!path || !SCHEMA[path]) return response({ error: 'Invalid path' }, 400);

    if (path === 'accounts' && body.action === 'change_password') return changePassword(body);

    switch (method) {
      case 'POST':
        if (path === 'users' && body.data.real_name && body.data.birth_year) {
          body.data.match_hash = body.data.real_name + "_" + body.data.birth_year;
        }
        return response(dbInsert(path, body.data), 201);
      case 'PUT':
        return response(dbUpdate(path, body.id, body.data));
      case 'DELETE':
        var success = dbDelete(path, body.id);
        return response({ success: success }, success ? 200 : 404);
      default:
        return response({ error: 'Method not supported' }, 405);
    }
  } catch (err) { return response({ error: err.message }, 500); }
}

function response(data, status) {
  status = status || 200;
  return ContentService.createTextOutput(JSON.stringify({ status: status, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

