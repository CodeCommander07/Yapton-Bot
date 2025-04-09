const { Schema, model } = require("mongoose");

const mailSchema = new Schema({
  userId: String,
  subs: String,
  active: Boolean,
  channelId: String,
  inactive: String,
});

module.exports = model("mailData", mailSchema);
