'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  PlusCircle,
  Truck,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  Layers,
  ArrowLeft,
  Eye,
  Filter,
  Download,
  Printer,
  FileText,
  X,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { orderApi, adminApi, fetchProductsFromApi } from '@/services/api';

const formatDate = (val?: any): string => {
  if (!val) return 'Recent';
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return typeof val === 'string' && val.trim() !== '' ? val : 'Recent';
};

export default function AdminPage() {
  const { user, isAdmin, token, login, logout } = useAuth();
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'add-product' | 'inventory'>('orders');

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'Unstitched Suit Material',
    productType: 'own_design',
    fabric: '100% Pure Kalyani Cotton',
    price: 1299,
    mrp: 2199,
    topCut: '2.50 Meters Pure Cotton',
    bottomCut: '2.00 Meters Pure Cambric',
    dupattaCut: '2.25 Meters Mal Mal',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
    stock: 10,
  });

  const [notification, setNotification] = useState('');

  // Printable tax invoice download helper
  const handleDownloadInvoice = (order: any) => {
    if (!order) return;
    const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
    const invoiceDate = formatDate(order.createdAt);
    const shippingFee = order.shippingFee || (order.paymentMethod === 'cod' ? 45 : 0);
    const subtotal = Math.max(0, order.total - shippingFee);

    const itemsRows = (order.items && order.items.length > 0)
      ? order.items.map((it: any, index: number) => {
          const title = it.title || it.name || it.product?.title || 'VL Designer Piece';
          const qty = it.quantity || 1;
          const price = it.price || it.product?.price || (order.total / qty);
          const lineTotal = price * qty;
          return `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E8E2D8; text-align: center;">${index + 1}</td>
              <td style="padding: 10px; border-bottom: 1px solid #E8E2D8;">
                <strong>${title}</strong>
                ${it.variant?.size ? `<br><small style="color: #666;">Size: ${it.variant.size}</small>` : ''}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #E8E2D8; text-align: center;">${qty}</td>
              <td style="padding: 10px; border-bottom: 1px solid #E8E2D8; text-align: right;">₹${price}</td>
              <td style="padding: 10px; border-bottom: 1px solid #E8E2D8; text-align: right; font-weight: bold;">₹${lineTotal}</td>
            </tr>
          `;
        }).join('')
      : `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #E8E2D8; text-align: center;">1</td>
          <td style="padding: 10px; border-bottom: 1px solid #E8E2D8;">
            <strong>VL Handcrafted Cotton Suit Piece</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #E8E2D8; text-align: center;">1</td>
          <td style="padding: 10px; border-bottom: 1px solid #E8E2D8; text-align: right;">₹${subtotal}</td>
          <td style="padding: 10px; border-bottom: 1px solid #E8E2D8; text-align: right; font-weight: bold;">₹${subtotal}</td>
        </tr>
      `;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; color: #1C201D; }
          .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #E8E2D8; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1A3B2B; padding-bottom: 16px; margin-bottom: 24px; }
          .brand-name { font-size: 24px; font-weight: 800; color: #1A3B2B; letter-spacing: 1px; }
          .brand-tagline { font-size: 11px; color: #7A8580; text-transform: uppercase; margin-top: 4px; }
          .invoice-title { font-size: 20px; font-weight: 700; color: #1A3B2B; text-align: right; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 12px; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #7A8580; margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
          th { background: #FAF8F5; padding: 10px; text-align: left; border-bottom: 2px solid #E8E2D8; color: #1A3B2B; font-weight: 700; }
          .totals-table { width: 280px; margin-left: auto; margin-bottom: 24px; font-size: 12px; }
          .totals-table td { padding: 6px 0; }
          .grand-total { font-size: 16px; font-weight: 800; color: #1A3B2B; border-top: 2px solid #1A3B2B; border-bottom: 2px solid #1A3B2B; padding: 8px 0; }
          .footer { border-top: 1px solid #E8E2D8; padding-top: 16px; font-size: 10px; color: #7A8580; text-align: center; }
          @media print {
            body { padding: 0; }
            .invoice-card { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="header">
            <div>
              <div class="brand-name">VL DESIGNS</div>
              <div class="brand-tagline">Women's Designer Wear &amp; Handpicked Outfits</div>
              <div style="font-size: 11px; color: #5F6762; margin-top: 4px;">Salem, Tamil Nadu, India • care@vldesigns.com • +91 98765 43210</div>
            </div>
            <div>
              <div class="invoice-title">TAX INVOICE</div>
              <div style="font-size: 12px; color: #5F6762; text-align: right; margin-top: 4px;">
                <strong>Invoice No:</strong> ${invoiceNumber}<br>
                <strong>Date:</strong> ${invoiceDate}<br>
                <strong>Order ID:</strong> <span style="font-family: monospace; font-size: 11px;">${order.id}</span>
              </div>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <div class="section-title">Billed &amp; Shipped To:</div>
              <strong>${order.customerName || 'Customer'}</strong><br>
              ${order.shippingAddress?.addressLine1 ? `${order.shippingAddress.addressLine1}<br>` : ''}
              ${order.shippingAddress?.addressLine2 ? `${order.shippingAddress.addressLine2}<br>` : ''}
              ${order.shippingAddress?.city || 'Salem / Chennai Region'}, ${order.shippingAddress?.state || 'Tamil Nadu'} - ${order.shippingAddress?.pincode || '600001'}<br>
              Phone: +91 ${order.customerPhone || '9876543210'}<br>
              ${order.customerEmail ? `Email: ${order.customerEmail}` : ''}
            </div>
            <div style="text-align: right;">
              <div class="section-title">Payment &amp; Shipping Details:</div>
              <strong>Payment Method:</strong> ${order.paymentMethod === 'upi' || order.paymentMethod === 'upi_razorpay' ? 'Instant Online UPI' : 'Cash on Delivery (COD)'}<br>
              <strong>Payment Status:</strong> ${order.paymentStatus === 'paid' ? 'Paid (Verified Online)' : 'Payment Due at Doorstep'}<br>
              <strong>Order Status:</strong> ${order.orderStatus || 'Confirmed'}<br>
              <strong>Shipping:</strong> ${shippingFee === 0 ? 'FREE (₹0)' : `₹${shippingFee}`}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">#</th>
                <th>Item Description</th>
                <th style="width: 60px; text-align: center;">Qty</th>
                <th style="width: 100px; text-align: right;">Unit Price</th>
                <th style="width: 100px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Cart Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">₹${subtotal}</td>
            </tr>
            <tr>
              <td>Shipping Fee:</td>
              <td style="text-align: right; font-weight: 600; color: ${shippingFee === 0 ? '#1E6B35' : '#D9480F'};">
                ${shippingFee === 0 ? 'FREE (₹0)' : `+₹${shippingFee}`}
              </td>
            </tr>
            <tr class="grand-total">
              <td>Total Amount:</td>
              <td style="text-align: right;">₹${order.total}</td>
            </tr>
          </table>

          <div class="footer">
            <p style="margin: 0 0 4px 0;">This is a computer-generated tax invoice. No signature required.</p>
            <p style="margin: 0;">Thank you for shopping with VL Designs! For customer support, WhatsApp +91 98765 43210.</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank', 'width=850,height=900');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(invoiceHtml);
      printWin.document.close();
    }
  };

  // Load products from MySQL DB with fallback
  useEffect(() => {
    fetchProductsFromApi().then((data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
    }).catch(() => {
      // ignore
    });
  }, []);

  // Load orders from MySQL backend DB with fallback to localStorage
  useEffect(() => {
    const loadOrders = async () => {
      let loadedFromDb = false;
      if (token && isAdmin) {
        try {
          const res = await orderApi.getAllOrdersAdmin(token);
          if (res.success && Array.isArray(res.data?.orders) && res.data.orders.length > 0) {
            const mappedOrders = res.data.orders.map((o: any) => ({
              id: String(o.id),
              orderNumber: String(o.id),
              customerName: o.shippingAddress?.fullName || o.User?.name || 'Customer',
              customerPhone: o.shippingAddress?.phone || o.User?.phone || '',
              customerEmail: o.shippingAddress?.email || o.User?.email || '',
              shippingAddress: o.shippingAddress || {
                addressLine1: 'VL Boutique Studio Dispatch',
                city: 'Salem / Chennai Region',
                state: 'Tamil Nadu',
                pincode: '600001',
              },
              items: Array.isArray(o.items) && o.items.length > 0 ? o.items : [
                {
                  title: 'VL Floral Tiered Pure Cotton Maxi Dress',
                  name: 'VL Floral Tiered Pure Cotton Maxi Dress',
                  quantity: 1,
                  price: Number(o.totalAmount),
                  image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
                },
              ],
              total: Number(o.totalAmount),
              paymentMethod: o.paymentMethod || 'cod',
              paymentStatus: o.status === 'DELIVERED' || o.paymentMethod === 'upi' ? 'paid' : 'pending',
              orderStatus: o.status === 'PLACED' ? 'Confirmed' : o.status === 'SHIPPED' ? 'Dispatched' : o.status,
              createdAt: o.createdAt || new Date().toISOString(),
              shippingFee: Number(o.shippingFee) || (o.paymentMethod === 'cod' ? 45 : 0),
            }));
            setOrders(mappedOrders);
            loadedFromDb = true;
          }
        } catch {
          // ignore
        }
      }

      if (!loadedFromDb) {
        try {
          const savedOrders = JSON.parse(localStorage.getItem('vl_orders') || '[]');
          if (savedOrders.length > 0) {
            setOrders(savedOrders);
          } else {
            // Pre-fill demo order with UUID
            setOrders([
              {
                id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                orderNumber: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
                customerName: 'Ananya Rao',
                customerPhone: '9845123456',
                customerEmail: 'ananya.rao@example.com',
                shippingAddress: {
                  addressLine1: 'Flat 302, Rosewood Heights, 4th Main',
                  city: 'Bengaluru',
                  state: 'Karnataka',
                  pincode: '560001',
                },
                items: [
                  {
                    title: INITIAL_PRODUCTS[0].title,
                    product: INITIAL_PRODUCTS[0],
                    variant: { size: 'Unstitched 3-Piece' },
                    quantity: 1,
                    price: 1399,
                    image: INITIAL_PRODUCTS[0].images[0],
                  },
                ],
                total: 1399,
                paymentMethod: 'upi_razorpay',
                paymentStatus: 'paid',
                orderStatus: 'Confirmed',
                createdAt: new Date().toISOString(),
                shippingFee: 0,
              },
            ]);
          }
        } catch {
          // ignore
        }
      }
    };

    loadOrders();
  }, [token, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await login(adminUsername, adminPassword);
    if (!res.success) {
      setAuthError(res.error || 'Credentials incorrect.');
    } else if (res.role !== 'admin') {
      setAuthError('You logged in with a Customer account. Please log in with the Admin account.');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. If admin token exists, persist to MySQL database
    if (token) {
      try {
        await adminApi.createProduct(token, {
          name: newProduct.title || 'VL Handcrafted Cotton Suit',
          title: newProduct.title || 'VL Handcrafted Cotton Suit',
          description: newProduct.description || 'Artisanal loom cotton designed directly by VL Designs.',
          price: Number(newProduct.price),
          category: newProduct.category,
          stock: Number(newProduct.stock),
          image: newProduct.imageUrl,
        });
      } catch (err) {
        console.warn('Backend product creation error, updating local state:', err);
      }
    }

    const created: Product = {
      id: `prod-${Date.now()}`,
      title: newProduct.title || 'VL Handcrafted Cotton Suit',
      slug: (newProduct.title || 'vl-handcrafted-suit').toLowerCase().replace(/\s+/g, '-'),
      description: newProduct.description || 'Artisanal loom cotton designed directly by VL Designs.',
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp),
      category: newProduct.category as any,
      productType: newProduct.productType as any,
      badge: newProduct.productType === 'own_design' ? 'VL Original Design' : 'Curated Selection',
      rating: 5.0,
      reviewCount: 1,
      fabric: newProduct.fabric,
      fabricDetails: {
        topCut: newProduct.topCut,
        bottomCut: newProduct.bottomCut,
        dupattaCut: newProduct.dupattaCut,
        material: newProduct.fabric,
        weave: 'Loom Finish',
        care: 'Hand wash cold',
      },
      images: [newProduct.imageUrl],
      variants: [
        {
          id: `v-${Date.now()}`,
          size: 'Standard Set',
          color: 'Loom Original',
          colorHex: '#1A3B2B',
          stock: Number(newProduct.stock),
        },
      ],
    };

    setProducts([created, ...products]);
    setNotification('🎉 Product added successfully to the catalog!');
    setTimeout(() => setNotification(''), 3000);
    setActiveTab('inventory');
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Attempt backend status update with UUID
    if (token && orderId) {
      try {
        const beStatus = newStatus === 'Confirmed' ? 'PLACED' : newStatus === 'Dispatched' ? 'SHIPPED' : newStatus === 'Delivered' ? 'DELIVERED' : 'PLACED';
        await orderApi.updateOrderStatusAdmin(token, orderId, beStatus);
      } catch {
        // ignore
      }
    }

    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    setOrders(updated);
    try {
      localStorage.setItem('vl_orders', JSON.stringify(updated));
      const single = localStorage.getItem(`vl_order_${orderId}`);
      if (single) {
        const parsed = JSON.parse(single);
        parsed.orderStatus = newStatus;
        localStorage.setItem(`vl_order_${orderId}`, JSON.stringify(parsed));
      }
    } catch {
      // Ignore
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#E8E2D8] shadow-xl text-center space-y-5">
          <div className="w-14 h-14 bg-[#1A3B2B] text-[#E7C875] rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#2A5A43]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1A3B2B]">VL Admin Portal</h1>
            <p className="text-xs text-[#5F6762] mt-1">Authorized Boutique Staff Only</p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#1C201D] mb-1">Admin Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C201D] mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="admin123"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full text-xs border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#9C3B24] hover:bg-[#802F1C] text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider transition-all shadow-md"
            >
              Enter Admin Dashboard
            </button>
          </form>

          <div className="pt-2 flex justify-between items-center text-xs text-[#5F6762]">
            <Link href="/" className="hover:text-[#1A3B2B]">
              ← Storefront
            </Link>
            <Link href="/account" className="hover:text-[#1A3B2B]">
              Customer Login →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* Admin Top Navigation */}
      <header className="bg-[#1A3B2B] text-white px-6 py-4 flex items-center justify-between border-b border-[#2A5A43]">
        <div className="flex items-center space-x-3">
          <span className="font-serif text-xl font-bold text-white tracking-wider">VL DESIGNS</span>
          <span className="bg-[#C29B38] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            Store Manager
          </span>
          <span className="text-[11px] text-[#D8D2C5] hidden sm:inline">
            Logged in as <strong>{user?.name || 'Administrator'}</strong>
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <Link href="/" className="text-[#D8D2C5] hover:text-white flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </Link>
          <button onClick={logout} className="text-red-300 hover:text-red-100 font-semibold">
            Sign Out
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-8">
        <div className="flex border-b border-[#E8E2D8] gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#1A3B2B] text-[#1A3B2B]'
                : 'border-transparent text-[#7A8580] hover:text-[#1C201D]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'add-product'
                ? 'border-[#1A3B2B] text-[#1A3B2B]'
                : 'border-transparent text-[#7A8580] hover:text-[#1C201D]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Design / Piece</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'inventory'
                ? 'border-[#1A3B2B] text-[#1A3B2B]'
                : 'border-transparent text-[#7A8580] hover:text-[#1C201D]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catalog &amp; Inventory ({products.length})</span>
          </button>
        </div>

        {notification && (
          <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl font-semibold">
            {notification}
          </div>
        )}

        {/* Tab 1: Orders Tab */}
        {activeTab === 'orders' && (
          <div className="mt-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8E2D8] overflow-hidden shadow-xs">
              <div className="p-4 bg-[#FAF8F5] border-b border-[#E8E2D8] flex items-center justify-between text-xs">
                <span className="font-bold text-[#1C201D]">All Received Orders</span>
                <span className="text-[#5F6762]">Automatically saved from storefront checkout</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#5F6762]">
                  No orders placed yet. Place a test order from the checkout page!
                </div>
              ) : (
                <div className="divide-y divide-[#E8E2D8] overflow-x-auto">
                  {orders.map((o) => {
                    const firstItem = o.items && o.items.length > 0 ? o.items[0] : null;
                    const itemImage =
                      firstItem?.image ||
                      firstItem?.product?.images?.[0] ||
                      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600';
                    const itemTitle =
                      firstItem?.title ||
                      firstItem?.name ||
                      firstItem?.product?.title ||
                      'VL Designer Women Wear Piece';
                    const isUpi = o.paymentMethod === 'upi' || o.paymentMethod === 'upi_razorpay';

                    return (
                      <div
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-[#FAF8F5] transition-all cursor-pointer group"
                      >
                        {/* Left: Product Small Image + Item & Customer Summary (Order ID NOT displayed here) */}
                        <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
                          {/* Small Image of Product */}
                          <div className="relative shrink-0">
                            <img
                              src={itemImage}
                              alt={itemTitle}
                              className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-[#E8E2D8] shadow-xs group-hover:border-[#1A3B2B] transition-colors"
                            />
                            {o.items && o.items.length > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-[#1A3B2B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-xs">
                                +{o.items.length - 1}
                              </span>
                            )}
                          </div>

                          {/* Order Details (NO Order ID displayed) */}
                          <div className="space-y-1 min-w-0">
                            <h4 className="font-semibold text-xs sm:text-sm text-[#1C201D] group-hover:text-[#1A3B2B] transition-colors truncate">
                              {itemTitle}
                            </h4>

                            <div className="flex flex-wrap items-center gap-2 text-[11px]">
                              <span className="text-[#7A8580] flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-[#C29B38]" />
                                <span>{formatDate(o.createdAt)}</span>
                              </span>

                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isUpi
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                                }`}
                              >
                                {isUpi ? 'Prepaid (UPI)' : 'COD (Payment Pending)'}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#5F6762] truncate">
                              <span className="font-medium text-[#1C201D]">{o.customerName || 'Customer'}</span>
                              {o.customerPhone ? ` • Ph: +91 ${o.customerPhone}` : ''}
                              {o.shippingAddress?.city ? ` • ${o.shippingAddress.city}` : ''}
                            </p>

                            <p className="text-[10px] text-[#C29B38] font-bold group-hover:underline flex items-center space-x-1 pt-0.5">
                              <Eye className="w-3 h-3" />
                              <span>Click to view full details &amp; download invoice →</span>
                            </p>
                          </div>
                        </div>

                        {/* Right: Total Amount & Status */}
                        <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8E2D8]">
                          <div className="text-left md:text-right">
                            <span className="text-[11px] text-[#5F6762] block">Total Amount</span>
                            <span className="text-base font-extrabold text-[#1A3B2B]">₹{o.total}</span>
                          </div>

                          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={o.orderStatus}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                              className="bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C201D] outline-none hover:border-[#1A3B2B] transition-colors"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed & Quality Checked">Packed &amp; QC</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="bg-[#1A3B2B] hover:bg-[#2A5A43] text-white p-2 rounded-xl transition-all shadow-xs"
                              title="View Full Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Add Product Form */}
        {activeTab === 'add-product' && (
          <div className="mt-8 max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E2D8] shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#1A3B2B] mb-1">
              Add New Piece or Fabric to Store
            </h2>
            <p className="text-xs text-[#5F6762] mb-6">
              Specify fabric cuts, design origin, and pricing details.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1C201D] mb-1">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. VL Pure Kalyani Cotton Handloom Suit"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  required
                  className="w-full border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1A3B2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#1C201D] mb-1">Design Origin *</label>
                  <select
                    value={newProduct.productType}
                    onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value })}
                    className="w-full border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none"
                  >
                    <option value="own_design">✨ Our Own Design (Raw to Finish)</option>
                    <option value="resold">🛍️ Curated Resale Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C201D] mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none"
                  >
                    <option value="Unstitched Suit Material">Unstitched Suit Material</option>
                    <option value="Cotton Sarees">Cotton Sarees</option>
                    <option value="Kurtis & Sets">Kurtis & Sets</option>
                    <option value="Linen Essentials">Linen Essentials</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#1C201D] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    required
                    className="w-full border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C201D] mb-1">Original MRP (₹) *</label>
                  <input
                    type="number"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })}
                    required
                    className="w-full border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C201D] mb-1">Top Cut</label>
                  <input
                    type="text"
                    value={newProduct.topCut}
                    onChange={(e) => setNewProduct({ ...newProduct, topCut: e.target.value })}
                    className="w-full border border-[#D8D2C5] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C201D] mb-1">Bottom Cut</label>
                  <input
                    type="text"
                    value={newProduct.bottomCut}
                    onChange={(e) => setNewProduct({ ...newProduct, bottomCut: e.target.value })}
                    className="w-full border border-[#D8D2C5] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C201D] mb-1">Dupatta</label>
                  <input
                    type="text"
                    value={newProduct.dupattaCut}
                    onChange={(e) => setNewProduct({ ...newProduct, dupattaCut: e.target.value })}
                    className="w-full border border-[#D8D2C5] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C201D] mb-1">Fabric Image URL</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C201D] mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                  className="w-full border border-[#D8D2C5] rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A3B2B] hover:bg-[#2A5A43] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-md"
              >
                Publish Piece to Live Storefront
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Inventory */}
        {activeTab === 'inventory' && (
          <div className="mt-8 bg-white rounded-2xl border border-[#E8E2D8] overflow-hidden shadow-xs">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E8E2D8] flex justify-between items-center text-xs font-bold">
              <span>Current Catalog Products ({products.length})</span>
            </div>

            <div className="divide-y divide-[#E8E2D8]">
              {products.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={p.images[0]} alt={p.title} className="w-12 h-14 object-cover rounded-lg border" />
                    <div>
                      <p className="font-bold text-[#1C201D]">{p.title}</p>
                      <p className="text-[11px] text-[#5F6762]">{p.fabric} • {p.category}</p>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                        p.productType === 'own_design' ? 'bg-[#FBF7EE] text-[#1A3B2B] border border-[#E8DFC9]' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {p.productType === 'own_design' ? '✨ In-House Design' : '🛍️ Curated'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-[#1A3B2B] block text-sm">₹{p.price}</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">Stock: Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Order Details & Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E2D8] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1A3B2B] text-white p-5 sm:p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-lg font-bold">Order Full Details</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    selectedOrder.orderStatus === 'Delivered'
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                      : selectedOrder.orderStatus === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                      : 'bg-[#C29B38]/20 text-[#E7C875] border-[#C29B38]/30'
                  }`}>
                    {selectedOrder.orderStatus || 'Confirmed'}
                  </span>
                </div>
                <p className="text-xs text-[#D8D2C5] mt-1">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Order UUID Bar */}
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8] flex items-center justify-between gap-2">
                <span className="text-[#5F6762] font-semibold shrink-0">Order UUID:</span>
                <code className="font-mono text-xs font-bold text-[#1A3B2B] truncate select-all">{selectedOrder.id}</code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedOrder.id);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  className="shrink-0 text-xs text-[#1A3B2B] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* 2-Column Info: Customer & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Customer Details */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D8] space-y-2">
                  <h4 className="font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-1.5 text-[11px]">
                    <UserIcon className="w-3.5 h-3.5 text-[#1A3B2B]" />
                    <span>Customer &amp; Recipient</span>
                  </h4>
                  <p className="font-semibold text-sm text-[#1C201D]">{selectedOrder.customerName || 'Customer'}</p>
                  <p className="text-[#5F6762]">
                    <strong>Phone:</strong> +91 {selectedOrder.customerPhone || '9876543210'}
                  </p>
                  {selectedOrder.customerEmail && (
                    <p className="text-[#5F6762]">
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </p>
                  )}
                  {selectedOrder.userUsername && (
                    <p className="text-[#5F6762]">
                      <strong>Account:</strong> @{selectedOrder.userUsername}
                    </p>
                  )}
                </div>

                {/* Delivery Address */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D8] space-y-2">
                  <h4 className="font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#C29B38]" />
                    <span>Delivery Address</span>
                  </h4>
                  <p className="text-[#1C201D] leading-relaxed">
                    {selectedOrder.shippingAddress?.addressLine1 && (
                      <span className="block">{selectedOrder.shippingAddress.addressLine1}</span>
                    )}
                    {selectedOrder.shippingAddress?.addressLine2 && (
                      <span className="block text-[#5F6762]">{selectedOrder.shippingAddress.addressLine2}</span>
                    )}
                    <span className="block font-medium">
                      {selectedOrder.shippingAddress?.city || 'Salem / Chennai Region'}, {selectedOrder.shippingAddress?.state || 'Tamil Nadu'}
                    </span>
                    <span className="block font-bold text-[#1A3B2B]">
                      PIN: {selectedOrder.shippingAddress?.pincode || '600001'}
                    </span>
                  </p>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D8] space-y-2">
                  <h4 className="font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-1.5 text-[11px]">
                    <CreditCard className="w-3.5 h-3.5 text-[#1E6B35]" />
                    <span>Payment Information</span>
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-[#5F6762]">Payment Mode:</span>
                    <strong className="text-[#1C201D]">
                      {selectedOrder.paymentMethod === 'upi' || selectedOrder.paymentMethod === 'upi_razorpay'
                        ? 'Instant Online UPI'
                        : 'Cash on Delivery (COD)'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6762]">Payment Status:</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      selectedOrder.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {selectedOrder.paymentStatus === 'paid' ? 'Paid (Verified Online)' : 'Payment Due at Doorstep'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6762]">Shipping Charge:</span>
                    <strong className={selectedOrder.shippingFee === 0 ? 'text-[#1E6B35]' : 'text-[#D9480F]'}>
                      {selectedOrder.shippingFee === 0 ? 'FREE (₹0)' : `+₹${selectedOrder.shippingFee || 45}`}
                    </strong>
                  </div>
                </div>

                {/* Status Management */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D8] space-y-2">
                  <h4 className="font-bold text-[#1C201D] uppercase tracking-wider flex items-center space-x-1.5 text-[11px]">
                    <Truck className="w-3.5 h-3.5 text-[#1A3B2B]" />
                    <span>Manage Dispatch Status</span>
                  </h4>
                  <p className="text-[11px] text-[#5F6762]">Update delivery pipeline status in database:</p>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder.id, e.target.value);
                      setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value });
                    }}
                    className="w-full bg-white border border-[#D8D2C5] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C201D] outline-none focus:border-[#1A3B2B]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed & Quality Checked">Packed &amp; QC</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Ordered Items Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#1C201D] uppercase tracking-wider text-[11px]">
                  Ordered Products ({selectedOrder.items?.length || 1})
                </h4>

                <div className="border border-[#E8E2D8] rounded-2xl overflow-hidden divide-y divide-[#E8E2D8]">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((it: any, idx: number) => {
                      const itImage =
                        it.image ||
                        it.product?.images?.[0] ||
                        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600';
                      const itTitle = it.title || it.name || it.product?.title || 'VL Designer Piece';
                      const itPrice = it.price || it.product?.price || (selectedOrder.total / (it.quantity || 1));
                      const itQty = it.quantity || 1;

                      return (
                        <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                          <div className="flex items-center space-x-3 min-w-0">
                            <img
                              src={itImage}
                              alt={itTitle}
                              className="w-12 h-14 object-cover rounded-xl border border-[#E8E2D8] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-[#1C201D] truncate">{itTitle}</p>
                              <p className="text-[11px] text-[#5F6762]">
                                {it.variant?.size ? `${it.variant.size} • ` : ''}Qty: {itQty}
                              </p>
                              <p className="text-[11px] text-[#7A8580]">Unit Price: ₹{itPrice}</p>
                            </div>
                          </div>
                          <span className="font-extrabold text-[#1A3B2B] text-sm shrink-0">
                            ₹{itPrice * itQty}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-[#5F6762]">
                      1x VL Handcrafted Women Outfit • ₹{selectedOrder.total}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D8] space-y-2">
                <div className="flex justify-between text-[#5F6762]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C201D]">
                    ₹{Math.max(0, selectedOrder.total - (selectedOrder.shippingFee || (selectedOrder.paymentMethod === 'cod' ? 45 : 0)))}
                  </span>
                </div>
                <div className="flex justify-between text-[#5F6762]">
                  <span>Shipping Fee</span>
                  <span className={`font-semibold ${selectedOrder.shippingFee === 0 ? 'text-[#1E6B35]' : 'text-[#D9480F]'}`}>
                    {selectedOrder.shippingFee === 0 ? 'FREE (₹0)' : `+₹${selectedOrder.shippingFee || 45}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#E8E2D8] text-sm font-bold text-[#1C201D]">
                  <span>Total Amount</span>
                  <span className="text-xl font-black text-[#1A3B2B]">₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer with "Download Invoice" Button */}
            <div className="p-5 bg-[#FAF8F5] border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadInvoice(selectedOrder)}
                className="w-full sm:w-auto bg-[#1A3B2B] hover:bg-[#2A5A43] text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#E7C875]" />
                <span>Download Invoice (PDF / Print)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto bg-white border border-[#D8D2C5] text-[#1C201D] hover:bg-neutral-50 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
