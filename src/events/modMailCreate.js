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
const logger = require("../logger");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.channel.type !== ChannelType.DM) {
      if (message.content === `<@1278725795195519079>`) {
        const mData = await mailData.findOne({ userId: message.author.id });
        if (mData) return;
        const sData = await setupData.findOne({
          guildId: message.guild.id,
        });
        const channel = await message.guild.channels.create({
          name: `modmail-${message.author.username}`,
          parent: sData.categoryId,
          permissionOverwrites: [
            {
              id: sData.supportId,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
            {
              id: "1342191569389752320",
              deny: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });
        channel
          .send({
            embeds: [
              new EmbedBuilder()
                .setColor(`Blue`)
                .setDescription(
                  `New modmail thread created by **${
                    message.author.username
                  }** at <t:${Math.floor(message.createdTimestamp / 1000)}:f>`
                ),
              new EmbedBuilder()
                .setColor(`Yellow`)
                .setAuthor({
                  name: `${message.author.username} sent:`,
                  iconURL: message.author.displayAvatarURL(),
                })
                .setDescription(
                  `${
                    message.content.length > 0
                      ? `>>> ${message.content}`
                      : "\u200b"
                  }`
                )
                .setImage(
                  message.attachments.first()
                    ? message.attachments.first().url
                    : null
                ),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("closeMMThread")
                  .setLabel("Close Thread")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          })
          .then((msg) => {
            msg.pin();
          });
        await mailData.create({
          userId: message.author.id,
          active: true,
          channelId: channel.id,
        });
        await message.author.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Orange")
              .setDescription(
                `>>> Thank you for contacting Administrate Support.  

Please provide as much detail as possible so we can assign an agent to assist you.

If you need to send images or videos please send them individually!`
              )
              .setFooter({
                text: "This is an automated message",
                iconURL: client.user.displayAvatarURL(),
              }),
          ],
        });
      }
    }
  },
};
