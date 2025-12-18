export type SelectedItem = {
  name: string;
  maxQty: number;
  qty: number | "";
  selected: boolean;
};

export type SelectionState = {
  categoryName: string;
  items: SelectedItem[];
  urgent: boolean;
  remarks: string;
};
