// server/utils/sheets.js
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const SHEET_ID = process.env.SHEET_ID;
const SERVICE_ACCOUNT_FILE = process.env.SERVICE_ACCOUNT_FILE || 'service-account.json';

if (!SHEET_ID) {
  throw new Error('SHEET_ID missing in .env');
}

const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function sheetsClient() {
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function appendRow(range, values) {
  const sheets = await sheetsClient();
  return sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [values] },
  });
}

async function getRange(range) {
  const sheets = await sheetsClient();
  const resp = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range });
  return resp.data.values || [];
}

module.exports = { appendRow, getRange };
