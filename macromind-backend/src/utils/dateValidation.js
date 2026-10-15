function validateOptionalDate(value) {
  if (value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    const error = new Error("Date must use YYYY-MM-DD format");
    error.statusCode = 400;
    throw error;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    const error = new Error("Date must use YYYY-MM-DD format");
    error.statusCode = 400;
    throw error;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    const error = new Error("Invalid calendar date");
    error.statusCode = 400;
    throw error;
  }

  return value;
}

module.exports = { validateOptionalDate };
