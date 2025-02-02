const FAQ = require("../models/FAQ");
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({ key: "YOUR_GOOGLE_CLOUD_API_KEY" }); // Replace with your actual API key


// Function to translate text
const translateText = async (text, lang) => {
  try {
    const [translation] = await translate.translate(text, lang);
    return translation;
  } catch (error) {
    console.error(`Translation error (${lang}):`, error.message);
    return text; // Fallback to original text in case of error
  }
};

// Fetch all FAQs with translation support
exports.getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faqs = await FAQ.find();
    const translatedFAQs = await Promise.all(
      faqs.map(async (faq) => {
        if (faq.translations && faq.translations[lang]) {
          return { question: faq.translations[lang], answer: faq.answer };
        } else {
          const translatedQuestion = await translateText(faq.question, lang);
          faq.translations = {
            ...faq.translations,
            [lang]: translatedQuestion,
          };
          await faq.save(); // Update DB with translated question
          return { question: translatedQuestion, answer: faq.answer };
        }
      })
    );

    res.json(translatedFAQs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create FAQ with auto-translation
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const translations = {};
    const languages = ["hi", "bn", "mr"]; // List of languages to auto-translate

    // Translate the question into multiple languages
    await Promise.all(
      languages.map(async (lang) => {
        translations[lang] = await translateText(question, lang);
      })
    );

    const faq = new FAQ({ question, answer, translations });
    await faq.save();

    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
