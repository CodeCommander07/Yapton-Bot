const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const logger = require("../logger");

const clientId = "1278725795195519079";
const guildId = "YOUR GUILD ID";

module.exports = (client) => {
  client.handleCommands = async (commandFolders, path) => {
    client.commandArray = [];
    for (folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }

    const rest = new REST({
      version: "9",
    }).setToken(process.env.token);

    (async () => {
      try {
        await console.clear();
        logger.warn(
          "commands",
          `Started registering ${client.commands.size} application (/) commands.`
        );

        await rest.put(Routes.applicationCommands(clientId), {
          body: client.commandArray,
        });
        logger.warn(
          "commands",
          `Successfully registered & started pushing ${client.commands.size} application (/) commands.`
        );
        logger.warn(
          "commands",
          `Successfully registered & pushed ${client.commands.size} application (/) commands.`
        );
      } catch (error) {
        logger.error("commands", `${error}`);
      }
    })();
  };
};
