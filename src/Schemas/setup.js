const { Schema, model } = require("mongoose");

const setupSchema = new Schema({
  guildId: String,
  categoryId: String,
  active: Boolean,
  supportId: String,
});

module.exports = model("setupData", setupSchema);
