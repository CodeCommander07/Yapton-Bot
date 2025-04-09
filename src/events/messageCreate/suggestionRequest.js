const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return;

  if (message.channel.id === "1318344792085762148") {
    const content = message.content;
    const args = content.split(" ");
    if (args[0] === ".suggest") {
      args.shift();
      const attachment = message.attachments.first();
      const url = attachment ? attachment.url : null;
      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(args.join(" "))
        .setColor(mConfig.embedColorWarning)
        .addFields({ name: "Suggestion ID:", value: `SUS-${generateRandomString(5)}` })
        .setFooter({
          text: mConfig.footerText,
          iconURL: client.user.displayAvatarURL(),
        })
        .setImage(url);

      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("SuggestAccept")
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("SuggestDeny")
          .setLabel("Deny")
          .setStyle(ButtonStyle.Danger)
      );
      const channel = message.guild.channels.cache.get("1231338002618388522");
      const msg = message.reply({ content: `Suggestion confirmation sent.`, embeds: [embed.setTitle("Suggestion")] });
      channel.send({
        embeds: [
          embed
            .setTitle("Suggestion Verification")
            .addFields({ name: "Status", value: "Pending" }),
        ],
        components: [buttonRow],
      });
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setDisabled(true)
          .setLabel(`Sent from: ${message.guild.name}`)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("---")
      );
      message.author.send({ content: `>>> Suggestion request Sent \nID: ${msg.embeds[0].fields[0].value}\n-# Terms and service apply.`, components: [button] })
    } else {
      //   const button = new ActionRowBuilder().addComponents(
      //     new ButtonBuilder()
      //       .setDisabled(true)
      //       .setLabel(`Sent from: ${message.guild.name}`)
      //       .setStyle(ButtonStyle.Secondary)
      //       .setCustomId("---")
      //   );
      //   await message.author.send({
      //     content:
      //       "Please make sure you have put `.suggest` infront of your suggestion in <#741390705942855701>",
      //     components: [button],
      //   });
      //   await message.delete();
    }
  }
};
