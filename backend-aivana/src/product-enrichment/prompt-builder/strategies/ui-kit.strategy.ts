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

    // Resolve design tools: prefer files.designTools (works for Illustrator, Photoshop, etc.)
    // Fall back to design.tool for Figma/Sketch kits
    const designTools = meta.files?.designTools?.length
      ? meta.files.designTools.join(', ')
      : (meta.design?.tool ?? 'unknown');

    const assetTypes = meta.files?.assetTypes?.join(', ') ?? 'unknown';
    const fileExtensions = meta.files?.fileExtensions?.join(', ') ?? 'unknown';

    const assetCount = meta.structure?.assetCount ?? 'unknown';
    const iconCount = meta.structure?.iconCount ?? null;

    const componentCount = meta.design?.componentCount ?? null;
    const pageCount = meta.design?.pageCount ?? null;
    const hasPrototype = meta.design?.hasPrototype ?? false;

    const hasDarkMode = meta.styling?.hasDarkMode ?? false;
    const primaryStyling = meta.styling?.primaryStyling ?? null;

    const framework = meta.tech?.framework ?? null;
    const language = meta.tech?.language ?? null;

    const hasTypeScript = meta.tooling?.hasTypeScript ?? false;

    return `
You are a product listing expert for a design asset marketplace.
Generate a compelling product listing based on the following metadata extracted from the product zip file.

PRODUCT TYPE: UI Kit / Design Asset

--- FILE ANALYSIS ---
DESIGN TOOLS: ${designTools}
ASSET TYPES: ${assetTypes}
FILE FORMATS: ${fileExtensions}
TOTAL ASSET COUNT: ${assetCount}
${iconCount !== null ? `ICON COUNT: ${iconCount}` : ''}

--- DESIGN DETAILS (if applicable) ---
${componentCount !== null ? `COMPONENT COUNT: ${componentCount}` : 'COMPONENT COUNT: not detected'}
${pageCount !== null ? `PAGE COUNT: ${pageCount}` : 'PAGE COUNT: not detected'}
HAS INTERACTIVE PROTOTYPE: ${hasPrototype ? 'yes' : 'no'}

--- TECH & STYLING (if applicable) ---
${framework ? `FRAMEWORK: ${framework}` : ''}
${language ? `LANGUAGE: ${language}` : ''}
PRIMARY STYLING: ${primaryStyling ?? 'not detected'}
HAS DARK MODE: ${hasDarkMode ? 'yes' : 'no'}
HAS TYPESCRIPT: ${hasTypeScript ? 'yes' : 'no'}

--- DOCUMENTATION ---
HAS README: ${meta.readme.exists ? 'yes' : 'no'}
README SECTIONS: ${meta.readme.sections?.join(', ') ?? 'none'}

--- SELLER INPUT ---
SELLER KEYWORDS: ${sellerKeywords.join(', ')}

--- CONSTRAINTS ---
AVAILABLE TAGS:
${tagLine}

AVAILABLE CATEGORIES:
${catLine}

--- INSTRUCTIONS ---
Use ALL the metadata above to generate an accurate, compelling listing. Consider:
- The design tools (e.g. Illustrator → vector assets, Figma → component-based UI kit)
- The asset types and file formats to describe what buyers actually get
- The asset count to communicate value (e.g. "50+ assets")
- Dark mode, TypeScript, or prototype support as key selling points if present

Output fields:
- productName: catchy, SEO-friendly, under 60 chars. Reflect the design tool and asset type (e.g. "Gradient UI Kit – 50 Illustrator Vector Assets")
- blurb: one-liner tagline under 100 chars. Hook the buyer instantly.
- description: 1 punchy paragraph, 40-60 words. Lead with what it is, what's included, who it's for, and why it stands out. Product-hunt style — no fluff.
- features: 5-8 bullet points. Highlight file formats, asset count, design tool compatibility, dark mode, prototype, etc.
- techStack: list ONLY the design tools (e.g. "Adobe Illustrator", "Figma", "Adobe Photoshop"). Do NOT include file extensions (ai, eps, jpg, etc.) here — those are context only for writing richer descriptions. Empty array [] if no design tools detected.
- compatibility: return empty array [] unless a framework is detected
- requirements: return empty array [] unless specific software version is required
- tags: select ONLY from the AVAILABLE TAGS list above (exact spelling)
- suggestedCategoryName: select ONLY from the AVAILABLE CATEGORIES list above (exact spelling)
- installationGuide: null if pure design files; brief note if framework-based

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
