/**
 * Sivamalai Motors - Universal Multi-Module Apps Script
 * Handles Service CRM, Sales CRM, and Daily Attendance
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const MODULES = {
    service: "Service_Data",
    sales: "Sales_Data",
    attendance: "Attendance_Data"
};

function doGet(e) {
    const action = e.parameter.action;
    const module = e.parameter.module;

    if (!MODULES[module]) return JSONResponse({ error: "Invalid module" });

    const sheet = getOrCreateSheet(MODULES[module]);

    if (action === "read") {
        const data = sheet.getRange("A1").getValue();
        return JSONResponse(data ? JSON.parse(data) : []);
    }
}

function doPost(e) {
    const action = e.parameter.action;
    const module = e.parameter.module;
    const body = JSON.parse(e.postData.contents);

    if (!MODULES[module]) return JSONResponse({ error: "Invalid module" });

    const sheet = getOrCreateSheet(MODULES[module]);

    if (action === "sync") {
        sheet.getRange("A1").setValue(JSON.stringify(body));
        return JSONResponse({ status: "success", count: body.length });
    }
}

function getOrCreateSheet(name) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
        sheet = ss.insertSheet(name);
        // Clear any default content
        sheet.clear();
    }
    return sheet;
}

function JSONResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
