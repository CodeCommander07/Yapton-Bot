const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick a user from the server.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user your want to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for kicking this user.")
        .setRequired(true)
    ),
  userPermissions: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  run: async (client, interaction) => {
    const { guild, guildId } = interaction;
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    const member = interaction.guild.members.cache.get(user.id);

    await member.kick({ reason: `${reason}` });

    let dataGD = await moderationSchema.findOne({ GuildID: guildId });
    const { LogChannelID } = dataGD;
    const loggingChannel = guild.channels.cache.get(LogChannelID);

    const lEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorWarning)
      .setTitle("`❌` User Kicked")
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        { name: "Kicked by", value: `<@${user.id}>`, inline: true },
        { name: "Reason", value: `${reason}`, inline: true }
      )
      .setFooter({
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
        text: `${client.user.username} - Logging system`,
      });

    loggingChannel.send({ embeds: [lEmbed] });

    interaction.reply({ embeds: [lEmbed], ephemeral: true });
  },
};
