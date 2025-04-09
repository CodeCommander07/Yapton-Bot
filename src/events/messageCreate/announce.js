const {
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return;
  if (
    message.member.roles.cache.has("1026604352057643039") ||
    message.member.roles.cache.has("733621541262327838") ||
    message.member.roles.cache.has("883300603281956895") ||
    message.member.roles.cache.has("733621685412036660")
  ) {
    const content = message.content;
    const args = content.split(" ");

    if (args[0].toLowerCase() === "?announce") {
      args.shift();

      const files = message.attachments.map(
        (attachment) => new AttachmentBuilder(attachment.url)
      );
      await message.channel.send({
        content: args.join(" "),
        files,
      });
      message.delete();
    }
  }
};
