require("dotenv/config");

const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const handleCommands = require("./functions/handelCommands");
const { errorHandler } = require("./utils/errorHandler");

var cron = require("node-cron");

const generateWeeklyReport = require("./tasks/weeklyReport")

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
cron.schedule('0 0 * * 0', generateWeeklyReport);

client.login(process.env.TOKEN);