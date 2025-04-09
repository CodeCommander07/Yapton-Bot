const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

const setupData = require("../Schemas/setup");
const mailData = require("../Schemas/mail");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!message.guild) return;
    if (!message.channel.parentId) return;
    if (message.author.bot) return;
    const sData = await setupData.findOne({ guildId: message.guild.id });
    if (message.channel.parentId !== sData.categoryId) return;
    const mData = await mailData.findOne({
      channelId: message.channel.id,
    });

    const member = await message.guild.members.cache.get(mData.userId);
    if (
      message.content.startsWith("?reply") ||
      message.content.startsWith("?r")
    ) {
      const content = await message.content.split(" ").splice(1).join(" ");
      if (content) {
        if (!content[0].match(/[a-zA-Z0-9]/)) return;
      }
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${message.author.username} sent:`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(`${content.length > 0 ? `>>> ${content}` : "\u200b"}`)
        .setImage(
          message.attachments.first() ? message.attachments.first().url : null
        );
      await message.channel.send({ embeds: [embed.setColor("Green")] });
      await member.send({ embeds: [embed.setColor("Yellow")] });
      await message.delete();
    }
  },
};
