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
  Filter
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user, isAdmin, login, logout } = useAuth();
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'add-product' | 'inventory'>('orders');

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

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

  // Load orders from localStorage
  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('vl_orders') || '[]');
      if (savedOrders.length > 0) {
        setOrders(savedOrders);
      } else {
        // Pre-fill demo order
        setOrders([
          {
            id: 'VL-849102',
            orderNumber: 'VL-849102',
            customerName: 'Ananya Rao',
            customerPhone: '9845123456',
            shippingAddress: { city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
            items: [{ product: INITIAL_PRODUCTS[0], variant: { size: 'Unstitched 3-Piece' }, quantity: 1 }],
            total: 1399,
            paymentMethod: 'upi_razorpay',
            paymentStatus: 'paid',
            orderStatus: 'Confirmed',
            createdAt: new Date().toLocaleDateString('en-IN'),
          },
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = login(adminUsername, adminPassword);
    if (!res.success) {
      setAuthError(res.error || 'Credentials incorrect.');
    } else if (res.role !== 'admin') {
      setAuthError('You logged in with a Customer account. Please log in with the Admin account.');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
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

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('vl_orders', JSON.stringify(updated));
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

          {/* Credentials Info Pill */}
          <div className="bg-[#FBF7EE] p-3 rounded-2xl border border-[#E8DFC9] text-left text-xs">
            <p className="font-bold text-[#1A3B2B] flex items-center space-x-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
              <span>Admin Credentials:</span>
            </p>
            <p className="text-[11px] text-[#5F6762]">
              Username: <strong className="text-[#1C201D]">admin</strong> | Password: <strong className="text-[#1C201D]">admin123</strong>
            </p>
            <button
              type="button"
              onClick={() => login('admin', 'admin123')}
              className="mt-2 w-full bg-[#1A3B2B] text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#2A5A43] transition-colors"
            >
              1-Click Instant Admin Login
            </button>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
                  {orders.map((o) => (
                    <div key={o.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#1A3B2B]">{o.id}</span>
                          <span className="text-[#7A8580]">• {o.createdAt}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentMethod === 'upi_razorpay'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {o.paymentMethod === 'upi_razorpay' ? 'Prepaid (UPI)' : 'COD (Payment Pending)'}
                          </span>
                        </div>

                        <p className="font-semibold text-[#1C201D] mt-1.5">
                          {o.customerName || 'Customer'} • Ph: +91 {o.customerPhone || '9876543210'}
                        </p>
                        <p className="text-[#5F6762] text-[11px]">
                          Destination: {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}
                        </p>
                        <p className="text-[11px] text-[#1A3B2B] font-medium mt-1">
                          Items: {o.items?.map((it: any) => `${it.product?.title} (x${it.quantity})`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-xs text-[#5F6762] block">Total Amount</span>
                          <span className="text-base font-extrabold text-[#1A3B2B]">₹{o.total}</span>
                        </div>

                        {/* Status Select */}
                        <select
                          value={o.orderStatus}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="bg-[#FAF8F5] border border-[#D8D2C5] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C201D] outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed & Quality Checked">Packed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
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
    </div>
  );
}
