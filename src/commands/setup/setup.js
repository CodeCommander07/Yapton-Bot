const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

const setupData = require("../../Schemas/setup");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure the modmail system")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addSubcommand((s) =>
      s
        .setName("system")
        .setDescription("Configure wether or not to accept tickets")
        .addChannelOption((o) =>
          o
            .setName("category")
            .setDescription("Thread Category")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption((o) =>
          o.setName("support").setDescription("support role").setRequired(true)
        )
    ),
  async execute(i) {
    const data = await setupData.findOne({ guildId: i.guild.id });
    if (!data) {
      await setupData.create({
        guildId: i.guild.id,
        categoryId: i.options.getChannel("category").id,
        supportId: i.options.getRole("support").id,
      });
    } else {
      (data.categoryId = i.options.getChannel("category").id),
        (data.supportId = i.options.getRole("support").id);

      await data.save();
    }
    i.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Aqua")
          .setDescription(
            `> **Active:** Yes\n> **Category:** ${i.options.getChannel(
              "category"
            )}\n> **Support Role:** ${i.options.getRole("support")}\n`
          ),
      ],
    });
  },
};
