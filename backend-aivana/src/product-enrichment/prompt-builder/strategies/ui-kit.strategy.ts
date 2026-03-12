import { PromptStrategy } from '../prompt.strategy';
import { EnrichmentContext } from 'src/product-enrichment/types/enrichment-context.types';
import { UIKitMetadata } from 'src/shared/types/extracted-metadata.types';

export class UIKitStrategy implements PromptStrategy {
  buildPrompt(context: EnrichmentContext): string {
    const { metadata, sellerKeywords, availableTags, availableCategories } =
      context;
    const meta = metadata as UIKitMetadata;

    const tagLine = availableTags?.length
      ? `Pick 5-10 tags ONLY from this list (exact spelling):\n${availableTags.join(', ')}`
      : 'Generate 8-12 relevant SEO tags.';

    const catLine = availableCategories?.length
      ? `Pick EXACTLY ONE from this list (exact spelling):\n${availableCategories.map((c) => c.name).join(', ')}`
      : 'Suggest a category name.';

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

AVAILABLE TAGS:
${tagLine}

AVAILABLE CATEGORIES:
${catLine}

INSTRUCTIONS:
- productName: catchy, SEO-friendly, under 60 chars
- blurb: one-liner tagline under 100 chars
- description: 1 punchy paragraph, 30-50 words max. Lead with what it does, who it's for, and why it matters. No fluff, no filler. Think product-hunt style.
- features: 5-8 bullet points of key features (visual richness, component variety, dark mode, etc.)
- techStack: design tools only (e.g. "Figma 2024", "Sketch 99")
- compatibility: return empty array [] — not applicable for design files
- requirements: return empty array [] — not applicable for design files
- tags: select from the AVAILABLE TAGS list above only
- suggestedCategoryName: select from the AVAILABLE CATEGORIES list above only
- installationGuide: null — design files need no installation

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
  "installationGuide": null
}`;
  }
}
