import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;
import { GoogleGenAI } from '@google/genai';

export const uploadPdf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const dataBuffer = req.file.buffer;
    const data = await pdfParse(dataBuffer);
    const text = data.text;

    // Summarize text using AI
    let summary = '';
    
    if (process.env.GROQ_API_KEY) {
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an AI study assistant. Summarize the following text extracted from a PDF document clearly and concisely, highlighting the key concepts.' },
          { role: 'user', content: text.substring(0, 15000) } // Limit text length
        ],
        model: 'llama3-8b-8192',
      });
      
      summary = chatCompletion.choices[0]?.message?.content || 'Could not generate summary.';
    } else if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an AI study assistant. Summarize the following text extracted from a PDF document clearly and concisely, highlighting the key concepts:\n\n${text.substring(0, 15000)}`,
      });
      summary = response.text || 'Could not generate summary.';
    } else {
      summary = 'No AI API key configured. Extracted text: ' + text.substring(0, 500) + '...';
    }

    res.json({ summary, extractedText: text.substring(0, 1000) + '...' });
  } catch (error: any) {
    console.error('PDF error:', error);
    res.status(500).json({ message: error.message || 'Error processing PDF' });
  }
};
