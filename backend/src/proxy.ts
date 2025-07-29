import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/openrouter', async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error proxying to OpenRouter' });
  }
});

export default router;
