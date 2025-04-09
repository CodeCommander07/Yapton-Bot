const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  WebhookClient,
} = require("discord.js");
const mConfig = require("../messageConfig.json");

module.exports = {
  customId: "overideReport",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    if (
      interaction.member.roles.cache.has("1026604352057643039") ||
      interaction.member.roles.cache.has("733621541262327838") ||
      interaction.member.roles.cache.has("883300603281956895") ||
      interaction.member.roles.cache.has("733621685412036660")
    ) {
      if (interaction.message.embeds[0].fields[0].value.includes("SUS")) {
        interaction.update({
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("SuggestAccept")
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("SuggestDeny")
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger)
            ),
          ],
        });
      } else if (
        interaction.message.embeds[0].fields[0].value.includes("BUG")
      ) {
        interaction.update({
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("bugAccept")
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("bugDeny")
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger)
            ),
          ],
        });
      }
    } else {
      interaction.reply({
        content: `Yeah, you can't do that.`,
        ephemeral: true,
      });
    }
  },
};
