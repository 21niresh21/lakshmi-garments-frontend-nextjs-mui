export interface Bale {
  id: string;
  baleNumber: string;
  quantity?: number;
  quality?: string;
  price?: number;
  length?: number;
  categoryID?: number;
  subCategoryID?: number;
}