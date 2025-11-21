const cron = require('node-cron');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { DateTime } = require('luxon');
const nodemailer = require('nodemailer');
const ActivityLog = require('../Schemas/ActivityLog.js');
const User = require('../Schemas/User.js');
const WeeklyReport = require('../Schemas/WeeklyReport.js');

const TIMEZONE = 'Europe/London';

// 📨 Mail transporter (Gmail)
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  secure: true,
});

function parseDurationToMinutes(str) {
  if (!str) return 0;
  const hhmm = str.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
  if (hhmm) return parseInt(hhmm[1]) * 60 + parseInt(hhmm[2]);
  const hm = str.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i);
  if (hm) return (parseInt(hm[1] || 0) * 60) + parseInt(hm[2] || 0);
  const plain = parseInt(str, 10);
  return isNaN(plain) ? 0 : plain;
}

function getLastWeekRange() {
  const now = DateTime.now().setZone(TIMEZONE);
  const to = now;                          // up to "now"
  const from = now.minus({ days: 7 });     // last 7 x 24h

  return {
    from: from.toJSDate(),
    to: to.toJSDate(),
    // labels
    labelDateISO: to.toFormat('yyyy-LL-dd'),
    labelFromShort: from.toFormat('dd-LLL'),
    labelToShort: to.toFormat('dd-LLL'),
    labelYear: to.toFormat('yyyy'),
    labelFromLong: from.toFormat('dd LLL yyyy'),
    labelToLong: to.toFormat('dd LLL yyyy'),
  };
}


async function generateWeeklyReport() {
  console.log('🕒 [WeeklyReport] Generating...');

  const {
    from, to,
    labelDateISO, labelFromShort, labelToShort, labelYear,
    labelFromLong, labelToLong
  } = getLastWeekRange();

  // 1️⃣ Fetch logs
  const logs = await ActivityLog.find().populate('userId', 'username');
  const filteredLogs = logs.filter((log) => {
    const createdAt = log.createdAt ? new Date(log.createdAt) : null;
    const dateField = log.date ? new Date(log.date) : null;
    const withinCreatedAt = createdAt && createdAt >= from && createdAt < to;
    const withinDateField = !withinCreatedAt && dateField && !isNaN(dateField) && dateField >= from && dateField < to;
    return withinCreatedAt || withinDateField;
  });
  console.log(`📄 Found ${filteredLogs.length} logs between ${labelFromLong} → ${labelToLong}`);

  // 2️⃣ Group by user
  const summary = new Map();
  for (const log of filteredLogs) {
    const userId = log.userId?._id?.toString();
    if (!userId) continue;
    if (!summary.has(userId)) summary.set(userId, { mins: 0, shifts: 0, user: log.userId });
    summary.get(userId).mins += parseDurationToMinutes(log.duration);
    summary.get(userId).shifts++;
  }

  // 3️⃣ Build Excel
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Flat Studios Automation';
  wb.lastModifiedBy = 'Flat Studios Automation';
  wb.created = new Date();
  wb.modified = new Date();

  const ws = wb.addWorksheet('Weekly Summary');
  ws.columns = [
    { header: 'User', key: 'username', width: 25 },
    { header: 'Total Shifts', key: 'totalShifts', width: 15 },
    { header: 'Total Time', key: 'totalTime', width: 18 },
  ];
  ws.getRow(1).font = { bold: true };

  for (const [, { mins, shifts, user }] of summary.entries()) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    ws.addRow({
      username: user.username || 'Unknown',
      totalShifts: shifts,
      totalTime: `${h}h ${m}m`,
    });
    await User.findByIdAndUpdate(user._id, {
      $set: { weeklyHours: h, weeklyMinutes: m, weeklyShifts: shifts },
    });
  }

  // Totals
  const totalMins = [...summary.values()].reduce((a, b) => a + b.mins, 0);
  const totalShifts = [...summary.values()].reduce((a, b) => a + b.shifts, 0);
  const th = Math.floor(totalMins / 60);
  const tm = totalMins % 60;
  ws.addRow({});
  ws.addRow({ username: 'TOTAL', totalShifts, totalTime: `${th}h ${tm}m` });
  ws.lastRow.font = { bold: true };

  const filename = `Weekly_Activity_${labelFromShort}–${labelToShort}_${labelYear}.xlsx`;
  const buffer = await wb.xlsx.writeBuffer();

  // Save to GridFS
  const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'weeklyReports' });
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  uploadStream.end(buffer);

  const savedFile = await new Promise((resolve, reject) => {
    uploadStream.on('finish', resolve);
    uploadStream.on('error', reject);
  });

  // Save metadata + buffer
  const reportDoc = await WeeklyReport.create({
    filename,
    fileId: savedFile._id,
    buffer,
    createdAt: new Date(),
  });

  console.log(`✅ [WeeklyReport] Saved "${filename}" (${filteredLogs.length} logs, ${summary.size} users)`);

  // Email
  const recipients = ["flat@flatstudios.net", "admin@flatstudios.net", "codecmdr.rblx@gmail.com"]

  if (recipients.length) {
    const toList = recipients.map(r => r).filter(Boolean);
    const downloadUrl = `https://yapton.vercel.app/api/reports/file/${reportDoc._id}`;
    const viewUrl = `https://yapton.vercel.app/hub+/activity/reports/${reportDoc._id}`;

    const html = `
      <div style="font-family:Arial,sans-serif">
        <p>Hello,</p>
        <p>The weekly activity report for <b>${labelFromLong}</b> – <b>${labelToLong}</b> is ready.</p>
        <p>
          <a href="${downloadUrl}" style="display:inline-block;background:#10b981;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">
            Download Report
          </a>
                    <a href="${viewUrl}" style="display:inline-block;background:#10b981;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">
            View Report
          </a>
        </p>
        <p>— Flat Studios Automated Reports</p>
      </div>
    `;

    try {
      await mailer.sendMail({
        from: process.env.MAIL_USER,
        to: toList,
        subject: `Weekly Activity Report – ${labelFromLong} → ${labelToLong}`,
        html,
        attachments: [
          {
            filename,
            content: buffer,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        ],
      });
      console.log(`📧 Emailed report to ${toList.length} recipient(s).`);
    } catch (err) {
      console.error('❌ Email send failed:', err.message);
    }
  } else {
    console.log('⚠️ No email recipients found for role filter.');
  }

  console.log(`🗓️  Period: ${labelFromLong} → ${labelToLong}`);
}

// 🕒 Run every Sunday at 00:00 (London)
cron.schedule('0 20 * * 0', generateWeeklyReport, { timezone: TIMEZONE });
// cron.schedule('* * * * *', generateWeeklyReport, { timezone: TIMEZONE });
console.log('📅 [WeeklyReport] Scheduler loaded (runs every Sunday 00:00 London)');

module.exports = generateWeeklyReport;
