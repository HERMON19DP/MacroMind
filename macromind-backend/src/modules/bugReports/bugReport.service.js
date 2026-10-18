const pool = require("../../config/db");
const emailService = require("../auth/email.service");

function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createBugReport(userId, body, files = []) {
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();

  if (!title || title.length > 200) {
    throw createError("Title is required and must be 200 characters or fewer.");
  }

  if (!description || description.length > 10000) {
    throw createError(
      "Description is required and must be 10,000 characters or fewer.",
    );
  }

  const client = await pool.connect();
  let report;

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO bug_reports (user_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, title, description, created_at`,
      [userId, title, description],
    );

    report = result.rows[0];

    for (const file of files) {
      await client.query(
        `INSERT INTO bug_report_attachments
           (bug_report_id, filename, mime_type, file_data)
         VALUES ($1, $2, $3, $4)`,
        [report.id, file.originalname, file.mimetype, file.buffer],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  // The report is already committed. An email failure must not
  // delete it or make the client think the submission was lost.
  let emailSent = false;

  try {
    const attachmentsResult = await pool.query(
      `SELECT filename, mime_type, file_data
       FROM bug_report_attachments
       WHERE bug_report_id = $1
       ORDER BY created_at ASC`,
      [report.id],
    );

    await emailService.sendBugReportEmail({
      ...report,
      screenshots: attachmentsResult.rows,
    });

    emailSent = true;
  } catch (error) {
    // Log the failure server-side without exposing SMTP details.
    console.error(
      `Bug report ${report.id} was saved, but its notification email failed.`,
      error.message,
    );
  }

  return {
    id: report.id,
    title: report.title,
    description: report.description,
    createdAt: report.created_at,
    screenshotCount: files.length,
    emailSent,
  };
}

module.exports = { createBugReport };
