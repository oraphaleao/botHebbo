const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "ready",
    async execute(client) {
        const channelId = "1337206240865947782"; // ID do canal específico
        const channel = await client.channels.fetch(channelId);

        if (!channel) {
            console.log("Canal não encontrado!");
            return;
        }

        // Tentar encontrar uma mensagem com um botão de autenticação no canal
        const messages = await channel.messages.fetch({ limit: 100 }); // Buscar até 100 mensagens anteriores
        let authMessage = messages.find(msg => msg.content.includes("Clique no botão abaixo para iniciar a autenticação"));

        // Se a mensagem com o botão não existir, enviar uma nova
        if (!authMessage) {
            // Criar o botão de autenticação
            const authButton = new ButtonBuilder()
                .setCustomId("start_auth")
                .setLabel("Iniciar Autenticação")
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(authButton);

            // Enviar nova mensagem com o botão
            await channel.send({
                content: "Clique no botão abaixo para iniciar a autenticação!",
                components: [row],
            });

            console.log("Nova mensagem de autenticação enviada.");
        } else {
            console.log("Mensagem de autenticação já existe.");
        }

        console.log(`🤖 Bot ${client.user.tag} está online!`);
    },
};
