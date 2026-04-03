export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  sellerId: number;
  status?: 'pending' | 'active' | 'rejected';
  isActive?: boolean;
  images?: string[];
  image?: string[];
}
