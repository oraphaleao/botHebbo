const DiscordBot = require("./src/bot");

const bot = new DiscordBot(process.env.TOKEN);
bot.start();
