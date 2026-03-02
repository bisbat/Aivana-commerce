import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

const VALID_CATEGORIES = [
  'ui-kits',
  'frontend-template',
  'backend-template',
  'fullstack-template',
];

@Injectable()
export class IntentExtractionService {
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new BadRequestException('GEMINI_API_KEY is not set');

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
  }

  async extractIntent(userInput: string) {
    const prompt = `
You are a developer tool assistant helping recommend product bundles.
Extract structured intent from the user's project idea.
Return ONLY valid JSON.

STRICT RULES:
- category must be one or more of EXACTLY: "ui-kits", "frontend-template", "backend-template", "fullstack-template"
- techstack must be lowercase e.g. "next.js", "react", "typescript"
- tags must be lowercase single words e.g. "minimal", "dashboard", "dark"

Return this structure:
{
  "category": string[],
  "techstack": string[],
  "tags": string[],
  "reason": string
}

User input: "${userInput}"
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      return {
        category: parsed.category.filter((c: string) =>
          VALID_CATEGORIES.includes(c),
        ),
        techstack: parsed.techstack.map((t: string) => t.toLowerCase()),
        tags: parsed.tags.map((t: string) => t.toLowerCase()),
        reason: parsed.reason,
      };
    } catch (error) {
      console.error('Gemini error:', error);
      return {
        category: ['fullstack-template'],
        techstack: [],
        tags: [],
        reason: 'ไม่สามารถวิเคราะห์ได้ แนะนำ bundle ทั่วไป',
      };
    }
  }
}
