export interface TShirtProduct {
  id: string;
  name: string;
  category: 'Oversized' | 'Baggy' | 'Regular Fit';
  price: string;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  gsm: string[];
  badge?: string;
}

export interface JewelleryProduct {
  id: string;
  name: string;
  category: 'Earrings' | 'Rings' | 'Chains' | 'Pendants';
  price: string;
  image: string;
  description: string;
  badge?: string;
}

// T-shirt image imports handled dynamically via product image paths
export const tshirtProducts: TShirtProduct[] = [
  {
    id: 'ts-001',
    name: 'Void Oversized Tee',
    category: 'Oversized',
    price: '₹999',
    image: '/tshirt-images/1',
    description: 'Premium 240 GSM drop-shoulder silhouette. The perfect canvas for your aesthetic.',
    colors: ['Black', 'White', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: ['180 GSM', '240 GSM'],
    badge: 'BESTSELLER',
  },
  {
    id: 'ts-002',
    name: 'Midnight Baggy Drop',
    category: 'Baggy',
    price: '₹1,099',
    image: '/tshirt-images/2',
    description: 'Ultra-relaxed baggy fit for those who dress with intention. Pure street luxury.',
    colors: ['Black', 'White', 'Red'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: ['180 GSM', '240 GSM'],
    badge: 'NEW',
  },
  {
    id: 'ts-003',
    name: 'Desert Sand Oversized',
    category: 'Oversized',
    price: '₹949',
    image: '/tshirt-images/3',
    description: 'Warm-toned premium oversized tee. Heavyweight fabric, lightweight feel.',
    colors: ['Beige', 'White', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: ['180 GSM', '240 GSM'],
  },
  {
    id: 'ts-004',
    name: 'Lunar Graphic Tee',
    category: 'Regular Fit',
    price: '₹1,199',
    image: '/tshirt-images/4',
    description: 'Statement graphic print on premium cotton. Art meets streetwear.',
    colors: ['White', 'Black', 'Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: ['180 GSM', '240 GSM'],
    badge: 'LIMITED',
  },
  {
    id: 'ts-005',
    name: 'Crimson Wave Oversized',
    category: 'Oversized',
    price: '₹999',
    image: '/tshirt-images/5',
    description: 'Bold red colorway in our signature oversized cut. Make a statement.',
    colors: ['Red', 'Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: ['180 GSM', '240 GSM'],
  },
  {
    id: 'ts-006',
    name: 'Shadow Regular Fit',
    category: 'Regular Fit',
    price: '₹849',
    image: '/tshirt-images/1',
    description: 'Clean, classic regular fit in premium cotton. Wardrobe essential.',
    colors: ['Black', 'White', 'Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: ['180 GSM', '240 GSM'],
  },
  {
    id: 'ts-007',
    name: 'Ghost Baggy Tee',
    category: 'Baggy',
    price: '₹1,049',
    image: '/tshirt-images/3',
    description: 'Ultimate comfort meets premium aesthetics. Engineered for the streets.',
    colors: ['White', 'Beige', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: ['180 GSM', '240 GSM'],
    badge: 'HOT',
  },
  {
    id: 'ts-008',
    name: 'Urban Oversized Pro',
    category: 'Oversized',
    price: '₹1,149',
    image: '/tshirt-images/2',
    description: 'Our most premium oversized silhouette. 240 GSM thickness, flawless drape.',
    colors: ['Black', 'White', 'Red', 'Blue', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    gsm: ['240 GSM'],
    badge: 'PREMIUM',
  },
];

export const jewelleryProducts: JewelleryProduct[] = [
  {
    id: 'jw-001',
    name: 'Soleil Diamond Studs',
    category: 'Earrings',
    price: '₹2,499',
    image: '/jewellery-images/1',
    description: 'Timeless diamond-cut crystal studs in 18K gold-plated settings. Effortlessly elegant.',
    badge: 'BESTSELLER',
  },
  {
    id: 'jw-002',
    name: 'Monarch Signet Ring',
    category: 'Rings',
    price: '₹3,299',
    image: '/jewellery-images/2',
    description: 'Brushed gold signet ring for the discerning individual. Power and prestige, refined.',
    badge: 'SIGNATURE',
  },
  {
    id: 'jw-003',
    name: 'Cuban Link Chain',
    category: 'Chains',
    price: '₹4,999',
    image: '/jewellery-images/3',
    description: '18K gold-plated Cuban link chain. Heavy, bold, and undeniably luxurious.',
    badge: 'PREMIUM',
  },
  {
    id: 'jw-004',
    name: 'Lion King Pendant',
    category: 'Pendants',
    price: '₹2,799',
    image: '/jewellery-images/4',
    description: 'Hand-crafted lion head pendant in gleaming gold. Symbol of strength and luxury.',
    badge: 'LIMITED',
  },
  {
    id: 'jw-005',
    name: 'Aurum Hoop Earrings',
    category: 'Earrings',
    price: '₹1,899',
    image: '/jewellery-images/5',
    description: 'Classic gold hoop earrings that never go out of style. Pure elegance.',
  },
  {
    id: 'jw-006',
    name: 'Crescent Moon Ring',
    category: 'Rings',
    price: '₹2,199',
    image: '/jewellery-images/2',
    description: 'Delicate crescent moon design in 14K gold finish. For the ethereal soul.',
    badge: 'NEW',
  },
  {
    id: 'jw-007',
    name: 'Serpent Chain',
    category: 'Chains',
    price: '₹3,799',
    image: '/jewellery-images/3',
    description: 'Snake-link chain with subtle texture and brilliant luster. Subtle power.',
  },
  {
    id: 'jw-008',
    name: 'Cross Pendant',
    category: 'Pendants',
    price: '₹1,999',
    image: '/jewellery-images/4',
    description: 'Classic gold cross pendant with refined detailing. Faith meets fashion.',
  },
];
