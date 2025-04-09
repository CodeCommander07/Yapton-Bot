const chalk = require("chalk");
const { DateTime } = require("luxon");

class Logger {
  currentTime() {
    return DateTime.now().toFormat("tt");
  }
  info(identifier, message) {
    console.info(
      chalk.blue.bold(`[${this.currentTime()}] `) +
        chalk.green.bold("[INFO] ") +
        chalk.cyan.bold(`[${identifier.toUpperCase()}]`) +
        chalk.white.bold(" : ") +
        chalk.greenBright(message.toLowerCase())
    );
  }
  warn(identifier, message) {
    console.warn(
      chalk.blue.bold(`[${this.currentTime()}] `) +
        chalk.yellowBright.bold("[WARN] ") +
        chalk.cyan.bold(`[${identifier.toUpperCase()}]`) +
        chalk.white.bold(" : ") +
        chalk.yellowBright(message.toLowerCase())
    );
  }
  err(identifier, message) {
    console.error(
      chalk.blue.bold(`[${this.currentTime()}] `) +
        chalk.red.bold("[ERROR] ") +
        chalk.cyan.bold(`[${identifier.toUpperCase()}]`) +
        chalk.white.bold(" : ") +
        chalk.red(message.toLowerCase())
    );
  }
}
const logger = new Logger();

module.exports = logger;
