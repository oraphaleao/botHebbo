const config = require("../config");
const database = require("../utils/database");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const role = member.guild.roles.cache.get(config.roleId);
        if (role) {
            await member.roles.add(role);
            console.log(`✅ Adicionado cargo para ${member.user.tag}`);
        }
        
        // Atualiza o contador de membros na categoria
        const totalMembers = member.guild.memberCount;
        const category = member.guild.channels.cache.get(config.usersCountId); // ID da categoria onde o contador estará

        if (category) {
            // Atualiza o nome da categoria para refletir o número de membros
            category.setName(`👥️ Membros: ${totalMembers}`)
                .then(() => {
                    console.log(`✅ Categoria de membros atualizada para: Membros: ${totalMembers}`);
                })
                .catch(err => console.error('Erro ao atualizar o nome da categoria:', err));
        } else {
            console.log('Categoria não encontrada.');
        }

        // Canal de log para o novo membro (opcional)
        const logChannel = member.guild.channels.cache.get(config.logChannelId);
        if (logChannel) {
            const embedLog = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("🟢 Novo Membro Entrou")
            .setDescription(`📌 **Usuário:** ${member.user.tag} \n🆔 **ID:** ${member.id} \n📅 **Entrou em:** <t:${Math.floor(Date.now() / 1000)}:F>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Servidor: ${member.guild.name}`, iconURL: member.guild.iconURL() });
      
            logChannel.send({ embeds: [embedLog] });
        }
    },
};