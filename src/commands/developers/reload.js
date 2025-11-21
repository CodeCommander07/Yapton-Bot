const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActivityType,
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Special command. If you know you know what its for"),
  userPermissions: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],
  devOnly: true,
  /**
   * @param { Client } client
   * @param { ChatInputCommandInteraction } interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    try {
        await axios.post("http://server.flatstudios.net/webhook/live")
        await interaction.editReply("Reload signal sent successfully.");
    } catch (error) {
        console.error("Error sending reload signal:", error);
        await interaction.editReply("Failed to send reload signal.");
    }
  },
};
