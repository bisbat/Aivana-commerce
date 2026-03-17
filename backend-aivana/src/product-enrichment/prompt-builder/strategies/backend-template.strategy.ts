import { PromptStrategy } from '../prompt.strategy';
import type { EnrichmentContext } from 'src/product-enrichment/types/enrichment-context.types';
import type { BackendTemplateMetadata } from 'src/shared/types/extracted-metadata.types';

export class BackendTemplateStrategy implements PromptStrategy {
  buildPrompt(context: EnrichmentContext): string {
    const { metadata, sellerKeywords, availableTags, availableCategories } =
      context;
    const meta = metadata as BackendTemplateMetadata;

    const tagLine = availableTags?.length
      ? `Pick 5-10 tags ONLY from this list (exact spelling):\n${availableTags.join(', ')}`
      : 'Generate 8-12 relevant SEO tags.';

    const catLine = availableCategories?.length
      ? `Pick EXACTLY ONE from this list (exact spelling):\n${availableCategories.map((c) => c.name).join(', ')}`
      : 'Suggest a category name.';

    return `
You are a product listing expert for a developer marketplace.
Generate a compelling product listing based on the following data.

PRODUCT TYPE: Backend Template

FRAMEWORK: ${meta.tech?.framework ?? 'unknown'}
FRAMEWORK VERSION: ${meta.tech?.frameworkVersion ?? 'unknown'}
LANGUAGE: ${meta.tech?.language ?? 'unknown'}
RUNTIME: ${meta.tech?.runtime ?? 'unknown'}

HAS AUTH: ${meta.architecture?.hasAuth ? 'yes' : 'no'}
DATABASE: ${meta.architecture?.database ?? 'none'}
ORM: ${meta.architecture?.orm ?? 'none'}
ARCHITECTURE PATTERN: ${meta.architecture?.pattern ?? 'unknown'}

API ENDPOINT COUNT: ${meta.structure?.apiEndpointCount ?? 'unknown'}

PACKAGE MANAGER: ${meta.tooling?.packageManager ?? 'unknown'}
HAS TYPESCRIPT: ${meta.tooling?.hasTypeScript ? 'yes' : 'no'}

DEPENDENCIES:
- Main: ${meta.dependencies?.main?.join(', ') ?? 'none'}
- Database: ${meta.dependencies?.database?.join(', ') ?? 'none'}
- Auth: ${meta.dependencies?.auth?.join(', ') ?? 'none'}

HAS README: ${meta.readme.exists ? 'yes' : 'no'}
README SECTIONS: ${meta.readme.sections?.join(', ') ?? 'none'}

SELLER KEYWORDS: ${sellerKeywords.join(', ')}

AVAILABLE TAGS:
${tagLine}

AVAILABLE CATEGORIES:
${catLine}

INSTRUCTIONS:
- productName: catchy, SEO-friendly, under 60 chars
- blurb: one-liner tagline under 100 chars
- description: 1 punchy paragraph, 30-50 words max. Lead with what it does, who it's for, and why it matters. No fluff, no filler. Think product-hunt style.
- features: 5-8 bullet points of key features
- techStack: frameworks, libraries, tools with versions (e.g. "NestJS 10", "Prisma 5")
- compatibility: database/runtime versions (e.g. "PostgreSQL 14+", "Node.js 18+")
- requirements: what buyer must install before running (e.g. "Node.js 18+", "PostgreSQL 14+")
- tags: select from the AVAILABLE TAGS list above only
- suggestedCategoryName: select from the AVAILABLE CATEGORIES list above only
- installationGuide: markdown string with setup steps, null if no readme
- apiDocUrl: if the project has OpenAPI/Swagger docs, return the likely local URL (e.g. "http://localhost:3000/api"), otherwise null

IMPORTANT: Respond ONLY in valid JSON matching this exact structure:
{
  "productName": "",
  "blurb": "",
  "description": "",
  "features": [],
  "techStack": [],
  "compatibility": [],
  "requirements": [],
  "tags": [],
  "suggestedCategoryName": "",
  "installationGuide": null,
  "apiDocUrl": null
}`;
  }
}
