const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // لتشغيل index.html من مجلد public

const API_KEY = 'c2a881aa8cecb07069cff3b0b437997e0a47c9d6bb3037c26937aea28868a0ac';
const TOGETHER_API_URL = 'https://api.together.ai/v1/chat/completions';

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  const finalPrompt = `أجب كخبير قانوني يمني معتمد، لا تخرج عن القوانين اليمنية. السؤال: ${question}`;

  try {
    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: 'meta-llama/Llama-3-70b-chat-hf',
        messages: [{ role: 'user', content: finalPrompt }],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ answer: reply });
  } catch (error) {
    console.error('Together.ai Error:', error.response?.data || error.message);
    res.status(500).json({ answer: 'حدث خطأ أثناء الاتصال بالنموذج. حاول لاحقًا.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
