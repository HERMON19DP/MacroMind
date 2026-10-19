const nodemailer = require("nodemailer");
let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email SMTP configuration is missing");
  }

  const port = Number(SMTP_PORT);

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

async function sendVerificationOtp(email, otp) {
  const mailer = getTransporter();

  await mailer.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Verify your MacroMind account",
    text: [
      `Your MacroMind verification code is ${otp}.`,
      "",
      "This code expires in 10 minutes.",
      "If you did not request this code, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Verify your MacroMind account</h2>
        <p>Enter this code to finish creating your account:</p>
        <p style="font-size: 30px; font-weight: bold; letter-spacing: 8px;">
          ${otp}
        </p>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this code, ignore this email.</p>
      </div>
    `,
  });
}

async function sendBugReportEmail(report) {
  const mailer = getTransporter();

  const attachments = (report.screenshots || []).map((file) => ({
    filename: file.filename,
    content: file.file_data,
    contentType: file.mime_type,
  }));

  await mailer.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.BUG_REPORT_TO || process.env.SMTP_USER,
    subject: `[MacroMind Bug Report] ${report.title}`,
    text: [
      `Report ID: ${report.id}`,
      `User ID: ${report.user_id}`,
      `Submitted: ${report.created_at}`,
      "",
      "Title:",
      report.title,
      "",
      "Description:",
      report.description,
      "",
      `Screenshots attached: ${attachments.length}`,
    ].join("\n"),
    attachments,
  });
}

module.exports = {
  sendVerificationOtp,
  sendBugReportEmail,
};
