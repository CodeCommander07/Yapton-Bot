const { EmbedBuilder } = require("discord.js");
const mailData = require("../Schemas/mail");

module.exports = {
  name: "channelDelete",
  async execute(channel, client) {
    const mData = await mailData.findOne({ channelId: channel.id });
    if (mData) {
      const member = await channel.guild.members.cache.get(mData.userId);
      member.send({
        embeds: [
          new EmbedBuilder().setColor(`DarkRed`).setDescription(
            `>>> Thank you for contacting Administrate Support.  

Your ticket will be closed by the assigned agent. If you have further questions, feel free to open a new ticket.

Best,
Administrate Support`
          ),
          new EmbedBuilder()
            .setColor(`DarkRed`)
            .setDescription(`>>> Send a mesasge here to create a new ticket.`),
        ],
      });
    }
    await mData.deleteOne();
  },
};
