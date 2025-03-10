const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    // Carregar eventos
    const eventFiles = fs.readdirSync(path.join(__dirname, "../events")).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (event.name && event.execute) {
            client.on(event.name, (...args) => event.execute(...args, client));
            console.log(`✅ Evento carregado: ${event.name}`);
        }
    }

    // Carregar comandos
    client.commands = new Map();
    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);

        console.log(`✅ Comando carregado: ${command.name}`);
    }

    console.log(`Comandos carregados: ${[...client.commands.keys()].join(', ')}`);

};
