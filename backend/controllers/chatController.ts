import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const chat = async (req: Request, res: Response): Promise<void> => {
  const { message, history } = req.body;

  try {
    // If Groq API key is provided, use it. Otherwise fallback to Gemini.
    if (process.env.GROQ_API_KEY) {
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const messages = history ? [...history, { role: 'user', content: message }] : [{ role: 'user', content: message }];
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful AI study tutor.' },
          ...messages
        ],
        model: 'llama-3.3-70b-versatile',
      });
      
      res.json({ reply: chatCompletion.choices[0]?.message?.content || '' });
    } else if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful AI study tutor. The user says: ${message}`,
      });
      res.json({ reply: response.text || '' });
    } else {
      res.status(500).json({ message: 'No AI API key configured' });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message || 'Error communicating with AI' });
  }
};
