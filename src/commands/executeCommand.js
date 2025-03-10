module.exports = {
    name: "executarComando",
    async execute(message, args, client) {
        if (!args.length) {
            return message.reply("Por favor, forneça um comando para executar.");
        }

        const commandName = args.shift().toLowerCase(); // Pega o nome do comando
        const command = client.commands.get(commandName);

        if (!command) {
            return message.reply("Comando não encontrado.");
        }

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Erro ao executar o comando ${commandName}:`, error);
            message.reply("Houve um erro ao tentar executar o comando.");
        }
    },
};
