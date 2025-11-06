const path = require("path");
const fs = require("fs");
const { createLogger, format, transports } = require("winston");

// Ensure log directory exists before logging
const drive = process.env.SystemDrive || "C:";
const baseDirectory = path.join(drive, "otn");
const logDir = path.join(baseDirectory, "logs");

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// Create the logger
const logger = createLogger({
  level: "info", // Log level (info, error, debug, etc.)
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new transports.File({
      filename: path.join(logDir, `app-${getCurrentDate()}.log`),
      format: format.combine(
        format((info) => (info.level !== "error" ? info : false))() // Filter only "info" logs
      ),
    }), // Main log file
    new transports.File({
      filename: path.join(logDir, `error-${getCurrentDate()}.log`),
      level: "error",
    }), // Error logs
  ],
});

// Catch uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.stack || error.message}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// Get the current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

// Export the logger factory functions
module.exports = logger;
