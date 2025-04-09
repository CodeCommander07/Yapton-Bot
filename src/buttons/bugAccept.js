const {
  PermissionFlagsBits,
  WebhookClient,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  ThreadAutoArchiveDuration,
} = require("discord.js");
const mConfig = require("../messageConfig.json");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  customId: "bugAccept",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const embed = interaction.message.embeds[0];

    embed.fields[1].value = `\`Accepted\` - ${interaction.user}`;
    const exampleEmbed = EmbedBuilder.from(embed)
      .setColor(mConfig.embedColorSuccess)
      .setTitle("Bug Report Accepted");

    const channel = interaction.guild.channels.cache.get("1240980509270610000");

    const newEmbed = EmbedBuilder.from(embed)
      .setColor(mConfig.embedColorSuccess)
      .setTitle("Bug Report")
      .setFields(embed.fields[0]);

    const message = await channel.send({ embeds: [newEmbed] });

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
          .setCustomId("---"),
        new ButtonBuilder()
          .setLabel(`Bug Report`)
          .setStyle(ButtonStyle.Link)
          .setURL(message.url)
      );
      try {
        member.send({
          content: `>>> **Bug Report**\n\n${embed.description}\n\nHas been accepted\n-# Bug Report ID: ${embed.fields[0].value}\n-# Terms and service apply.`,
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
              .setStyle(ButtonStyle.Secondary)
          ),
        ],
      });
    }

    const thread = await message.startThread({
      name: `Bug Report - ${message.id}`,
      autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
      reason:
        "To discuss updates on the report & if other people are experiencing the same bug",
    });

    await thread.join();
    thread.sendTyping();
    await wait(3000);

    thread.send({
      content:
        "If you experience this bug, please let us know here.\n\nWe will also post updates about the bug here.",
    });

    thread.send({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("bugClear")
            .setLabel("Close Report")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });
  },
};
