const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const faqRoutes = require("./routes/faqRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api", faqRoutes);

module.exports = app;
