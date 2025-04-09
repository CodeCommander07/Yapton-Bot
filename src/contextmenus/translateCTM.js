const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  Client,
  MessageContextMenuCommandInteraction,
} = require("discord.js");
const stringifyLanguage = require("../utils/stringifyLanguage");
const translate = require("@iamtraction/google-translate");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Translate")
    .setType(ApplicationCommandType.Message),
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param {Client} client
   * @param {MessageContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const rEmbed = new EmbedBuilder().setColor("White").setFooter({
      text: `${client.user.username} - Translate System`,
      iconURL: client.user.displayAvatarURL(),
    });

    const { targetMessage } = interaction;

    const message = targetMessage.content;
    if (!message) {
      return interaction.editReply({
        embeds: [
          rEmbed
            .setDescription("You need to provide a message to translate.")
            .setColor("Red"),
        ],
      });
    }

    const language = "en";

    const languageName = stringifyLanguage(language);

    translate(message, { to: language }).then((res) => {
      originalLanguage = stringifyLanguage(res.from.language.iso);
      translatedLanguage = languageName;

      rEmbed
        .addFields(
          { name: `Original Message`, value: `${message}` },
          {
            name: `Translated Message`,
            value: `${res.text}`,
          },
          {
            name: `Original Language`,
            value: `${originalLanguage}`,
          },

          {
            name: `Translated Language`,
            value: `${translatedLanguage}`,
          }
        )
        .setTimestamp()
        .setThumbnail(
          `https://flagcdn.com/h240/${language}.png`
            .replace("en", "gb")
            .replace("zh", "cn")
            .replace("ko", "kr")
        );

      interaction.editReply({ embeds: [rEmbed] });
    });
  },
};
