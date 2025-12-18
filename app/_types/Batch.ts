type SubCategoriesWithQuantity = {
  id: number;
  subCategoryName: string;
  quantity: number;
};

export interface Batch {
  id: number;
  batchStatus: string;
  createdAt: string;
  categoryName: string;
  isUrgent: boolean;
  remarks: string;
  serialCode: string;
  subCategories: SubCategoriesWithQuantity[];
}
