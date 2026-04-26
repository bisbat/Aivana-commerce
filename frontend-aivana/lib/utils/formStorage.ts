export const STORAGE_KEYS = {
  STEP_1: 'product-form-step1',
  STEP_2: 'product-form-step2',
  STEP_3: 'product-form-step3',
  CURRENT_STEP: 'product-form-current-step',
} as const;

const storage =
  typeof window !== 'undefined'
    ? window.sessionStorage
    : null;

// Save data to storage
export function saveFormStep(stepNumber: number, data: any) {
  if (!storage) return;

  try {
    const key = `product-form-step${stepNumber}`;
    storage.setItem(key, JSON.stringify(data));
    console.log(`✅ Saved step ${stepNumber}`);
  } catch (error) {
    console.error(`❌ Failed to save step ${stepNumber}:`, error);
  }
}

// Load data from storage
export function loadFormStep(stepNumber: number) {
  if (!storage) return null;

  try {
    const key = `product-form-step${stepNumber}`;
    const result = storage.getItem(key);
    return result ? JSON.parse(result) : null;
  } catch {
    return null;
  }
}

// Save current step
export function saveCurrentStep(step: number) {
  if (!storage) return;
  storage.setItem(STORAGE_KEYS.CURRENT_STEP, JSON.stringify(step));
}

// Load current step
export function loadCurrentStep(): number {
  if (!storage) return 1;

  try {
    const result = storage.getItem(STORAGE_KEYS.CURRENT_STEP);
    return result ? JSON.parse(result) : 1;
  } catch {
    return 1;
  }
}

// Clear all data
export function clearAllFormData() {
  if (!storage) return;

  try {
    Object.values(STORAGE_KEYS).forEach((key) => storage.removeItem(key));
    console.log('✅ Cleared all form data');
  } catch (error) {
    console.error('❌ Failed to clear form data:', error);
  }
}
