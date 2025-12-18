interface SubCategoryQuantity {
    subCategoryName: string;
    count: number
    percentageOfCategory: number
}

export interface Inventory {
  categoryName: string;
  categoryCode: string;
  subCategories: SubCategoryQuantity[]
}