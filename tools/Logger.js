const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(data => `${data.timestamp}: ${data.message}`),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.printf(
          data => `${data.timestamp} [${data.level}]: ${data.message}`,
        ),
      ),
    }),
    new transports.File({ filename: 'logs/errors.log' }),
  ],
});
