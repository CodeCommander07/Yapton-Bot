const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const mailData = require("../Schemas/mail");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId === "closeMMThread") {
      await interaction.channel.delete();
    }
  },
};
