export type ProductType = 'own_design' | 'resold';

export interface FabricDetails {
  topCut?: string;       // e.g. "2.50 Meters Pure Cotton"
  bottomCut?: string;    // e.g. "2.00 Meters Cotton Cambric"
  dupattaCut?: string;   // e.g. "2.25 Meters Mal Mal with Zari Border"
  material: string;      // e.g. "100% Pure Kalyani Cotton"
  weave: string;         // e.g. "Fine Powerloom / Artisan Finish"
  care: string;          // e.g. "First wash dry clean / Hand wash cold"
  transparency?: string; // e.g. "Opaque (No lining required)"
}

export interface ProductVariant {
  id: string;
  size: string;          // e.g. "Unstitched Material", "S", "M", "L", "XL", "XXL"
  color: string;         // e.g. "Indigo Blue", "Maroon", "Mustard Yellow"
  colorHex: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;         // Selling price in INR
  mrp: number;           // Original MRP in INR
  category: 'Unstitched Suit Material' | 'Cotton Sarees' | 'Kurtis & Sets' | 'Linen Essentials';
  images: string[];
  productType: ProductType; // 'own_design' or 'resold'
  fabric: string;
  fabricDetails: FabricDetails;
  variants: ProductVariant[];
  badge?: string;        // e.g. "VL Original", "Bestseller", "Handloom Pure"
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'upi_razorpay' | 'cod';
  paymentStatus: 'paid' | 'pending';
  orderStatus: 'Confirmed' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
}
