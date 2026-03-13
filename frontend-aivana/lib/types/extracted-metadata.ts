// ==============================
// Shared Types
// ==============================

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';
type DesignTool = 'figma' | 'sketch' | 'xd' | 'other';

interface DependencyGroups {
  main?: string[]; // core framework libs
  ui?: string[]; // ui / component libs
  state?: string[]; // state management
  styling?: string[]; // styling systems
  database?: string[]; // db related
  auth?: string[]; // auth related
}

interface ReadmeInfo {
  exists: boolean;
  sections?: string[]; // ["installation", "features", "usage"]
}

// ==============================
// 1️⃣ UI KIT
// ==============================

export interface UIKitMetadata {
  category: 'ui-kit';

  tech?: {
    framework?: string;
    frameworkVersion?: string;
    language?: string;
  };

  files?: {
    designTools?: string[];
    assetTypes?: string[];
    fileExtensions?: string[];
  };

  design?: {
    tool?: DesignTool;
    componentCount?: number;
    pageCount?: number;
    hasPrototype?: boolean;
  };

  styling?: {
    primaryStyling?: string;
    hasDarkMode?: boolean;
  };

  tooling?: {
    hasTypeScript?: boolean;
    packageManager?: PackageManager;
  };

  dependencies?: DependencyGroups;

  readme: ReadmeInfo;
}

// ==============================
// 2️⃣ FRONTEND TEMPLATE
// ==============================

export interface FrontendTemplateMetadata {
  category: 'frontend-template';

  tech: {
    framework?: string;
    frameworkVersion?: string; // normalized (no ^ ~)
    language?: string;
  };

  architecture?: {
    hasRouting?: boolean;
    hasAuth?: boolean;
    stateManagement?: string;
    pattern?: 'component-based' | 'modular' | 'feature-based';
  };

  styling?: {
    primaryStyling?: string;
    hasDarkMode?: boolean;
  };

  structure?: {
    componentCount?: number;
    pageCount?: number;
  };

  tooling?: {
    hasTypeScript?: boolean;
    packageManager?: PackageManager;
    buildTool?: string;
  };

  dependencies?: DependencyGroups;

  readme: ReadmeInfo;
}

// ==============================
// 3️⃣ BACKEND TEMPLATE
// ==============================

export interface BackendTemplateMetadata {
  category: 'backend-template';

  tech: {
    framework?: string;
    frameworkVersion?: string;
    language?: string;
    runtime?: string;
  };

  architecture?: {
    hasAuth?: boolean;
    database?: string;
    orm?: string;
    pattern?: 'mvc' | 'modular' | 'layered';
  };

  structure?: {
    apiEndpointCount?: number;
  };

  tooling?: {
    hasTypeScript?: boolean;
    packageManager?: PackageManager;
  };

  dependencies?: DependencyGroups;

  readme: ReadmeInfo;
}

// ==============================
// UNION TYPE
// ==============================

export type ExtractedMetadata =
  | UIKitMetadata
  | FrontendTemplateMetadata
  | BackendTemplateMetadata;
