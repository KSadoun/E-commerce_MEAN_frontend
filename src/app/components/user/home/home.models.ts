export interface HomeNavLink {
  label: string;
  href: string;
}

export interface RealmCategory {
  id: string;
  name: string;
  itemCount: number;
  imageUrl: string;
}

export type ProductLabel = 'Premium' | 'Limited Stock' | 'Staff Pick';

export interface CatalogProduct {
  id: string;
  backendId: number;
  title: string;
  category: string;
  material: string;
  price: number;
  stock: number;
  imageUrl: string;
  label?: ProductLabel;
  rating?: number | null;
  reviewCount?: number;
}

export interface ProductReview {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSellerInfo {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  storeName?: string | null;
  isApproved?: boolean | null;
}

export interface ProductDetails {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  status: string;
  images: string[];
  rating: number | null;
  reviewCount: number;
  reviews: ProductReview[];
  seller: ProductSellerInfo | null;
}

export interface HighlightFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FooterLinkGroup {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}
