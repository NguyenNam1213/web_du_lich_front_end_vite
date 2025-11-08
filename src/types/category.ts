export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: string | null;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
}