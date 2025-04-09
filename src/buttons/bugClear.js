const {
  PermissionFlagsBits,
  EmbedBuilder,
  WebhookClient,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const mConfig = require("../messageConfig.json");

module.exports = {
  customId: "bugClear",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    if (
      interaction.member.roles.cache.has("1026604352057643039") ||
      interaction.member.roles.cache.has("733621541262327838") ||
      interaction.member.roles.cache.has("883300603281956895") ||
      interaction.member.roles.cache.has("733621685412036660")
    ) {
      const thread = interaction.channel;
      const msg = await thread.fetchStarterMessage();
      await msg.delete();
      await thread.delete();
    } else {
      interaction.reply({
        content: `Yeah, you can't do that.`,
        ephemeral: true,
      });
    }
  },
};
