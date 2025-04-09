const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const stringifyLanguage = require("../../utils/stringifyLanguage");
const translate = require("@iamtraction/google-translate");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate some text into a different language.")
    .addStringOption((o) =>
      o
        .setName("messasge-id")
        .setDescription("The message ID of the message you want to translate.")
    )
    .addStringOption((o) =>
      o.setName("message").setDescription("The message you want to translate.")
    )
    .addStringOption((o) =>
      o
        .setName("language")
        .setDescription("The language you want to translate the message to.")
        .addChoices(
          { name: "English", value: "en" },
          { name: "German", value: "de" },
          { name: "French", value: "fr" },
          { name: "Spanish", value: "es" },
          { name: "Italian", value: "it" },
          { name: "Japanese", value: "ja" },
          { name: "Korean", value: "ko" },
          { name: "Portuguese", value: "pt" },
          { name: "Russian", value: "ru" },
          { name: "Chinese", value: "zh" },
          { name: "Arabic", value: "ar" },
          { name: "Bengali", value: "bn" },
          { name: "Dutch", value: "nl" },
          { name: "Finnish", value: "fi" },
          { name: "Greek", value: "el" },
          { name: "Hindi", value: "hi" },
          { name: "Indonesian", value: "id" },
          { name: "Malay", value: "ms" },
          { name: "Norwegian", value: "no" },
          { name: "Polish", value: "pl" },
          { name: "Swedish", value: "sv" },
          { name: "Thai", value: "th" },
          { name: "Turkish", value: "tr" },
          { name: "Vietnamese", value: "vi" },
          { name: "Welsh", value: "cy" }
        )
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    let message = "";
    await interaction.deferReply({ ephemeral: true });

    const rEmbed = new EmbedBuilder().setColor("White").setFooter({
      text: `${client.user.username} - Translate System`,
      iconURL: client.user.displayAvatarURL(),
    });

    const { options } = interaction;
    const messageID = options.getString("message-id");
    if (messageID) {
      message = await interaction.channel.messages.fetch(messageID);
    } else if (!messageID) {
      message = options.getString("message");
    }

    if (!message || message === "") {
      return interaction.editReply({
        embeds: [
          rEmbed.setDescription("You need to provide a message to translate."),
        ],
      });
    }
    const language = options.getString("language") || "en";

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
            inline: true,
          },

          {
            name: `Translated Language`,
            value: `${translatedLanguage}`,
            inline: true,
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
