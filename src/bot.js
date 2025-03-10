require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const config = require("./config");

class DiscordBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        // Armazenar os comandos
        this.client.commands = new Map();
    }

    start() {
        // Carregar eventos
        eventHandler(this.client);

        // Adicionar o listener para 'messageCreate' diretamente aqui
        this.client.on("messageCreate", async message => {
            if (!message.content.startsWith("!") || message.author.bot) return;
        
            const args = message.content.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
        
            const command = this.client.commands.get(commandName);
            if (!command) {
                console.log("⚠️ Comando não encontrado.");
                return;
            }
        
            try {
                await command.execute(message, args, this.client);
            } catch (error) {
                console.error(`❌ Erro ao executar o comando ${commandName}:`, error);
            }
        });
        
        // Logar o bot
        this.client.login(config.token);
    }
}

module.exports = DiscordBot;
