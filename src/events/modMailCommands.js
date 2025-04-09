const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
    if (
      message.content.startsWith("?hello") ||
      message.content.startsWith("?welcome")
    ) {
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setDescription(
              `>>> Thank you for contacting Administrate Support.  

Please provide as much detail as possible so we can assign an agent to assist you.`
            )
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.member.displayAvatarURL(),
            }),
        ],
      });
      await message.guild.members.cache.get(mData.userId).send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `>>> Thank you for contacting Administrate Support.  

Please provide as much detail as possible so we can assign an agent to assist you.`
            )
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.member.displayAvatarURL(),
            }),
        ],
      });
      await message.delete();
    }
    if (message.content.startsWith("?partnership")) {
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setDescription(
              `Hello and welcome to Administrate! We appreciate your interest in establishing a partnership with us. Below, you will find our requirements;

> @ Everyone - 70+ members
> @ Here - 40+ members
> @ No one - 20+ members`
            )
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.member.displayAvatarURL(),
            }),
        ],
      });
      await message.guild.members.cache.get(mData.userId).send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `Hello and welcome to Administrate! We appreciate your interest in establishing a partnership with us. Below, you will find our requirements;

> @ Everyone - 70+ members
> @ Here - 40+ members
> @ No one - 20+ members`
            )
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.member.displayAvatarURL(),
            }),
        ],
      });
      await message.delete();
    }
    if (
      message.content.startsWith("?close") ||
      message.content.startsWith("?goodbye")
    ) {
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setDescription(
              `>>> Thank you for contacting Administrate Support.  

Your ticket will be closed by the assigned agent. If you have further questions, feel free to open a new ticket.

Best,
Administrate Support`
            )
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.member.displayAvatarURL(),
            }),
        ],
      });
      await message.guild.members.cache.get(mData.userId).send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `>>> Thank you for contacting Administrate Support.  

Your ticket will be closed by the assigned agent. If you have further questions, feel free to open a new ticket.

Best,
Administrate Support`
            )
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.member.displayAvatarURL(),
            }),
        ],
      });
      await message.delete();
    }
    if (message.content.startsWith("?inactive")) {
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setDescription(
              `>>> This ticket has been deemed as **inactive**, and will close at <t:${Math.floor(
                (message.createdTimestamp + 86400000) / 1000
              )}:f>`
            )
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.member.displayAvatarURL(),
            }),
        ],
      });
      mData.inactive = await Math.floor(
        (message.createdTimestamp + 86400000) / 1000
      );
      await message.guild.members.cache.get(mData.userId).send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `>>> This ticket has been deemed as **inactive**, and will close at <t:${Math.floor(
                (message.createdTimestamp + 86400000) / 1000
              )}:f>`
            )
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.member.displayAvatarURL(),
            }),
        ],
      });
      await message.delete();
    }
    if (message.content.startsWith("?sub")) {
      mData.subs = message.author.id;
      mData.save();
      await message.reply({
        content: `I will notify you when a new message appears,`,
      });
      await message.delete();
    }
  },
};
