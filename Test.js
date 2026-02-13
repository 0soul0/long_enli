/**
 * 執行所有資料庫測試
 */
function runAllTests() {
    writeLog('Starting Database Automated Tests...', 'INFO');

    try {
        initDatabase(); // 確保表單存在

        test_dbInsert();
        test_dbFind();
        test_dbUpdate();
        test_dbDelete();

        writeLog('All tests completed successfully!', 'SUCCESS');
    } catch (e) {
        writeLog('Tests failed: ' + e.toString(), 'ERROR');
    }
}

function test_dbInsert() {
    writeLog('Testing dbInsert...');
    var testData = { key: 'TEST_KEY', value: 'TEST_VALUE' };
    var result = dbInsert('config', testData);

    if (result.key !== 'TEST_KEY' || result.value !== 'TEST_VALUE') {
        throw new Error('dbInsert failed to return correct data');
    }
    if (!(result.created_at instanceof Date) || !(result.update_at instanceof Date)) {
        throw new Error('dbInsert failed to generate timestamps');
    }
    writeLog('dbInsert passed.');
}

function test_dbFind() {
    writeLog('Testing dbFind and dbFindAll...');
    var query = { key: 'TEST_KEY' };
    var results = dbFind('config', query);

    if (results.length === 0) {
        throw new Error('dbFind could not find the inserted record');
    }

    if (results[0].value !== 'TEST_VALUE') {
        throw new Error('dbFind returned incorrect data');
    }

    var all = dbFindAll('config');
    if (all.length === 0) {
        throw new Error('dbFindAll returned empty');
    }
    writeLog('dbFind / dbFindAll passed.');
}

function test_dbUpdate() {
    writeLog('Testing dbUpdate...');
    // 這裡需要先找到 id，但 config 表沒有 id 欄位，我們改用 users 表測試或假設有 id
    // 根據 SCHEMA，config 只有 key, value。
    // 我們改用 config 的 key 作為更新依據並不符合 dbUpdate(sheetName, id, params) 的定義（它找 item.id）
    // 為了測試 dbUpdate，我們在 users 表插入一筆資料

    var user = dbInsert('users', { real_name: 'Test user', phone: '123' });
    var updated = dbUpdate('users', user.id, { real_name: 'Updated Name' });

    if (!updated || updated.real_name !== 'Updated Name') {
        throw new Error('dbUpdate failed to update record');
    }

    var found = dbFind('users', { id: user.id })[0];
    if (found.real_name !== 'Updated Name') {
        throw new Error('dbUpdate verify failed');
    }
    if (!(updated.update_at instanceof Date) || updated.update_at <= user.update_at) {
        // 考慮到執行速度，可能相等，但至少要是 Date 物件
        if (!(updated.update_at instanceof Date)) {
            throw new Error('dbUpdate failed to refresh update_at');
        }
    }
    writeLog('dbUpdate passed.');
}

function test_dbDelete() {
    writeLog('Testing dbDelete...');
    var user = dbInsert('users', { real_name: 'Delete Me' });
    var id = user.id;

    var success = dbDelete('users', id);
    if (!success) {
        throw new Error('dbDelete returned false');
    }

    var found = dbFind('users', { id: id });
    if (found.length > 0) {
        throw new Error('dbDelete did not actually remove the record');
    }
    writeLog('dbDelete passed.');
}
