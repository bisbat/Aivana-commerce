import { Injectable } from '@nestjs/common';
import * as path from 'path';
import {
  ValidationResult,
  ValidationFailReason,
} from '../shared/types/extracted-metadata.types';

type Category = 'ui-kit' | 'frontend-template' | 'backend-template';

const DESIGN_EXTENSIONS = new Set(['.fig', '.sketch', '.xd', '.psd', '.ai']);

const ASSET_EXTENSIONS = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif',
  '.woff', '.woff2', '.ttf', '.otf',
]);

export interface ValidationFlags {
  hasPackageJson: boolean;
  hasDesignFiles: boolean;
  hasAssets: boolean;
}

@Injectable()
export class ZipValidationService {

  validate(
    category: Category,
    allFiles: string[],
  ): { result: ValidationResult; flags: ValidationFlags } {
    const flags = this.buildFlags(allFiles);

    const result = this.checkRules(category, flags);
    return { result, flags };
  }

  private buildFlags(allFiles: string[]): ValidationFlags {
    const exts = allFiles.map((f) => path.extname(f).toLowerCase());

    return {
      hasPackageJson: allFiles.some(
        (f) => path.basename(f) === 'package.json',
      ),
      hasDesignFiles: exts.some((e) => DESIGN_EXTENSIONS.has(e)),
      hasAssets: exts.some((e) => ASSET_EXTENSIONS.has(e)),
    };
  }

  private checkRules(
    category: Category,
    flags: ValidationFlags,
  ): ValidationResult {
    switch (category) {
      case 'frontend-template':
      case 'backend-template':
        if (!flags.hasPackageJson) {
          return this.fail('MISSING_PACKAGE_JSON');
        }
        return this.pass();

      case 'ui-kit':
        if (!flags.hasDesignFiles && !flags.hasAssets) {
          return this.fail('INVALID_UI_KIT');
        }
        return this.pass();
    }
  }

  private pass(): ValidationResult {
    return { isValid: true };
  }

  private fail(reason: ValidationFailReason): ValidationResult {
    return { isValid: false, reason };
  }
}