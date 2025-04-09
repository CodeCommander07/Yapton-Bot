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
  customId: "SuggestDeny",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const embed = await interaction.message.embeds[0];
    const channel = await interaction.guild.channels.cache.get(
      "751888415557156865"
    );
    const messages = await channel.messages.fetch({ limit: 5 });
    messages.forEach(async (m) => {
      if (m.embeds[0].fields[0].value === embed.fields[0].value) {
        await m.delete();
      }
    });

    embed.fields[1].value = `\`Denied\` - ${interaction.user}`;
    const exampleEmbed = await EmbedBuilder.from(embed)
      .setColor(mConfig.embedColorError)
      .setTitle("Suggestion Denied");

    if (!embed.author.name.includes("Website - ")) {
      await interaction.update({
        embeds: [exampleEmbed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("overideReport")
              .setLabel("Overide")
              .setStyle(ButtonStyle.Primary)
          ),
        ],
      });

      const username = embed.author.name;
      const members = await interaction.guild.members.fetch();

      const member = members.find((u) => u.user.username === username);

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setDisabled(true)
          .setLabel(`Sent from: ${interaction.guild.name}`)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("---")
      );
      try {
        member.send({
          content: `>>> **Your Suggestion**\n\n${embed.description}\n\nHas been denied\n-# Suggestion ID: ${embed.fields[0].value}\n-# Terms and service apply.`,
          components: [button],
        });
      } catch {}
    } else {
      const webhook = new WebhookClient({
        url: "https://discord.com/api/webhooks/1321852498985746553/2a4fCB6p_UoGHkDKNTUiO1h8UvqxrmorQt6nOmW2nGWiW4--62DRk7PJf46-ArX4a5YG",
      });
      webhook.editMessage(interaction.message.id, {
        embeds: [exampleEmbed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("overideReport")
              .setLabel("Overide")
              .setStyle(ButtonStyle.Primary)
          ),
        ],
      });
    }
  },
};
