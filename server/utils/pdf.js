// server/utils/pdf.js
const puppeteer = require('puppeteer');

async function htmlToPdfBuffer(html, pageSize='A4') {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: pageSize, printBackground: true, margin: { top: '10mm', bottom: '10mm' } });
  await browser.close();
  return pdfBuffer;
}

module.exports = { htmlToPdfBuffer };
