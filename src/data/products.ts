import { Product } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    title: 'VL Floral Tiered Pure Cotton Maxi Dress',
    slug: 'vl-floral-tiered-pure-cotton-maxi-dress',
    description: 'Designed in-house by VL Studio. We source breathable 100% combed cotton fabric from regional weavers and craft this flattering flared tiered maxi dress with puff sleeves, empire waist, and pockets.',
    price: 1499,
    mrp: 2499,
    category: 'Kurtis & Sets',
    productType: 'own_design',
    badge: 'VL Designed Dress',
    rating: 4.9,
    reviewCount: 42,
    featured: true,
    fabric: '100% Breathable Combed Cotton',
    fabricDetails: {
      material: '100% Pure Natural Cotton (60s count)',
      weave: 'Floral Screenprint on Fine Weave',
      care: 'Gentle hand wash cold or gentle machine wash.',
      transparency: 'Opaque with soft cotton lining included',
    },
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { id: 'v1-1', size: 'S (Bust 36")', color: 'Sage Botanical Print', colorHex: '#7C8C74', stock: 5 },
      { id: 'v1-2', size: 'M (Bust 38")', color: 'Sage Botanical Print', colorHex: '#7C8C74', stock: 8 },
      { id: 'v1-3', size: 'L (Bust 40")', color: 'Sage Botanical Print', colorHex: '#7C8C74', stock: 6 },
      { id: 'v1-4', size: 'XL (Bust 42")', color: 'Sage Botanical Print', colorHex: '#7C8C74', stock: 3 },
    ]
  },
  {
    id: 'prod-02',
    title: 'VL Signature Kalyani Cotton Unstitched Suit Set',
    slug: 'vl-signature-kalyani-cotton-unstitched-suit-set',
    description: 'We purchase authentic unbleached Kalyani cotton cloth and design custom block-print motifs with a lightweight Mal Mal dupatta. Ideal for custom tailored salwar suits, straight suits, or Pakistani-style kurtas.',
    price: 1399,
    mrp: 2399,
    category: 'Unstitched Suit Material',
    productType: 'own_design',
    badge: 'VL Designed Material',
    rating: 4.9,
    reviewCount: 38,
    featured: true,
    fabric: '100% Pure Kalyani Cotton',
    fabricDetails: {
      topCut: '2.50 Meters Premium Kalyani Cotton',
      bottomCut: '2.00 Meters Pure Cambric Cotton',
      dupattaCut: '2.25 Meters Soft Breathable Mal Mal',
      material: '100% Breathable Natural Cotton',
      weave: 'Fine Loom Weave with Hand-block Accents',
      care: 'Gentle hand wash in cold water. Dry inside-out in shade.',
      transparency: 'Non-transparent (No extra lining needed)',
    },
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { id: 'v2-1', size: 'Unstitched 3-Piece Material', color: 'Royal Indigo Blue', colorHex: '#253B59', stock: 6 },
      { id: 'v2-2', size: 'Unstitched 3-Piece Material', color: 'Terracotta Rust', colorHex: '#A34828', stock: 4 },
      { id: 'v2-3', size: 'Unstitched 3-Piece Material', color: 'Forest Green', colorHex: '#1D3B2B', stock: 3 },
    ]
  },
  {
    id: 'prod-03',
    title: 'Pure Linen Cotton Women’s Notch Collar Co-Ord Set',
    slug: 'pure-linen-cotton-womens-notch-collar-co-ord-set',
    description: 'Bespoke women’s two-piece co-ord set designed by VL Studio from sourced French flax linen-cotton yarn. Features a tailored notched lapel tunic with shell buttons and matching cropped ankle trousers.',
    price: 1650,
    mrp: 2799,
    category: 'Linen Essentials',
    productType: 'own_design',
    badge: 'VL Studio Original',
    rating: 4.8,
    reviewCount: 29,
    featured: true,
    fabric: 'Organic Linen Cotton Blend',
    fabricDetails: {
      material: '60% French Flax Linen, 40% South Indian Cotton',
      weave: 'Breathable Slub Weave',
      care: 'Machine wash gentle with similar colors. Warm iron when damp.',
      transparency: 'Opaque luxury density',
    },
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { id: 'v3-1', size: 'S (Comfort Fit)', color: 'Sage Green', colorHex: '#879782', stock: 4 },
      { id: 'v3-2', size: 'M (Comfort Fit)', color: 'Sage Green', colorHex: '#879782', stock: 6 },
      { id: 'v3-3', size: 'L (Comfort Fit)', color: 'Sage Green', colorHex: '#879782', stock: 5 },
      { id: 'v3-4', size: 'XL (Comfort Fit)', color: 'Natural Oatmeal', colorHex: '#D8CBB7', stock: 3 },
    ]
  },
  {
    id: 'prod-04',
    title: 'Traditional Cham Cham Soft Weave Cotton Saree',
    slug: 'traditional-cham-cham-soft-weave-cotton-saree',
    description: 'Sourced directly from authentic Tamil Nadu loom clusters. Ultra-soft Cham Cham cotton weave featuring feather-light drape, temple zari border, and running unstitched blouse piece.',
    price: 1150,
    mrp: 1999,
    category: 'Cotton Sarees',
    productType: 'resold',
    badge: 'Curated Heritage',
    rating: 5.0,
    reviewCount: 47,
    featured: true,
    fabric: 'Fine Cham Cham Soft Cotton',
    fabricDetails: {
      topCut: '5.50 Meters Saree Length + 0.80 Meter Blouse Fabric',
      material: '100% Superfine Combed Cotton (80s count)',
      weave: 'Traditional Powerloom with Gold Zari Pallu',
      care: 'Mild shampoo hand wash, starch optional for crisp pleats.',
      transparency: 'Comfortable opaque weave',
    },
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { id: 'v4-1', size: '6.3 Meters with Blouse', color: 'Mustard Yellow & Maroon', colorHex: '#DDA02A', stock: 7 },
      { id: 'v4-2', size: '6.3 Meters with Blouse', color: 'Peacock Teal & Pink', colorHex: '#1B6A73', stock: 5 },
      { id: 'v4-3', size: '6.3 Meters with Blouse', color: 'Ivory Cream & Red', colorHex: '#EFE7D8', stock: 2 }
    ]
  },
  {
    id: 'prod-05',
    title: 'Jaipur Floral Block Print Pure Cotton Anarkali Dress',
    slug: 'jaipur-floral-block-print-pure-cotton-anarkali-dress',
    description: 'Curated women’s festive flared Anarkali dress crafted from natural dyed 60x60 cambric cotton with intricate gota patti border work and tassel neckties.',
    price: 1450,
    mrp: 2499,
    category: 'Kurtis & Sets',
    productType: 'resold',
    badge: 'Curated Trend',
    rating: 4.7,
    reviewCount: 31,
    featured: false,
    fabric: '100% Cotton 60x60 Cambric',
    fabricDetails: {
      material: '100% Pure Sanganeri Cotton',
      weave: 'Hand-block Printed Cambric',
      care: 'Wash separately in cold water for initial washes.',
      transparency: 'Opaque with mulmul lining in flare',
    },
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { id: 'v5-1', size: 'S', color: 'Crimson Red', colorHex: '#8E2828', stock: 4 },
      { id: 'v5-2', size: 'M', color: 'Crimson Red', colorHex: '#8E2828', stock: 5 },
      { id: 'v5-3', size: 'L', color: 'Crimson Red', colorHex: '#8E2828', stock: 6 },
      { id: 'v5-4', size: 'XL', color: 'Crimson Red', colorHex: '#8E2828', stock: 3 },
    ]
  },
  {
    id: 'prod-06',
    title: 'Kerala Kasavu Gold Zari Festive Cotton Saree',
    slug: 'kerala-kasavu-gold-zari-festive-cotton-saree',
    description: 'Curated authentic South Indian Kasavu handloom cotton saree with 3-inch woven temple gold zari border and rich pallu for weddings and celebrations.',
    price: 1299,
    mrp: 2199,
    category: 'Cotton Sarees',
    productType: 'resold',
    badge: 'Curated Heritage',
    rating: 4.9,
    reviewCount: 42,
    featured: false,
    fabric: 'Fine Kerala Kasavu Cotton',
    fabricDetails: {
      topCut: '6.25 Meters with contrast running blouse',
      material: '100% Unbleached Fine Natural Cotton',
      weave: 'Fine Kasavu Weave with Golden Zari Border',
      care: 'Gentle hand rinse or dry clean. Do not wring or rub zari directly.',
      transparency: 'Semi-sheer festive texture',
    },
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { id: 'v6-1', size: 'Standard 6.25m', color: 'Ivory & Antique Gold', colorHex: '#F2EDE4', stock: 8 },
      { id: 'v6-2', size: 'Standard 6.25m', color: 'Ivory & Rich Copper Gold', colorHex: '#EAE1D2', stock: 4 }
    ]
  }
];
