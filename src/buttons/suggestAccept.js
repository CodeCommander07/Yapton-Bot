const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  WebhookClient
} = require("discord.js");
const mConfig = require("../messageConfig.json");

module.exports = {
  customId: "SuggestAccept",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const embed = await interaction.message.embeds[0];

    embed.fields[1].value = `\`Accepted\` - ${interaction.user}`;
    const exampleEmbed = await EmbedBuilder.from(embed)
      .setColor(mConfig.embedColorSuccess)
      .setTitle("Suggestion Accepted");

    const channel = await interaction.guild.channels.cache.get(
      "751888415557156865"
    );

    const newEmbed = EmbedBuilder.from(embed)
      .setColor(mConfig.embedColorSuccess)
      .setTitle("Suggestion")
      .setFields(embed.fields[0]);

    const message = await channel.send({ embeds: [newEmbed] });

    if (!embed.author.name.includes("Website - ")) {
      await interaction.update({
        embeds: [exampleEmbed],
        components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("overideReport").setLabel("Overide").setStyle(ButtonStyle.Primary))]
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
          .setLabel(`Suggestion`)
          .setStyle(ButtonStyle.Link)
          .setURL(message.url)
      );
      try { member.send({ content: `>>> **Your suggestion**\n\n${embed.description}\n\nHas been accepted\n-# Suggestion ID: ${embed.fields[0].value}\n-# Terms and service apply.`, components: [button] }) } catch { }
    } else {
      const webhook = new WebhookClient({
        url: "https://discord.com/api/webhooks/1321852498985746553/2a4fCB6p_UoGHkDKNTUiO1h8UvqxrmorQt6nOmW2nGWiW4--62DRk7PJf46-ArX4a5YG"
      })
      webhook.editMessage(interaction.message.id, {
        embeds: [exampleEmbed],
        components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("overideReport").setLabel("Overide").setStyle(ButtonStyle.Primary))]
      })
    }

    await message.react("<:tick:839879354976829441>");
    await message.react("<:pending:839879341605257217>");
    await message.react("<:cross:839879325481304074>");


  },
};
