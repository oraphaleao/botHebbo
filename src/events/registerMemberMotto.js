// src/events/register.js (Evento de autenticação de usuário)
require("dotenv").config();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const database = require("../utils/database");
const config = require("../config.js");

const tokenStore = new Map(); // Usando Map para armazenar tokens na memória

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        // Verificar se é uma interação de botão
        if (!interaction.isButton()) return;

        const { customId, user, guild } = interaction;

        // Verifica se a interação é no canal correto
        if (interaction.channel.id !== config.registreseId) return;

        // Adiar a interação, garantindo que o Discord saiba que está sendo processado
        await interaction.deferUpdate();

        if (customId === "start_auth") {
            const token = Math.random().toString(25).substring(2, 10).toUpperCase();
            tokenStore.set(user.id, token); // Armazenando token na memória

            const authButton = new ButtonBuilder()
                .setCustomId("verify_auth")
                .setLabel("Autenticar Token")
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(authButton);

            // Enviar mensagem no canal com o botão (sussurrada)
            await interaction.followUp({
                content: `Seu token de autenticação: **${token}**. Clique no botão abaixo para autenticar.`,
                components: [row],
                ephemeral: true // Mensagem visível apenas para o usuário que clicou
            });
        }

        if (customId === "verify_auth") {
            const storedToken = tokenStore.get(user.id); // Recuperando token da memória
        
            // Verificar se o token armazenado na memória é válido no banco de dados
            const userData = await database.verifyMotto(storedToken); // Verificar diretamente pelo motto (token)
        
            if (!userData) {
                return interaction.followUp({ content: "❌ Token inválido!", ephemeral: true });
            }
        
            const member = await guild.members.fetch(user.id);
        
            // Remover o cargo REGISTRAR_ID, se presente
            const registrarRole = guild.roles.cache.get(config.registrarId); // Supondo que registrarId esteja no config.js
            if (registrarRole && member.roles.cache.has(registrarRole.id)) {
                await member.roles.remove(registrarRole);
            }
        
            // Adicionar o cargo USUARIO_ID
            const usuarioRole = guild.roles.cache.get(config.usuarioId);
            if (usuarioRole) {
                await member.roles.add(usuarioRole);
            }
        
            const botMember = await guild.members.fetch(guild.client.user.id);
        
            // Verificar se o bot tem permissão para gerenciar apelidos
            if (!botMember.permissions.has("MANAGE_NICKNAMES")) {
                return interaction.followUp({ content: "❌ Não tenho permissão para alterar apelidos!" });
            }
        
            // Verificar a hierarquia de cargos
            if (botMember.roles.highest.position <= member.roles.highest.position) {
                return interaction.followUp({ content: "❌ Meu cargo está abaixo ou no mesmo nível do cargo desse membro, não posso alterar seu apelido." });
            }
        
            // Se o nome de usuário foi encontrado, mudar o apelido do usuário
            if (userData.username) {
                try {
                    await member.setNickname(userData.username);
                    return interaction.followUp({ content: "✅ Apelido alterado com sucesso!", ephemeral: true });
                } catch (error) {
                    console.error("Erro ao tentar alterar o apelido:", error);
                    return interaction.followUp({ content: "❌ Não foi possível alterar o apelido.", ephemeral: true });
                }
            }
        
            // Remover o token da memória após autenticação bem-sucedida
            tokenStore.delete(user.id);
        
            return interaction.followUp({ content: "✅ Autenticação bem-sucedida!", ephemeral: true });
        }
        
    },
};
