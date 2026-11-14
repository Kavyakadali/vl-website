import { Product, ProductVariant, FabricDetails } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/products';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DbProduct {
  id: number;
  name: string;
  title: string;
  description?: string | null;
  price: number;
  category: string;
  stock: number;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Maps a MySQL DB Product to the Frontend Product interface.
 * If the DB product matches an item in INITIAL_PRODUCTS by title or name,
 * it inherits detailed variants, fabric measurements, and multiple images.
 */
export function mapDbProductToProduct(db: DbProduct): Product {
  const match = INITIAL_PRODUCTS.find(
    (ip) =>
      ip.title.toLowerCase() === (db.title || db.name || '').toLowerCase() ||
      ip.slug.toLowerCase().includes((db.name || '').toLowerCase().replace(/\s+/g, '-'))
  );

  const fallbackSlug = (db.title || db.name || `product-${db.id}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const defaultFabricDetails: FabricDetails = {
    material: '100% Pure Combed Cotton',
    weave: 'Artisan Loom Finish',
    care: 'Gentle hand wash cold or gentle machine wash.',
    transparency: 'Opaque (No lining required)',
  };

  const defaultVariants: ProductVariant[] = [
    {
      id: `v-${db.id}-1`,
      size: 'Standard / Free Size',
      color: 'Original',
      colorHex: '#1A3B2B',
      stock: db.stock ?? 10,
    },
  ];

  return {
    id: String(db.id),
    title: db.title || db.name,
    slug: match?.slug || `${fallbackSlug}-${db.id}`,
    description: db.description || match?.description || 'Authentic designer wear from VL Designs.',
    price: Number(db.price),
    mrp: match?.mrp || Math.round(Number(db.price) * 1.5),
    category: (db.category as any) || match?.category || 'Kurtis & Sets',
    images:
      match?.images && match.images.length > 0
        ? match.images
        : db.image
        ? [db.image]
        : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000'],
    productType: match?.productType || 'own_design',
    fabric: match?.fabric || '100% Pure Cotton',
    fabricDetails: match?.fabricDetails || defaultFabricDetails,
    variants: match?.variants || defaultVariants,
    badge: match?.badge || (db.stock < 5 ? 'Limited Stock' : 'VL Original'),
    rating: match?.rating || 4.8,
    reviewCount: match?.reviewCount || 15,
    featured: match?.featured ?? true,
  };
}

// ==========================================
// 1. PRODUCTS API
// ==========================================

export async function fetchProductsFromApi(params?: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all' && params.category !== 'All Categories') {
      query.append('category', params.category);
    }
    if (params?.search) {
      query.append('search', params.search);
    }
    if (params?.minPrice !== undefined) {
      query.append('minPrice', String(params.minPrice));
    }
    if (params?.maxPrice !== undefined) {
      query.append('maxPrice', String(params.maxPrice));
    }
    if (params?.sort) {
      query.append('sort', params.sort);
    }
    query.append('limit', String(params?.limit || 50));
    query.append('page', String(params?.page || 1));

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`Products API returned ${res.status}, falling back to hardcoded data`);
      return INITIAL_PRODUCTS;
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data?.products) && json.data.products.length > 0) {
      return json.data.products.map(mapDbProductToProduct);
    }

    // If DB is empty, use frontend hardcoded fallback
    console.info('DB products table returned 0 items, using hardcoded fallback');
    return INITIAL_PRODUCTS;
  } catch (error) {
    console.warn('Backend unavailable, using hardcoded fallback products:', error);
    return INITIAL_PRODUCTS;
  }
}

export async function fetchProductBySlugOrId(slugOrId: string): Promise<Product | null> {
  // First try to match slug from hardcoded list
  const hardcodedMatch = INITIAL_PRODUCTS.find((p) => p.slug === slugOrId || p.id === slugOrId);

  try {
    // If slug ends with -<number>, extract id
    const matchId = slugOrId.match(/-(\d+)$/);
    const numericId = matchId ? matchId[1] : !isNaN(Number(slugOrId)) ? slugOrId : null;

    if (numericId) {
      const res = await fetch(`${API_BASE_URL}/products/${numericId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.product) {
          return mapDbProductToProduct(json.data.product);
        }
      }
    }

    // Fallback search via all products
    const all = await fetchProductsFromApi();
    const found = all.find((p) => p.slug === slugOrId || p.id === slugOrId);
    return found || hardcodedMatch || null;
  } catch {
    return hardcodedMatch || null;
  }
}

