import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import * as unzipper from 'unzipper';

import {
  ExtractedMetadata,
  UIKitMetadata,
  FrontendTemplateMetadata,
  BackendTemplateMetadata,
} from '../shared/types/extracted-metadata.types';

// ─────────────────────────────────────────────
// Internal types
// ─────────────────────────────────────────────

type Category = 'ui-kit' | 'frontend-template' | 'backend-template';
type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

// Explicit aliases — avoids NonNullable<interface['field']>['key'] gymnastics
type FrontendPattern = 'component-based' | 'modular' | 'feature-based';
type BackendPattern = 'mvc' | 'modular' | 'layered';

interface ParsedPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface FolderStats {
  allFiles: string[];
  hasReadme: boolean;
  hasTypeScript: boolean;
  hasTsConfig: boolean;
  packageJson: ParsedPackageJson | null;
  lockFile: string | null;
}

// ─────────────────────────────────────────────
// Static rule maps
// ─────────────────────────────────────────────

const DEP_GROUPS = {
  ui: [
    'shadcn',
    '@radix-ui',
    'antd',
    '@ant-design',
    'chakra-ui',
    '@chakra-ui',
    'material-ui',
    '@mui',
    'mantine',
    '@mantine',
    'flowbite',
    'headlessui',
    '@headlessui',
    'daisyui',
    'react-bootstrap',
    'primereact',
    'naive-ui',
    'element-plus',
    'vuetify',
  ],
  state: [
    'redux',
    '@reduxjs/toolkit',
    'zustand',
    'jotai',
    'recoil',
    'mobx',
    'mobx-react',
    'pinia',
    'vuex',
    'xstate',
    'nanostores',
  ],
  styling: [
    'tailwindcss',
    'styled-components',
    '@emotion/react',
    '@emotion/styled',
    'sass',
    'less',
    'postcss',
    'unocss',
    'stitches',
    '@stitches/react',
    'vanilla-extract',
    'linaria',
  ],
  database: [
    'prisma',
    '@prisma/client',
    'typeorm',
    'sequelize',
    'mongoose',
    'drizzle-orm',
    'knex',
    'pg',
    'mysql2',
    'better-sqlite3',
    'mongodb',
    'redis',
    'ioredis',
    '@vercel/postgres',
    '@supabase/supabase-js',
    '@planetscale/database',
  ],
  auth: [
    'next-auth',
    '@auth/core',
    'passport',
    'passport-local',
    'passport-jwt',
    '@nestjs/passport',
    '@nestjs/jwt',
    'jsonwebtoken',
    'bcrypt',
    'bcryptjs',
    'clerk',
    '@clerk/nextjs',
    '@clerk/clerk-sdk-node',
    'firebase',
    'firebase-admin',
    'lucia',
  ],
} as const;

const FRAMEWORK_MAP: Record<string, string> = {
  next: 'Next.js',
  'next.js': 'Next.js',
  react: 'React',
  'react-dom': 'React',
  vue: 'Vue',
  nuxt: 'Nuxt',
  svelte: 'Svelte',
  '@sveltejs/kit': 'SvelteKit',
  astro: 'Astro',
  '@nestjs/core': 'NestJS',
  express: 'Express',
  fastify: 'Fastify',
  hono: 'Hono',
  koa: 'Koa',
  remix: 'Remix',
  '@remix-run/node': 'Remix',
  'solid-js': 'SolidJS',
  '@solidjs/start': 'SolidStart',
  gatsby: 'Gatsby',
  angular: 'Angular',
  '@angular/core': 'Angular',
};

const BUILD_TOOL_MAP: Record<string, string> = {
  vite: 'Vite',
  webpack: 'Webpack',
  turbo: 'Turborepo',
  turbopack: 'Turbopack',
  esbuild: 'esbuild',
  rollup: 'Rollup',
  parcel: 'Parcel',
  '@swc/core': 'SWC',
};

const ORM_MAP: Record<string, string> = {
  prisma: 'Prisma',
  '@prisma/client': 'Prisma',
  typeorm: 'TypeORM',
  sequelize: 'Sequelize',
  mongoose: 'Mongoose',
  'drizzle-orm': 'Drizzle',
  knex: 'Knex',
};

const DB_MAP: Record<string, string> = {
  pg: 'PostgreSQL',
  mysql2: 'MySQL',
  'better-sqlite3': 'SQLite',
  mongodb: 'MongoDB',
  mongoose: 'MongoDB',
  redis: 'Redis',
  ioredis: 'Redis',
  '@vercel/postgres': 'PostgreSQL',
  '@supabase/supabase-js': 'Supabase',
  'firebase-admin': 'Firebase',
  '@planetscale/database': 'PlanetScale',
};

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────

