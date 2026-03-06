import { PromptStrategy } from '../prompt.strategy';
import { EnrichmentContext } from 'src/product-enrichment/types/enrichment-context.types';
import { UIKitMetadata } from 'src/shared/types/extracted-metadata.types';

export class UIKitStrategy implements PromptStrategy {
  buildPrompt(context: EnrichmentContext): string {
    const { metadata, sellerKeywords } = context;
    const meta = metadata as UIKitMetadata;

    return `
You are a product listing expert for a design asset marketplace.
Generate a compelling product listing based on the following data.

PRODUCT TYPE: UI Kit (Design File)

DESIGN TOOL: ${meta.design?.tool ?? 'unknown'}
COMPONENT COUNT: ${meta.design?.componentCount ?? 'unknown'}
PAGE COUNT: ${meta.design?.pageCount ?? 'unknown'}
HAS PROTOTYPE: ${meta.design?.hasPrototype ? 'yes' : 'no'}
HAS DARK MODE: ${meta.styling?.hasDarkMode ? 'yes' : 'no'}
HAS README: ${meta.readme.exists ? 'yes' : 'no'}                     
README SECTIONS: ${meta.readme.sections?.join(', ') ?? 'none'}           

SELLER KEYWORDS: ${sellerKeywords.join(', ')}

INSTRUCTIONS:
- productName: catchy, SEO-friendly, under 60 chars
- blurb: one-liner tagline under 100 chars
- description: 2 paragraphs max, 50-80 words per paragraph, marketing tone
- features: 5-8 bullet points of key features
- techStack: design tools and versions only (e.g. "Figma 2024")
- compatibility: what versions/tools needed to open this file
- requirements: what buyer needs before using
- tags: 8-12 relevant SEO tags
- installationGuide: null if pure design file, or short markdown string if seller included setup steps (e.g. font installation, plugin requirements)

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