export async function fetchCategoriesFromApi(): Promise<{ category: string; productCount: number }[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.categories) && json.data.categories.length > 0) {
        return json.data.categories;
      }
    }
  } catch {
    // ignore
  }

  // Fallback category counts from INITIAL_PRODUCTS
  const counts: Record<string, number> = {};
  INITIAL_PRODUCTS.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  return Object.keys(counts).map((category) => ({
    category,
    productCount: counts[category],
  }));
}

// ==========================================
// 2. AUTH API
// ==========================================

export const authApi = {
  login: async (identifier: string, password: string) => {
    const isEmail = identifier.includes('@');
    const fallbackEmail =
      identifier.toLowerCase() === 'admin'
        ? 'admin@vldesigns.com'
        : `${identifier}@example.com`;
    const payload = isEmail
      ? { email: identifier, password }
      : { username: identifier, email: fallbackEmail, password };

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  signup: async (data: { name: string; email: string; password: string; role?: 'CUSTOMER' | 'ADMIN' }) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  guestLogin: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  getMe: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },
};

/**
 * Retrieve current token or initialize a guest token
 */
export async function getOrInitToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('vl_token');
  if (!token) {
    try {
      const res = await authApi.guestLogin();
      if (res.success && res.data?.token) {
        token = res.data.token;
        localStorage.setItem('vl_token', token as string);
        if (res.data.user) {
          localStorage.setItem('vl_current_user', JSON.stringify(res.data.user));
        }
      }
    } catch {
      // ignore
    }
  }
  return token;
}

// ==========================================
// 3. CART API
// ==========================================

export const cartApi = {
  getCart: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  addToCart: async (
    token: string,
    productId: number | string,
    quantity: number = 1,
    meta?: {
      productTitle?: string;
      price?: number;
      category?: string;
      image?: string;
    }
  ) => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
        productTitle: meta?.productTitle,
        price: meta?.price,
        category: meta?.category,
        image: meta?.image,
      }),
    });
    return res.json();
  },

  updateCartItem: async (token: string, cartItemIdOrProductId: number | string, quantity: number) => {
    const res = await fetch(`${API_BASE_URL}/cart/${cartItemIdOrProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  },

  removeCartItem: async (token: string, cartItemIdOrProductId: number | string) => {
    const res = await fetch(`${API_BASE_URL}/cart/${cartItemIdOrProductId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  clearCart: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },
};

// ==========================================
// 4. ORDERS API
// ==========================================

export const orderApi = {
  createOrder: async (
    token: string,
    items?: Array<{ productId: number; quantity: number }>,
    options?: {
      paymentType?: 'upi' | 'cod';
      paymentMethod?: 'upi' | 'cod';
      totalAmount?: number;
      shippingAddress?: any;
    }
  ) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...(items && items.length > 0 ? { items } : {}),
        paymentType: options?.paymentType || 'upi',
        paymentMethod: options?.paymentMethod || 'upi',
        totalAmount: options?.totalAmount,
        shippingAddress: options?.shippingAddress,
      }),
    });
    return res.json();
  },

  getUserOrders: async (token: string, page: number = 1, limit: number = 20) => {
    const res = await fetch(`${API_BASE_URL}/orders?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  getOrderById: async (token: string, orderId: string | number) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  cancelOrder: async (token: string, orderId: string | number) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  getAllOrdersAdmin: async (token: string, page: number = 1, limit: number = 50) => {
    const res = await fetch(`${API_BASE_URL}/orders/admin/all?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  updateOrderStatusAdmin: async (token: string, orderId: string | number, status: string) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
};

// ==========================================
// 5. ADMIN PRODUCT API
// ==========================================

export const adminApi = {
  createProduct: async (
    token: string,
    data: {
      name: string;
      title: string;
      description?: string;
      price: number;
      category: string;
      stock: number;
      image?: string;
    }
  ) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

