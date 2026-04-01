import {
  CatalogProduct,
  FooterLinkGroup,
  HighlightFeature,
  HomeNavLink,
  RealmCategory,
} from './home.models';

export const HOME_NAV_LINKS: ReadonlyArray<HomeNavLink> = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Contact Us', href: '/contact' },
];

export const HOME_CATEGORIES: ReadonlyArray<RealmCategory> = [
  {
    id: 'modern-living',
    name: 'Modern Living',
    itemCount: 86,
    imageUrl:
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'atelier-kitchen',
    name: 'Atelier Kitchen',
    itemCount: 64,
    imageUrl:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'accents',
    name: 'Accents',
    itemCount: 41,
    imageUrl:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'serenity-suite',
    name: 'Serenity Suite',
    itemCount: 29,
    imageUrl:
      'https://images.unsplash.com/photo-1616594039964-3cc4f0f3f3f8?auto=format&fit=crop&w=900&q=80',
  },
];

export const CATALOG_PRODUCTS: ReadonlyArray<CatalogProduct> = [
  {
    id: 'prod-01',
    title: 'Cantilever Lounge Chair',
    category: 'Axiom Series',
    material: 'Powdered Steel',
    price: 1450,
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    label: 'Premium',
  },
  {
    id: 'prod-02',
    title: 'Monolith Marble Console',
    category: 'Noir Atelier',
    material: 'Ceramic',
    price: 2280,
    imageUrl:
      'https://images.unsplash.com/photo-1617104551722-3b2d5136641f?auto=format&fit=crop&w=900&q=80',
    label: 'Staff Pick',
  },
  {
    id: 'prod-03',
    title: 'Linear Oak Dining Table',
    category: 'Forma Collection',
    material: 'Brushed Walnut',
    price: 3120,
    imageUrl:
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-04',
    title: 'Contour Bedframe',
    category: 'Serenity Suite',
    material: 'Brushed Walnut',
    price: 2780,
    imageUrl:
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80',
    label: 'Limited Stock',
  },
  {
    id: 'prod-05',
    title: 'Sculpt Vessel Lamp',
    category: 'Lumen Studio',
    material: 'Ceramic',
    price: 780,
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-06',
    title: 'Helix Modular Sofa',
    category: 'Modern Living',
    material: 'Powdered Steel',
    price: 3640,
    imageUrl:
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80',
    label: 'Premium',
  },
  {
    id: 'prod-07',
    title: 'Grid Storage Credenza',
    category: 'Atelier Kitchen',
    material: 'Brushed Walnut',
    price: 1960,
    imageUrl:
      'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-08',
    title: 'Obsidian Accent Mirror',
    category: 'Accents',
    material: 'Powdered Steel',
    price: 920,
    imageUrl:
      'https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&w=900&q=80',
    label: 'Staff Pick',
  },
  {
    id: 'prod-09',
    title: 'Arc Floor Shelf',
    category: 'Forma Collection',
    material: 'Powdered Steel',
    price: 1320,
    imageUrl:
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-10',
    title: 'Halo Side Table',
    category: 'Noir Atelier',
    material: 'Ceramic',
    price: 640,
    imageUrl:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    label: 'Limited Stock',
  },
];

export const TOP_PRODUCTS: ReadonlyArray<CatalogProduct> = CATALOG_PRODUCTS.slice(0, 4);

export const MATERIAL_OPTIONS: ReadonlyArray<string> = [
  'Brushed Walnut',
  'Ceramic',
  'Powdered Steel',
];

export const HIGHLIGHT_FEATURES: ReadonlyArray<HighlightFeature> = [
  {
    id: 'authenticity',
    title: 'Authenticated Sourcing',
    description:
      'Every item is sourced directly from vetted ateliers and accompanied by provenance details.',
    icon: 'verified',
  },
  {
    id: 'delivery',
    title: 'White-Glove Delivery',
    description:
      'Precision scheduling, in-home placement, and installation by a trained concierge team.',
    icon: 'local_shipping',
  },
  {
    id: 'preservation',
    title: 'Lifetime Preservation',
    description:
      'Material-specific care plans and restoration support to preserve your collection over decades.',
    icon: 'shield_with_heart',
  },
];

export const FOOTER_LINK_GROUPS: ReadonlyArray<FooterLinkGroup> = [
  {
    title: 'Atelier',
    links: [
      { label: 'Our Story', href: '#' },
      { label: 'Craft Partners', href: '#' },
      { label: 'Journal', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping & Returns', href: '#' },
      { label: 'Care Guide', href: '#' },
      { label: 'Contact Concierge', href: '#' },
    ],
  },
  {
    title: 'Registry',
    links: [
      { label: 'Create Registry', href: '#' },
      { label: 'Find Registry', href: '#' },
      { label: 'Trade Program', href: '#' },
    ],
  },
];

export const HERO_HEADLINE = 'Formed by Space. Defined by Craft.';
export const HERO_SUBTITLE =
  'Discover architectural furniture and heirloom objects designed for intentional living, curated from global studios.';
export const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80';

export const COMPANY_DESCRIPTION =
  'Atelier Arc curates architectural furniture and collectible design objects for homes shaped by form, texture, and timeless material language.';
