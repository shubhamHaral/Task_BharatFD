const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  translations: Object,
});

module.exports = mongoose.model("FAQ", faqSchema);
