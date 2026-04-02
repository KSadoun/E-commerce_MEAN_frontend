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
  title: string;
  category: string;
  material: string;
  price: number;
  imageUrl: string;
  label?: ProductLabel;
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
