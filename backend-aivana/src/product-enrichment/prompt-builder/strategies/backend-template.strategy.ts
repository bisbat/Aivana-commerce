import { PromptStrategy } from '../prompt.strategy';
import type { EnrichmentContext } from 'src/product-enrichment/types/enrichment-context.types';
import type { BackendTemplateMetadata } from 'src/shared/types/extracted-metadata.types';

export class BackendTemplateStrategy implements PromptStrategy {
  buildPrompt(context: EnrichmentContext): string {
    const { metadata, sellerKeywords } = context;
    const meta = metadata as BackendTemplateMetadata;

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

INSTRUCTIONS:
- productName: catchy, SEO-friendly, under 60 chars
- blurb: one-liner tagline under 100 chars
- description: 2 paragraphs max, 50-80 words per paragraph, marketing tone
- features: 5-8 bullet points of key features
- techStack: frameworks, libraries, tools with versions (e.g. "NestJS 10", "Prisma 5")
- compatibility: database/runtime versions (e.g. "PostgreSQL 14+", "Node.js 18+")
- requirements: what buyer must install before running (e.g. "Node.js 18+", "PostgreSQL 14+")
- tags: 8-12 relevant SEO tags
- installationGuide: markdown string with setup steps, null if no readme

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
  "installationGuide": null or "markdown string"
}`;
  }
}