@Injectable()
export class MetadataExtractionService {
  private readonly logger = new Logger(MetadataExtractionService.name);

  // ── PUBLIC: called from ProductService with multer buffer ───────────────

  /**
   * Main entry point for the product creation flow.
   *
   * Multer stores the uploaded ZIP in memory as a Buffer.
   * We write it to /tmp, extract, analyze, then clean up both.
   *
   * Flow:
   *   Buffer → write /tmp/<uuid>.zip
   *          → extractMetadata(tmpZipPath)
   *          → delete /tmp/<uuid>.zip
   *          → return ExtractedMetadata
   */
  async extractMetadataFromBuffer(
    category: Category,
    buffer: Buffer,
  ): Promise<ExtractedMetadata> {
    const tmpZipPath = path.join(os.tmpdir(), `aivana-zip-${uuidv4()}.zip`);

    try {
      // Write buffer to disk so unzipper can stream it
      fs.writeFileSync(tmpZipPath, buffer);
      return await this.extractMetadata(category, tmpZipPath);
    } finally {
      // Delete the temp .zip file — extraction folder cleaned up inside extractMetadata
      try {
        if (fs.existsSync(tmpZipPath)) fs.unlinkSync(tmpZipPath);
      } catch (err) {
        this.logger.error(`Failed to delete temp ZIP: ${tmpZipPath}`, err);
      }
    }
  }

  // ── PUBLIC: called from MetadataExtractionController (manual re-trigger) ─

  /**
   * Re-extraction endpoint — works when ZIP already lives in MinIO.
   * Downloads ZIP to /tmp, delegates to extractMetadata(), cleans up.
   */
  async extractMetadataFromUrl(
    category: Category,
    fileUrl: string,
  ): Promise<ExtractedMetadata> {
    const tmpZipPath = path.join(os.tmpdir(), `aivana-zip-${uuidv4()}.zip`);

    try {
      await this.downloadToFile(fileUrl, tmpZipPath);
      return await this.extractMetadata(category, tmpZipPath);
    } finally {
      try {
        if (fs.existsSync(tmpZipPath)) fs.unlinkSync(tmpZipPath);
      } catch (err) {
        this.logger.error(`Failed to delete temp ZIP: ${tmpZipPath}`, err);
      }
    }
  }

  // ── PRIVATE: core extraction pipeline ──────────────────────────────────

  /**
   * Steps 2–6 from the spec:
   *   Copy ZIP → isolated /tmp sandbox  (already done by caller)
   *   Extract ZIP safely                ← extractZip()
   *   Rule-based analyze project        ← scanFolder()
   *   Build structured metadata JSON    ← build*Metadata()
   *   Delete /tmp extraction folder     ← cleanup() in finally
   */
  private async extractMetadata(
    category: Category,
    zipPath: string,
  ): Promise<ExtractedMetadata> {
    // Each extraction gets its own UUID folder → fully isolated
    const tempDir = path.join(os.tmpdir(), `aivana-extract-${uuidv4()}`);

    try {
      await this.extractZip(zipPath, tempDir);
      const stats = await this.scanFolder(tempDir);
      return this.buildMetadata(category, stats);
    } finally {
      await this.cleanupDir(tempDir);
    }
  }

  // ── Download (for URL-based entry point) ───────────────────────────────

