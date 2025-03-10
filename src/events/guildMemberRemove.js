const config = require("../config");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    execute(member) {
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

        const logChannel = member.guild.channels.cache.get(config.logChannelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🔴 Membro Saiu")
            .setDescription(`📌 **Usuário:** ${member.user.tag} \n🆔 **ID:** ${member.id} \n📅 **Saiu em:** <t:${Math.floor(Date.now() / 1000)}:F>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Servidor: ${member.guild.name}`, iconURL: member.guild.iconURL() });
      
          logChannel.send({ embeds: [embed] });
        }
    },
};