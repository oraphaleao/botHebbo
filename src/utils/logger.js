const chalk = require("chalk");

module.exports = {
    info: (message) => console.log(chalk.blue("[INFO]"), message),
    success: (message) => console.log(chalk.green("[SUCCESS]"), message),
    error: (message) => console.error(chalk.red("[ERROR]"), message),
};