const { REST, Routes } = require("discord.js");
const fs = require("fs");
const logger = require("../logger"); // optional, keep your logging
require("dotenv").config();

const clientId = "1278725795195519079"; // your bot’s Application ID
const guildId = process.env.GUILD_ID || "YOUR_GUILD_ID"; // optional for per-guild

module.exports = (client) => {
  client.handleCommands = async (commandFolders, basePath) => {
    client.commands = new Map();
    client.commandArray = [];

    for (const folder of commandFolders) {
      const commandsPath = `${basePath}/${folder}`;
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);

        if (!command?.data) {
          logger?.warn?.("commands", `⚠️ Skipped ${file} — missing "data".`);
          continue;
        }

        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
        logger?.warn?.(
          "commands",
          `✅ Loaded command: /${command.data.name}`
        );
      }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
      console.clear();
      logger?.warn?.(
        "commands",
        `🔄 Registering ${client.commands.size} slash commands...`
      );

      // Register globally (takes up to 1h to propagate)
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });

      // ⚡ For instant testing, register per-guild (comment out if not needed)
      // await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      //   body: client.commandArray,
      // });

      logger?.warn?.(
        "commands",
        `✅ Successfully registered ${client.commands.size} slash commands.`
      );
    } catch (err) {
      logger?.error?.("commands", err);
      console.error(err);
    }
  };
};
