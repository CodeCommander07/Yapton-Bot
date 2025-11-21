const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const moderationSchema = require("../../Schemas/moderation");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user your want to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for banning this user.")
        .setRequired(true)
    ),
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  run: async (client, interaction) => {
    const { guild, guildId } = interaction;
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    const member = interaction.guild.members.cache.get(user.id);

    await member.ban({
      reason: `${reason}`,
      deleteMessageSeconds: 60 * 60 * 24 * 7,
    });

    let dataGD = await moderationSchema.findOne({ GuildID: guildId });
    const { LogChannelID } = dataGD;
    const loggingChannel = guild.channels.cache.get(LogChannelID);

    const lEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorWarning)
      .setTitle("`❌` User banned")
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `\`💡\` To unban ${member.user.username}, use \`/unban ${member.user.id}\` to revoke this ban.`
      )
      .addFields(
        { name: "Banned by", value: `<@${user.id}>`, inline: true },
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
