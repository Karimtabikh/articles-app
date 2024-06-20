export type Article = {
  id?: string;
  title: string;
  customTitle?: string;
  description: string;
  category: string;
  files: string;
  reference: string[];
};

export interface filterType {
  search: string;
  filterCategories: string[];
  sortOrder: string;
  startDate: Date | null;
  endDate: Date | null;
}
