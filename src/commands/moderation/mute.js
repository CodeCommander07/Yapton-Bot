const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation");
const mConfig = require("../../messageConfig.json");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user from the server.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user your want to mute.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for muting this user.")
        .setRequired(true)
    ),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  run: async (client, interaction) => {
    const { guild, guildId } = interaction;
    const user = interaction.options.getMember("target");
    const member = guild.members.cache.get(user.id);
    const reason = interaction.options.getString("reason");

    const errEmbed = new EmbedBuilder().setColor(mConfig.embedColorError);

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        embeds: [errEmbed.setDescription(mConfig.hasHigherRolePosition)],
        ephemeral: true,
      });

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers
      )
    )
      return interaction.reply({
        embeds: [errEmbed.setDescription(mConfig.botNoPermissions)],
        ephemeral: true,
      });

    await member.timeout(3_600_000);

    let dataGD = await moderationSchema.findOne({ GuildID: guildId });
    const { LogChannelID } = dataGD;
    const loggingChannel = guild.channels.cache.get(LogChannelID);

    const lEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorWarning)
      .setTitle("`❌` User Timedout")
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        { name: "Timedout by", value: `<@${member.id}>`, inline: true },
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
