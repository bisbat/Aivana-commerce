import { PromptStrategy } from '../prompt.strategy';
import type { EnrichmentContext } from 'src/product-enrichment/types/enrichment-context.types';
import type { FrontendTemplateMetadata } from 'src/shared/types/extracted-metadata.types';

export class FrontendTemplateStrategy implements PromptStrategy {
  buildPrompt(context: EnrichmentContext): string {
    const { metadata, sellerKeywords } = context;
    const meta = metadata as FrontendTemplateMetadata;

    return `
You are a product listing expert for a developer marketplace.
Generate a compelling product listing based on the following data.

PRODUCT TYPE: Frontend Template

FRAMEWORK: ${meta.tech?.framework ?? 'unknown'}
FRAMEWORK VERSION: ${meta.tech?.frameworkVersion ?? 'unknown'}
LANGUAGE: ${meta.tech?.language ?? 'unknown'}

HAS ROUTING: ${meta.architecture?.hasRouting ? 'yes' : 'no'}
HAS AUTH: ${meta.architecture?.hasAuth ? 'yes' : 'no'}
STATE MANAGEMENT: ${meta.architecture?.stateManagement ?? 'none'}
ARCHITECTURE PATTERN: ${meta.architecture?.pattern ?? 'unknown'}

PRIMARY STYLING: ${meta.styling?.primaryStyling ?? 'unknown'}
HAS DARK MODE: ${meta.styling?.hasDarkMode ? 'yes' : 'no'}

COMPONENT COUNT: ${meta.structure?.componentCount ?? 'unknown'}
PAGE COUNT: ${meta.structure?.pageCount ?? 'unknown'}

BUILD TOOL: ${meta.tooling?.buildTool ?? 'unknown'}
PACKAGE MANAGER: ${meta.tooling?.packageManager ?? 'unknown'}
HAS TYPESCRIPT: ${meta.tooling?.hasTypeScript ? 'yes' : 'no'}

DEPENDENCIES:
- Main: ${meta.dependencies?.main?.join(', ') ?? 'none'}
- UI: ${meta.dependencies?.ui?.join(', ') ?? 'none'}
- State: ${meta.dependencies?.state?.join(', ') ?? 'none'}
- Styling: ${meta.dependencies?.styling?.join(', ') ?? 'none'}
- Auth: ${meta.dependencies?.auth?.join(', ') ?? 'none'}

HAS README: ${meta.readme.exists ? 'yes' : 'no'}
README SECTIONS: ${meta.readme.sections?.join(', ') ?? 'none'}

SELLER KEYWORDS: ${sellerKeywords.join(', ')}

INSTRUCTIONS:
- productName: catchy, SEO-friendly, under 60 chars
- blurb: one-liner tagline under 100 chars
- description: 2 paragraphs max, 50-80 words per paragraph, marketing tone
- features: 5-8 bullet points of key features
- techStack: frameworks, libraries, tools with versions (e.g. "Next.js 14", "TypeScript 5")
- compatibility: runtime/environment requirements (e.g. "Node.js 18+", "React 18+")
- requirements: what buyer must install before running (e.g. "Node.js 18+", "npm 9+")
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
