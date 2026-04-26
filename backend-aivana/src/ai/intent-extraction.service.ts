import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiService } from './gemini.service';

const VALID_CATEGORIES = ['ui-kit', 'frontend-template', 'backend-template'];

@Injectable()
export class IntentExtractionService {
  constructor(private readonly gemini: GeminiService) { } // ← inject แทน

  async extractIntent(userInput: string) {
    const prompt = `
You are a developer tool assistant that helps recommend product bundles.

Analyze the user's project idea and extract structured intent.
The user may write in Thai or English — All fields must be in English EXCEPT "reason" which must always be in Thai.

Return ONLY valid JSON. No markdown. No explanation.

---

CATEGORY RULES:
You MUST always return at least one category.
Pick one or more from EXACTLY these values based on what the user wants to build:

- "ui-kit"             → reusable UI components, design systems, component libraries
- "frontend-template"  → full website or app templates (landing pages, dashboards, portfolios, SaaS frontends)
- "backend-template"   → server-side projects, APIs, backend services, databases

Example mappings:
- "landing page" → ["frontend-template"]
- "admin dashboard" → ["ui-kit", "frontend-template"]  
- "REST API with auth" → ["backend-template"]
- "full stack SaaS" → ["frontend-template", "backend-template"]

TECHSTACK RULES:
- Lowercase only: "react", "next.js", "vue", "node", "typescript", "express", etc.
- Extract from user input directly.

TAGS RULES:
- Infer related features from the project type, not just what the user explicitly says.
- For ecommerce → always include: "ecommerce", "cart", "payment", "product-listing"
- For saas → always include: "saas", "dashboard", "subscription", "auth"
- For portfolio → always include: "portfolio", "minimal", "landing"
- Tags must be lowercase, hyphenated if multi-word.

BUNDLE GOAL:
- Short phrase describing what the user wants to build.
- Always fill this in, even if vague.
- This field can be in Thai.


REASON:
- Written in natural Thai as if you are a helpful assistant recommending products to a customer.
- Start with "แนะนำสินค้าชุดนี้เพราะ..." or similar natural opening.
- Do NOT explain technical decisions or mention category/tag selection process.
- Keep it friendly, 1-2 sentences max.

---

Return this exact JSON:
{
  "category": string[],
  "techstack": string[],
  "tags": string[],
  "bundleGoal": string,
  "reason": string
}

User input: "${userInput}"
`;

    try {
      console.log('hi this is extracting');
      const text = await this.gemini.generate(prompt);

      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      const filteredCategories = (parsed.category || []).filter((c: string) =>
        VALID_CATEGORIES.includes(c),
      );

      return {
        category:
          filteredCategories.length > 0
            ? filteredCategories
            : ['frontend-template'],
        techstack: (parsed.techstack || []).map((t: string) => t.toLowerCase()),
        tags: (parsed.tags || []).map((t: string) => t.toLowerCase()),
        bundleGoal: parsed.bundleGoal || 'starter project',
        reason: parsed.reason || '',
      };
    } catch (error) {
      console.error('Gemini error:', error);

      return {
        category: ['frontend-template', 'backend-template'],
        techstack: [],
        tags: [],
        bundleGoal: 'starter project',
        reason: 'ไม่พบสินค้าที่ตรงกับความต้องการ แนะนำสินค้าพื้นฐานแทน',
      };
    }
  }
}
