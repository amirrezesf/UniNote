import type { Material } from './types';

// ---------------------------------------------------------------------------
// Material type labels / theming
// ---------------------------------------------------------------------------

export const MATERIAL_TYPE_LABELS: Record<Material['materialType'], string> = {
  HANDOUT: 'جزوه',
  EXAM: 'نمونه سوال',
  NOTE: 'یادداشت',
  SLIDE: 'اسلاید',
  ASSIGNMENT: 'تمرین',
};
