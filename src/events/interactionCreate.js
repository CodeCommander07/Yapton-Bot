const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.run(client, interaction);
      }

      // ✅ Autocomplete support
      else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        console.log(`[EVENT] Autocomplete triggered for /${interaction.commandName}`);
        const command = client.commands.get(interaction.commandName);
        if (!command?.autocomplete) return;
        await command.autocomplete(interaction);
      }
    } catch (err) {
      console.error("[Interaction Error]", err);
      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ Error while executing interaction.",
          ephemeral: true,
        });
      }
    }
  },
};
