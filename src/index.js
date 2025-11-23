require("dotenv/config");

const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const handleCommands = require("./functions/handelCommands");
const { errorHandler } = require("./utils/errorHandler");

var cron = require("node-cron");

require("./tasks/weeklyReport")

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildPresences
  ],
});

handleCommands(client)
eventHandler(client);
errorHandler(client);

client.login(process.env.TOKEN);