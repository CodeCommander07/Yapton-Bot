const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActivityType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  WebhookClient,
} = require("discord.js");
const mongoose = require("mongoose"); //npm i mongoose
const mongodbURL = process.env.MONGODBURL;
const logger = require("../logger");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    logger.info("client", `Logged into ${client.user.username} successfully.`);

    if (!mongodbURL) return;

    mongoose.set("strictQuery", false);

    await mongoose.connect(mongodbURL || "", {
      //keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (mongoose.connect) {
      mongoose.set("strictQuery", true);
      logger.info("database", "MongoDB connected successfully.");
    }
    await client.user.setActivity("Direct message me if you need help", {
      type: ActivityType.Custom,
    });

    // const webhook = new WebhookClient({
    //   url: "https://discord.com/api/webhooks/1342438589920710796/_gYSFoHF2yD4QlVfzoUmCDEUPQewAMd8Rduv8_bdA33OM4uXY_pgoqrdZyHJ_qGHwT2T",
    // });
    // webhook.send({
    //   embeds: [
    //     new EmbedBuilder()
    //       .setColor("#0c190c")
    //       .setDescription(
    //         `Welcome to Administrate Support\n\nYou can open a ticket by either messaging the bot or mentioning the bot.`
    //       )
    //       .setFooter({
    //         text: "CodeCmdr Dev • Last Updated",
    //         iconURL: client.user.displayAvatarURL(),
    //       }).setTimestamp(),
    //   ],
    // });
  },
};