  private downloadToFile(url: string, destPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Lazy-require so http/https is only loaded when needed
      const protocol = url.startsWith('https')
        ? require('https')
        : require('http');

      const file = fs.createWriteStream(destPath);

      protocol
        .get(url, (response: any) => {
          // Follow redirects — MinIO signed URLs may redirect
          if (
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            file.close();
            return this.downloadToFile(response.headers.location, destPath)
              .then(resolve)
              .catch(reject);
          }

          if (response.statusCode !== 200) {
            reject(
              new Error(`Failed to download ZIP: HTTP ${response.statusCode}`),
            );
            return;
          }

          response.pipe(file);
          file.on('finish', () => file.close(() => resolve()));
        })
        .on('error', (err: Error) => {
          fs.unlink(destPath, () => { });
          reject(err);
        });
    });
  }

  // ── Step 2: Safe ZIP extraction ─────────────────────────────────────────

  private async extractZip(zipPath: string, destDir: string): Promise<void> {
    fs.mkdirSync(destDir, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Parse())
        .on('entry', (entry: unzipper.Entry) => {
          const entryPath: string = entry.path;
          const type: string = entry.type;

          // ── Zip-slip guard ─────────────────────────────────────────────
          // path.normalize resolves ".." — if result escapes destDir, block it
          const fullPath = path.normalize(path.join(destDir, entryPath));
          if (!fullPath.startsWith(path.normalize(destDir) + path.sep)) {
            this.logger.warn(`Zip-slip blocked: ${entryPath}`);
            entry.autodrain();
            return;
          }

          // node_modules is useless for metadata — skip entirely
          if (entryPath.includes('node_modules/')) {
            entry.autodrain();
            return;
          }

          if (type === 'Directory') {
            fs.mkdirSync(fullPath, { recursive: true });
            entry.autodrain();
          } else {
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            entry.pipe(fs.createWriteStream(fullPath));
          }
        })
        .on('close', resolve)
        .on('error', reject);
    });
  }

  // ── Step 3: Folder scan ─────────────────────────────────────────────────

  private async scanFolder(dir: string): Promise<FolderStats> {
    const allFiles = this.walkDir(dir, dir);

    return {
      allFiles,
      hasReadme: allFiles.some((f) =>
        /^readme(\.(md|txt|rst))?$/i.test(path.basename(f)),
      ),
      hasTypeScript: allFiles.some(
        (f) => f.endsWith('.ts') || f.endsWith('.tsx'),
      ),
      hasTsConfig: allFiles.some((f) => path.basename(f) === 'tsconfig.json'),
      packageJson: this.readPackageJson(dir, allFiles),
      lockFile: this.detectLockFile(allFiles),
    };
  }

  private walkDir(baseDir: string, currentDir: string): string[] {
    const results: string[] = [];
    let entries: fs.Dirent[];

    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return results;
    }

    for (const entry of entries) {
      if (entry.name === 'node_modules') continue;

      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        results.push(...this.walkDir(baseDir, fullPath));
      } else {
        results.push(relativePath);
      }
    }

    return results;
  }

  private readPackageJson(
    baseDir: string,
    allFiles: string[],
  ): ParsedPackageJson | null {
    // Sort by depth → prefer root-level package.json
    const candidates = allFiles
      .filter((f) => path.basename(f) === 'package.json')
      .sort((a, b) => a.split(path.sep).length - b.split(path.sep).length);

    if (!candidates.length) return null;

    try {
      const raw = fs.readFileSync(path.join(baseDir, candidates[0]), 'utf-8');
      return JSON.parse(raw) as ParsedPackageJson;
    } catch {
      return null;
    }
  }

  private detectLockFile(files: string[]): string | null {
    // Order matters — bun first (most specific)
    const priority = [
      'bun.lockb',
      'pnpm-lock.yaml',
      'yarn.lock',
      'package-lock.json',
    ];
    for (const lock of priority) {
      if (files.some((f) => path.basename(f) === lock)) return lock;
    }
    return null;
  }

  // ── Step 4: Route to category builder ──────────────────────────────────

  private buildMetadata(
    category: Category,
    stats: FolderStats,
  ): ExtractedMetadata {
    switch (category) {
      case 'ui-kit':
        return this.buildUIKitMetadata(stats);
      case 'frontend-template':
        return this.buildFrontendMetadata(stats);
      case 'backend-template':
        return this.buildBackendMetadata(stats);
    }
  }

  // ── Step 5: Shared analysis helpers ────────────────────────────────────

  private allDeps(pkg: ParsedPackageJson | null): Record<string, string> {
    return { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };
  }

  private detectFramework(deps: Record<string, string>): {
    framework?: string;
    version?: string;
  } {
    for (const [dep, version] of Object.entries(deps)) {
      const label = FRAMEWORK_MAP[dep];
      if (label) {
        return {
          framework: label,
          version: version.replace(/^[\^~>=<]+/, '').trim(),
        };
      }
    }
    return {};
  }

  private classifyDependencies(deps: Record<string, string>) {
    const result: Record<string, string[]> = {
      main: [],
      ui: [],
      state: [],
      styling: [],
      database: [],
      auth: [],
    };
    const frameworkKeys = new Set(Object.keys(FRAMEWORK_MAP));

    for (const dep of Object.keys(deps)) {
      if (frameworkKeys.has(dep)) {
        result.main.push(dep);
        continue;
      }
      for (const [group, keywords] of Object.entries(DEP_GROUPS)) {
        if ((keywords as readonly string[]).some((kw) => dep.includes(kw))) {
          result[group].push(dep);
          break;
        }
      }
    }

    // Strip empty buckets — keeps JSON clean
    return Object.fromEntries(
      Object.entries(result).filter(([, v]) => v.length > 0),
    );
  }

  private detectPackageManager(
    lockFile: string | null,
  ): PackageManager | undefined {
    if (lockFile === 'bun.lockb') return 'bun';
    if (lockFile === 'pnpm-lock.yaml') return 'pnpm';
    if (lockFile === 'yarn.lock') return 'yarn';
    if (lockFile === 'package-lock.json') return 'npm';
    return undefined;
  }

  private detectLanguage(stats: FolderStats): string | undefined {
    if (stats.hasTypeScript || stats.hasTsConfig) return 'TypeScript';
    if (stats.allFiles.some((f) => f.endsWith('.js') || f.endsWith('.jsx')))
      return 'JavaScript';
    return undefined;
  }

  private buildReadmeInfo(stats: FolderStats): { exists: boolean } {
    return { exists: stats.hasReadme };
  }

  private detectPrimaryStyling(
    deps: Record<string, string>,
  ): string | undefined {
    for (const kw of DEP_GROUPS.styling) {
      if (deps[kw]) return kw;
    }
    return undefined;
  }

  private detectHasDarkMode(stats: FolderStats): boolean | undefined {
    return (
      stats.allFiles.some((f) => /dark/i.test(path.basename(f))) || undefined
    );
  }

  private detectBuildTool(deps: Record<string, string>): string | undefined {
    for (const [dep, label] of Object.entries(BUILD_TOOL_MAP)) {
      if (deps[dep]) return label;
    }
    return undefined;
  }

  private detectORM(deps: Record<string, string>): string | undefined {
    for (const [dep, label] of Object.entries(ORM_MAP)) {
      if (deps[dep]) return label;
    }
    return undefined;
  }

  private detectDatabase(deps: Record<string, string>): string | undefined {
    for (const [dep, label] of Object.entries(DB_MAP)) {
      if (deps[dep]) return label;
    }
    return undefined;
  }

  // ── Step 5a: UI Kit ─────────────────────────────────────────────────────

  private buildUIKitMetadata(stats: FolderStats): UIKitMetadata {
    const deps = this.allDeps(stats.packageJson);
    const classified = this.classifyDependencies(deps);

    const componentCount = stats.allFiles.filter(
      (f) => /components?\//i.test(f) && /\.(tsx|jsx|vue|svelte)$/.test(f),
    ).length;

    const pageCount = stats.allFiles.filter(
      (f) => /\/(pages?|app)\//i.test(f) && /\.(tsx|jsx|ts|js|vue|svelte)$/.test(f),
    ).length;

    const iconCount = stats.allFiles.filter((f) =>
      /(icons?|svg-icons?)\//i.test(f) && /\.(svg|tsx|jsx|vue|svelte)$/i.test(f),
    ).length;

    const assetCount = stats.allFiles.filter((f) =>
      /\.(png|jpg|jpeg|webp|gif)$/i.test(f),
    ).length;

    return {
      category: 'ui-kit',
      design: {
        ...(stats.allFiles.some((f) => f.endsWith('.fig')) && {
          tool: 'figma' as const,
        }),
        ...(componentCount > 0 && { componentCount }),
        ...(pageCount > 0 && { pageCount }),
      },
      structure: {
        ...(iconCount > 0 && { iconCount }),
        ...(assetCount > 0 && { assetCount }),
      },
      styling: {
        primaryStyling: this.detectPrimaryStyling(deps),
        hasDarkMode: this.detectHasDarkMode(stats),
      },
      tooling: {
        hasTypeScript: stats.hasTypeScript || stats.hasTsConfig || undefined,
        packageManager: this.detectPackageManager(stats.lockFile),
      },
      dependencies: Object.keys(classified).length ? classified : undefined,
      readme: this.buildReadmeInfo(stats),
    };
  }

  // ── Step 5b: Frontend Template ──────────────────────────────────────────

  private buildFrontendMetadata(stats: FolderStats): FrontendTemplateMetadata {
    const deps = this.allDeps(stats.packageJson);
    const { framework, version } = this.detectFramework(deps);
    const classified = this.classifyDependencies(deps);

    const componentCount = stats.allFiles.filter(
      (f) => /components?\//i.test(f) && /\.(tsx|jsx)$/.test(f),
    ).length;

    const pageCount = stats.allFiles.filter(
      (f) => /\/(pages?|app)\//i.test(f) && /\.(tsx|jsx|ts|js)$/.test(f),
    ).length;

    const hasRouting =
      !!deps['react-router-dom'] ||
      !!deps['react-router'] ||
      !!deps['vue-router'] ||
      stats.allFiles.some((f) => /\/(pages?|app)\//i.test(f));

    const hasAuth = DEP_GROUPS.auth.some((kw) =>
      Object.keys(deps).some((d) => d.includes(kw)),
    );

    const stateLib = DEP_GROUPS.state.find((kw) =>
      Object.keys(deps).some((d) => d.includes(kw)),
    );

    const pattern = this.detectFrontendPattern(stats.allFiles);

    return {
      category: 'frontend-template',
      tech: {
        ...(framework && { framework }),
        ...(version && { frameworkVersion: version }),
        language: this.detectLanguage(stats),
      },
      architecture: {
        hasRouting: hasRouting || undefined,
        hasAuth: hasAuth || undefined,
        ...(stateLib && { stateManagement: stateLib }),
        ...(pattern && { pattern }),
      },
      styling: {
        primaryStyling: this.detectPrimaryStyling(deps),
        hasDarkMode: this.detectHasDarkMode(stats),
      },
      structure: {
        ...(componentCount > 0 && { componentCount }),
        ...(pageCount > 0 && { pageCount }),
      },
      tooling: {
        hasTypeScript: stats.hasTypeScript || stats.hasTsConfig || undefined,
        packageManager: this.detectPackageManager(stats.lockFile),
        buildTool: this.detectBuildTool(deps),
      },
      dependencies: Object.keys(classified).length ? classified : undefined,
      readme: this.buildReadmeInfo(stats),
    };
  }

  private detectFrontendPattern(files: string[]): FrontendPattern | undefined {
    const dirs = new Set(files.map((f) => f.split(path.sep)[0]));
    if (dirs.has('features') || dirs.has('modules')) return 'feature-based';
    if (dirs.has('components') && dirs.has('pages')) return 'component-based';
    if (dirs.has('src')) return 'modular';
    return undefined;
  }

  // ── Step 5c: Backend Template ───────────────────────────────────────────

  private buildBackendMetadata(stats: FolderStats): BackendTemplateMetadata {
    const deps = this.allDeps(stats.packageJson);
    const { framework, version } = this.detectFramework(deps);
    const classified = this.classifyDependencies(deps);

    const hasAuth = DEP_GROUPS.auth.some((kw) =>
      Object.keys(deps).some((d) => d.includes(kw)),
    );

    const apiEndpointCount = stats.allFiles.filter((f) =>
      /\.(controller|router|route)\.(ts|js)$/.test(f),
    ).length;

    const pattern = this.detectBackendPattern(stats.allFiles);

    return {
      category: 'backend-template',
      tech: {
        ...(framework && { framework }),
        ...(version && { frameworkVersion: version }),
        language: this.detectLanguage(stats),
        runtime: 'Node.js',
      },
      architecture: {
        hasAuth: hasAuth || undefined,
        database: this.detectDatabase(deps),
        orm: this.detectORM(deps),
        ...(pattern && { pattern }),
      },
      structure: {
        ...(apiEndpointCount > 0 && { apiEndpointCount }),
      },
      tooling: {
        hasTypeScript: stats.hasTypeScript || stats.hasTsConfig || undefined,
        packageManager: this.detectPackageManager(stats.lockFile),
      },
      dependencies: Object.keys(classified).length ? classified : undefined,
      readme: this.buildReadmeInfo(stats),
    };
  }

  private detectBackendPattern(files: string[]): BackendPattern | undefined {
    const dirs = new Set(files.map((f) => f.split(path.sep)[0]));
    if (dirs.has('modules')) return 'modular';
    if (dirs.has('controllers') || dirs.has('routes')) return 'mvc';
    if (dirs.has('layers') || dirs.has('services')) return 'layered';
    return undefined;
  }

  // ── Step 6: Cleanup ─────────────────────────────────────────────────────

  private async cleanupDir(dir: string): Promise<void> {
    try {
      // Use async fs.promises.rm with maxRetries to handle Windows ENOTEMPTY race conditions
      await fs.promises.rm(dir, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 150,
      });
    } catch (err) {
      this.logger.error(`Cleanup failed for ${dir}`, err);
    }
  }
}
