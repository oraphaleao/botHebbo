// index.js (Ponto de entrada do bot)
require("dotenv").config();
const DiscordBot = require("./src/bot");

const bot = new DiscordBot();
bot.start();
