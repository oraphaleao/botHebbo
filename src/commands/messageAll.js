module.exports = {
    name: "enviarmensagem",
    async execute(message, args, client) {

        if (!args.length) {
            return message.reply({content: "Por favor, forneça uma mensagem para enviar.", ephemeral: true});
        }

        const mensagem = args.join(" ");

        try {
            await message.delete();

            await message.channel.send(mensagem);
        } catch (error) {
            console.error("Erro ao enviar a mensagem:", error);
            message.reply({content: "Não consegui enviar a mensagem.", ephemeral: true});
        }
    },
};
