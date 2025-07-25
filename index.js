const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000;

// ✅ هذا السطر يعرض ملفات HTML من مجلد public
app.use(express.static("public"));

app.use(cors());
app.use(bodyParser.json());

app.post("/ask", async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: "⚠️ الرجاء كتابة سؤال." });
  }

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "meta-llama/Llama-3-70b-chat-hf",
        messages: [
          {
            role: "system",
            content:
              "أنت مساعد قانوني يمني. أجب فقط باللغة العربية، بأسلوب قانوني رسمي، وضمن حدود القوانين اليمنية فقط. لا تتحدث عن قوانين الدول الأخرى.",
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("❌ GPT Error:", error.message);
    res.status(500).json({
      answer: "❌ حدث خطأ أثناء الاتصال بالخادم. تأكد من توفر المفتاح أو الرصيد.",
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Legal Assistant is running on port ${port}`);
});
