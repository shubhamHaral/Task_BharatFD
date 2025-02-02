const express = require("express");
const { getFAQs, createFAQ } = require("../controllers/faqController");
const router = express.Router();

router.get("/faqs", getFAQs);
router.post("/faqs", createFAQ);

module.exports = router;
