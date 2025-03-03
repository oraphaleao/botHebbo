require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

class DiscordBot {
  constructor(token) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
      ],
    });
    this.token = token;
  }

  loadEvents() {
    // Evento quando o bot está pronto
    this.client.once("ready", () => {
      console.log(`🤖 Bot está online como ${this.client.user.tag}`);
    });

    // Evento quando um novo usuário entra
    this.client.on("guildMemberAdd", async (member) => {
        const roleId = "1337204793189470288"; // 🔹 Substitua pelo ID do cargo
        
        const role = member.guild.roles.cache.get(roleId);
      
        if (role) {
          try {
            await member.roles.add(role);
            console.log(`✅ Cargo "${role.name}" adicionado a ${member.user.tag}`);
          } catch (error) {
            console.error(`❌ Erro ao adicionar cargo:`, error);
          }
        } else {
          console.log(`⚠️ Cargo com ID "${roleId}" não encontrado. Verifique se o bot tem permissão.`);
        }
      });

      this.client.on("guildMemberAdd", async (member) => {
        const logChannelId = "1337209456018194452"; // 🔹 Substitua pelo ID do canal de logs
        const logChannel = member.guild.channels.cache.get(logChannelId);
      
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("🟢 Novo Membro Entrou")
            .setDescription(`📌 **Usuário:** ${member.user.tag} \n🆔 **ID:** ${member.id} \n📅 **Entrou em:** <t:${Math.floor(Date.now() / 1000)}:F>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Servidor: ${member.guild.name}`, iconURL: member.guild.iconURL() });
      
          logChannel.send({ embeds: [embed] });
        }
      });
      
      this.client.on("guildMemberRemove", async (member) => {
        const logChannelId = "1337209456018194452"; // 🔹 Substitua pelo ID do canal de logs
        const logChannel = member.guild.channels.cache.get(logChannelId);
      
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🔴 Membro Saiu")
            .setDescription(`📌 **Usuário:** ${member.user.tag} \n🆔 **ID:** ${member.id} \n📅 **Saiu em:** <t:${Math.floor(Date.now() / 1000)}:F>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Servidor: ${member.guild.name}`, iconURL: member.guild.iconURL() });
      
          logChannel.send({ embeds: [embed] });
        }
      });
  }

  start() {
    this.loadEvents();
    this.client.login(this.token);
  }
}

module.exports = DiscordBot;
