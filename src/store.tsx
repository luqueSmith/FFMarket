/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  SellerProfile,
  Product,
  CartItem,
  Order,
  Review,
  Report,
  Coupon,
  Notification,
  Conversation,
  Message,
  SupportTicket,
  DailyMission,
  AuditLog,
  AppSettings,
  UserRole,
  PointPackage,
  DailyStreak
} from './types';
import {
  mockCurrentUser,
  mockCurrentSellerProfile,
  mockSellers,
  mockProducts,
  mockPointPackages,
  mockCoupons,
  mockNotifications,
  mockConversations,
  mockMessages,
  mockNews,
  mockFaq,
  mockMissions,
  mockReviews,
  mockReports,
  mockAuditLogs,
  initialSettings
} from './mockData';

// --- SELLER POINTS RULES ---
export const POINT_COSTS = {
  publish_account: 20,
  renew_listing: 10,
  top_feature: 50,
  highlight: 100,
  add_video: 30,
  extra_image: 5,
  extend_duration: 15,
  publish_offer: 25,
  publish_diamonds: 15,
  publish_recharges: 15,
  change_cover: 5,
  change_price: 2,
  add_tags: 3,
  premium_promo: 200,
};

interface AppContextType {
  // Config & Logs
  appSettings: AppSettings;
  auditLogs: AuditLog[];
  
  // Active states
  currentRole: UserRole;
  activeView: string; // 'home' | 'marketplace' | 'diamantes' | 'recargas' | 'ofertas' | 'news' | 'faq' | 'contact' | 'dashboard_user' | 'dashboard_seller' | 'dashboard_admin' | 'public_seller'
  selectedSellerId: string | null;
  selectedProductId: string | null;
  activeChatConvId: string | null;
  setActiveChatConvId: (convId: string | null) => void;

  // Databases (stateful)
  usersList: Profile[];
  sellersList: SellerProfile[];
  products: Product[];
  reviewsList: Review[];
  reportsList: Report[];
  notifications: Notification[];
  conversations: Conversation[];
  messages: Message[];
  orders: Order[];
  supportTickets: SupportTicket[];
  coupons: Coupon[];
  dailyMissions: DailyMission[];
  dailyStreak: DailyStreak;

  // User details
  isLoggedIn: boolean;
  userProfile: Profile;
  sellerProfile: SellerProfile;
  favorites: string[];
  cart: CartItem[];
  activeCoupon: Coupon | null;

  // Utilities / Methods
  setCurrentRole: (role: UserRole) => void;
  setActiveView: (view: string, sellerId?: string | null, productId?: string | null) => void;
  addAuditLog: (action: string, details: string) => void;

  // Cart & Orders
  isCartOverlayOpen: boolean;
  setIsCartOverlayOpen: (open: boolean) => void;
  openCartModal: () => void;
  cartToast: { show: boolean; title: string; image?: string; timestamp?: number } | null;
  dismissCartToast: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  checkout: (paymentMethod: string, userPhone?: string, playerId?: string) => { success: boolean; message: string; order?: Order };
  issueBoleta: (orderId: string) => { success: boolean; message: string; order?: Order };

  // Likes & Favorites
  toggleFavorite: (productId: string) => void;
  likeProduct: (productId: string, remove?: boolean) => void;
  dislikeProduct: (productId: string, remove?: boolean) => void;

  // Interactions
  addReview: (rating: number, comment: string, sellerId: string, productId?: string) => void;
  reportSellerOrProduct: (type: Report['type'], reason: string, sellerId?: string, productId?: string) => void;
  followSeller: (sellerId: string) => void;
  isFollowingSeller: (sellerId: string) => boolean;

  // Seller Actions & Points
  purchasePoints: (pkgId: string) => void;
  sellerAddProduct: (productData: Partial<Product>) => { success: boolean; message: string };
  sellerDeductPoints: (actionName: keyof typeof POINT_COSTS, description: string) => boolean;
  sellerRenewProduct: (productId: string) => boolean;
  sellerHighlightProduct: (productId: string) => boolean;
  sellerTopFeature: (productId: string) => boolean;
  sellerPremiumPromo: (productId: string) => boolean;

  // Rewards
  claimDailyReward: () => void;
  claimMissionReward: (missionId: string) => void;
  addReferral: (email: string) => { success: boolean; message: string };

  // Chat
  sendMessage: (conversationId: string, text: string) => void;
  startConversation: (sellerId: string, sellerName: string, sellerAvatar: string) => string;

  // Support
  addSupportTicket: (subject: string, message: string) => void;

  // Admin Controls
  adminCreateUser: (userData: { username: string; email: string; role: UserRole; password?: string }) => { success: boolean; message: string };
  adminUpdateUser: (userId: string, updates: Partial<Profile>) => void;
  adminUpdateSeller: (sellerId: string, updates: Partial<SellerProfile>) => void;
  adminDeleteProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  adminResolveReport: (reportId: string, action: 'resolve' | 'reject' | 'ban_seller') => void;
  adminAddCoupon: (coupon: Coupon) => void;
  adminUpdateSettings: (settings: Partial<AppSettings>) => void;
  adminGivePoints: (sellerId: string, amount: number) => void;

  // Authentication & Simulation
  loginAsUser: (userId: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states, favoring localStorage if available, or fallback to mockData
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('ff_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('ff_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('ff_current_role') as UserRole) || 'Usuario';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('ff_is_logged_in');
    return saved ? saved === 'true' : true;
  });

  const [activeView, setActiveViewState] = useState<string>(() => {
    const savedLogin = localStorage.getItem('ff_is_logged_in');
    return savedLogin === 'false' ? 'login' : 'home';
  });
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeChatConvId, setActiveChatConvId] = useState<string | null>(null);

  const [usersList, setUsersList] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('ff_users_list');
    if (saved) return JSON.parse(saved);
    // Add additional sample users
    return [
      mockCurrentUser,
      { id: 'u2', username: 'FF_MegaStore', email: 'megastore@ffmarket.com', avatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80', role: 'Vendedor', level: 10, purchaseCount: 0, points: 50, badges: [], achievements: [], createdAt: '2025-05-12T14:40:00Z' },
      { id: 'u3', username: 'ChronoSales_ES', email: 'chrono@ffmarket.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'Vendedor', level: 4, purchaseCount: 2, points: 15, badges: [], achievements: [], createdAt: '2026-03-22T19:15:00Z' },
      { id: 'u4', username: 'DiamondGamer_LATAM', email: 'diamond@ffmarket.com', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', role: 'Vendedor', level: 7, purchaseCount: 1, points: 30, badges: [], achievements: [], createdAt: '2025-09-01T11:00:00Z' },
      { id: 'u5', username: 'GamerPro_9', email: 'gamer9@gmail.com', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', role: 'Usuario', level: 3, purchaseCount: 12, points: 120, badges: [], achievements: [], createdAt: '2026-04-10T08:00:00Z' },
      { id: 'admin1', username: 'FF_Admin_Master', email: 'admin@ffmarketpro.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'Administrador', level: 99, purchaseCount: 0, points: 9999, badges: [], achievements: [], createdAt: '2025-01-01T00:00:00Z' }
    ];
  });

  const [sellersList, setSellersList] = useState<SellerProfile[]>(() => {
    const saved = localStorage.getItem('ff_sellers_list');
    return saved ? JSON.parse(saved) : mockSellers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ff_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        const parsedIds = new Set(parsed.map(p => p.id));
        const missing = mockProducts.filter(p => !parsedIds.has(p.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('ff_products', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        return mockProducts;
      }
    }
    return mockProducts;
  });

  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ff_reviews_list');
    return saved ? JSON.parse(saved) : mockReviews;
  });

  const [reportsList, setReportsList] = useState<Report[]>(() => {
    const saved = localStorage.getItem('ff_reports_list');
    return saved ? JSON.parse(saved) : mockReports;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ff_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('ff_conversations');
    return saved ? JSON.parse(saved) : mockConversations;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('ff_messages');
    return saved ? JSON.parse(saved) : mockMessages;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ff_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('ff_support_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('ff_coupons');
    return saved ? JSON.parse(saved) : mockCoupons;
  });

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    const saved = localStorage.getItem('ff_daily_missions');
    return saved ? JSON.parse(saved) : mockMissions;
  });

  const [dailyStreak, setDailyStreak] = useState<DailyStreak>(() => {
    const saved = localStorage.getItem('ff_daily_streak');
    return saved ? JSON.parse(saved) : { streak: 3, lastClaimed: null, availableToday: true };
  });

  const [userProfile, setUserProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('ff_user_profile');
    const profile = saved ? JSON.parse(saved) : mockCurrentUser;
    if (!profile.avatar || profile.avatar.includes('images.unsplash.com/photo-1566492031773-4f4e44671857')) {
      profile.avatar = "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-01.png?raw=true";
    }
    return profile;
  });

  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(() => {
    const saved = localStorage.getItem('ff_seller_profile');
    return saved ? JSON.parse(saved) : mockCurrentSellerProfile;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ff_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ff_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Followed sellers list in user profile
  const [followedSellers, setFollowedSellers] = useState<string[]>(() => {
    const saved = localStorage.getItem('ff_followed_sellers');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep localStorage in sync with our state
  useEffect(() => {
    localStorage.setItem('ff_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    localStorage.setItem('ff_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('ff_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('ff_sellers_list', JSON.stringify(sellersList));
  }, [sellersList]);

  useEffect(() => {
    localStorage.setItem('ff_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ff_reviews_list', JSON.stringify(reviewsList));
  }, [reviewsList]);

  useEffect(() => {
    localStorage.setItem('ff_reports_list', JSON.stringify(reportsList));
  }, [reportsList]);

  useEffect(() => {
    localStorage.setItem('ff_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ff_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('ff_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ff_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ff_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('ff_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('ff_daily_missions', JSON.stringify(dailyMissions));
  }, [dailyMissions]);

  useEffect(() => {
    localStorage.setItem('ff_daily_streak', JSON.stringify(dailyStreak));
  }, [dailyStreak]);

  useEffect(() => {
    localStorage.setItem('ff_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('ff_seller_profile', JSON.stringify(sellerProfile));
  }, [sellerProfile]);

  useEffect(() => {
    localStorage.setItem('ff_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ff_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ff_followed_sellers', JSON.stringify(followedSellers));
  }, [followedSellers]);

  // --- UTILITIES ---
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: "al_" + Date.now(),
      userId: userProfile.id,
      username: userProfile.username,
      role: currentRole,
      action,
      details,
      ipAddress: "190.160.45.210",
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem('ff_current_role', role);
    addAuditLog("Cambio de Rol", `Usuario cambió su rol activo a: ${role}`);
    
    // Automatically swap active view if they enter dashboard
    if (role === 'Usuario' && activeView.startsWith('dashboard_')) {
      setActiveViewState('dashboard_user');
    } else if (role === 'Vendedor' && activeView.startsWith('dashboard_')) {
      setActiveViewState('dashboard_seller');
    } else if (role === 'Administrador' && activeView.startsWith('dashboard_')) {
      setActiveViewState('dashboard_admin');
    }
  };

  const setActiveView = (view: string, sellerId: string | null = null, productId: string | null = null) => {
    setActiveViewState(view);
    setSelectedSellerId(sellerId);
    setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendNotification = (userId: string, title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: "n_" + Date.now() + Math.random().toString(36).substr(2, 4),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- CART OVERLAY & TOAST STATE ---
  const [isCartOverlayOpen, setIsCartOverlayOpen] = useState(false);
  const openCartModal = () => setIsCartOverlayOpen(true);
  const [cartToast, setCartToast] = useState<{ show: boolean; title: string; image?: string; timestamp?: number } | null>(null);
  const dismissCartToast = () => setCartToast(null);

  // --- CART OPERATIONS ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, product, quantity: 1 }];
    });
    const img = product.images && product.images.length > 0 ? product.images[0] : undefined;
    setCartToast({ show: true, title: product.title, image: img, timestamp: Date.now() });
    addAuditLog("Carrito", `Agregó al carrito: ${product.title}`);
    sendNotification(userProfile.id, "Carrito Actualizado", `Has agregado '${product.title}' a tu carrito de compras.`, 'system');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    addAuditLog("Carrito", `Eliminó del carrito ID: ${productId}`);
  };

  const updateCartQty = (productId: string, qty: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const targetQty = Math.max(1, Math.min(qty, item.product.stock));
        return { ...item, quantity: targetQty };
      }
      return item;
    }));
  };

  const applyCoupon = (code: string) => {
    const codeUpper = code.toUpperCase().trim();
    const found = coupons.find(c => c.code === codeUpper);
    if (!found) {
      return { success: false, message: "Código de cupón no válido o inexistente." };
    }
    if (!found.isActive) {
      return { success: false, message: "Este cupón de descuento ya ha expirado o está desactivado." };
    }
    if (found.usedCount >= found.maxUses) {
      return { success: false, message: "Este cupón ha superado su límite máximo de canje." };
    }
    
    setActiveCoupon(found);
    return { success: true, message: `Cupón ${found.code} aplicado con éxito (${found.discountType === 'percent' ? found.discountValue + '%' : '$' + found.discountValue} de descuento).` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const checkout = (paymentMethod: string, userPhone?: string, playerId?: string) => {
    if (cart.length === 0) return { success: false, message: "Tu carrito de compras está vacío." };

    let subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    let discount = 0;

    if (activeCoupon) {
      if (activeCoupon.discountType === 'percent') {
        discount = subtotal * (activeCoupon.discountValue / 100);
      } else {
        discount = activeCoupon.discountValue;
      }
    }

    const total = Math.max(0, subtotal - discount);
    const pointsEarned = Math.floor(total * 2); // 2 reward points for every dollar spent

    // 1. Create order record with 'pending' status until seller issues the official boleta
    const newOrderId = "ORD_" + Date.now();
    const phoneToUse = userPhone || userProfile.phone || "+51 906328464";

    const newOrder: Order = {
      id: newOrderId,
      userId: userProfile.id,
      userName: userProfile.username,
      userPhone: phoneToUse,
      playerId: playerId || '',
      total,
      status: 'pending',
      items: cart.map(item => ({
        id: "item_" + Math.random().toString(36).substr(2, 4),
        orderId: newOrderId,
        productId: item.product.id,
        productTitle: item.product.title,
        productType: item.product.type,
        price: item.product.price,
        quantity: item.quantity,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName
      })),
      paymentMethod,
      pointsEarned,
      createdAt: new Date().toISOString()
    };

    // 2. Add to orders list
    setOrders(prev => [newOrder, ...prev]);

    // 3. Update products stocks & notify sellers
    const updatedProducts = products.map(p => {
      const cartMatch = cart.find(item => item.id === p.id);
      if (cartMatch) {
        const remainingStock = Math.max(0, p.stock - cartMatch.quantity);
        
        // Notify Seller of pending purchase request
        sendNotification(
          p.sellerId,
          "¡Nueva Solicitud de Pedido!",
          `El cliente ${userProfile.username} solicita ${cartMatch.quantity} unidad(es) de '${p.title}'. Revisa para verificar el pago y emitir su Boleta.`,
          'sale'
        );

        return {
          ...p,
          stock: remainingStock,
          status: remainingStock === 0 ? ('sold' as const) : p.status
        };
      }
      return p;
    });
    setProducts(updatedProducts);

    // 4. If coupon was used, increment coupon uses counter
    if (activeCoupon) {
      setCoupons(prev => prev.map(c => c.id === activeCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c));
    }

    // 5. Clear cart & Active coupon
    setCart([]);
    setActiveCoupon(null);

    addAuditLog("Solicitud de Compra", `Solicitud creada. Total: $${total.toFixed(2)}. ID Orden: ${newOrderId}`);
    sendNotification(
      userProfile.id,
      "Solicitud de Pedido Registrada",
      `Tu pedido por $${total.toFixed(2)} se ha registrado. Para recibir tu entrega y Boleta Oficial, envía tu orden al vendedor por WhatsApp.`,
      'purchase'
    );

    return { success: true, message: `Solicitud registrada con éxito. ID de Orden: ${newOrderId}`, order: newOrder };
  };

  const issueBoleta = (orderId: string) => {
    const existingOrder = orders.find(o => o.id === orderId);
    if (!existingOrder) {
      return { success: false, message: "No se encontró la orden especificada." };
    }

    const boletaNum = existingOrder.boletaNumber || ("BOL-" + Math.floor(100000 + Math.random() * 900000));
    const updatedOrder: Order = {
      ...existingOrder,
      status: 'completed',
      boletaNumber: boletaNum
    };

    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));

    // Update buyer reward points & purchase count
    setUserProfile(prev => ({
      ...prev,
      purchaseCount: prev.purchaseCount + updatedOrder.items.length,
      points: prev.points + updatedOrder.pointsEarned
    }));

    // Update sellers sales counts
    updatedOrder.items.forEach(item => {
      if (item.sellerId) {
        setSellersList(prevSellers => prevSellers.map(s => {
          if (s.id === item.sellerId) {
            return {
              ...s,
              salesCount: s.salesCount + item.quantity,
              points: s.points + Math.floor(item.price * item.quantity * 0.5)
            };
          }
          return s;
        }));
      }
    });

    sendNotification(
      updatedOrder.userId,
      "¡Boleta Emitida!",
      `El vendedor ha verificado tu pago y emitido tu Boleta Oficial N° ${boletaNum}. Puedes ver e imprimir tu comprobante en Mis Compras.`,
      'purchase'
    );

    addAuditLog("Emisión de Boleta", `Boleta ${boletaNum} emitida para Orden ${orderId}`);

    return { success: true, message: `Boleta ${boletaNum} emitida exitosamente.`, order: updatedOrder };
  };

  // --- LIKES, DISLIKES & FAVORITES ---
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addAuditLog("Favorito", `Eliminó de favoritos: ${productId}`);
        return prev.filter(id => id !== productId);
      } else {
        addAuditLog("Favorito", `Agregó a favoritos: ${productId}`);
        return [...prev, productId];
      }
    });
  };

  const likeProduct = (productId: string, remove?: boolean) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        setSellersList(prevSellers => prevSellers.map(s => {
          if (s.id === p.sellerId) {
            const newLikes = remove ? Math.max(0, s.likesCount - 1) : s.likesCount + 1;
            const total = newLikes + s.dislikesCount;
            const rep = total > 0 ? Math.round((newLikes / total) * 100) : 100;
            return { ...s, likesCount: newLikes, reputation: rep };
          }
          return s;
        }));
        
        if (!remove) {
          sendNotification(p.sellerId, "¡Te han dado un Like! 👍", `Un usuario ha valorado positivamente tu producto: '${p.title}'.`, 'like');
        }
        return { ...p, likes: remove ? Math.max(0, p.likes - 1) : p.likes + 1 };
      }
      return p;
    }));
  };

  const dislikeProduct = (productId: string, remove?: boolean) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        setSellersList(prevSellers => prevSellers.map(s => {
          if (s.id === p.sellerId) {
            const newDislikes = remove ? Math.max(0, s.dislikesCount - 1) : s.dislikesCount + 1;
            const total = s.likesCount + newDislikes;
            const rep = total > 0 ? Math.round((s.likesCount / total) * 100) : 100;
            return { ...s, dislikesCount: newDislikes, reputation: rep };
          }
          return s;
        }));
        return { ...p, dislikes: remove ? Math.max(0, (p.dislikes || 0) - 1) : (p.dislikes || 0) + 1 };
      }
      return p;
    }));
  };

  // --- INTERACTIONS ---
  const addReview = (rating: number, comment: string, sellerId: string, productId?: string) => {
    const newReview: Review = {
      id: "rev_" + Date.now(),
      userId: userProfile.id,
      username: userProfile.username,
      avatar: userProfile.avatar,
      productId,
      sellerId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    
    setReviewsList(prev => [newReview, ...prev]);

    // Recalculate Seller Average Rating
    setSellersList(prev => prev.map(s => {
      if (s.id === sellerId) {
        const relatedReviews = [newReview, ...reviewsList.filter(r => r.sellerId === sellerId)];
        const avg = relatedReviews.reduce((sum, r) => sum + r.rating, 0) / relatedReviews.length;
        return { ...s, ratingAverage: parseFloat(avg.toFixed(2)) };
      }
      return s;
    }));

    addAuditLog("Reseña", `Dejó una reseña de ${rating} estrellas para el vendedor ID: ${sellerId}`);
    sendNotification(sellerId, "Nueva Calificación", `Has recibido una nueva opinión de ${rating} estrellas: "${comment.substring(0, 30)}..."`, 'like');
  };

  const reportSellerOrProduct = (type: Report['type'], reason: string, sellerId?: string, productId?: string) => {
    const newReport: Report = {
      id: "rep_" + Date.now(),
      userId: userProfile.id,
      username: userProfile.username,
      sellerId,
      productId,
      type,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setReportsList(prev => [newReport, ...prev]);

    if (sellerId) {
      setSellersList(prev => prev.map(s => {
        if (s.id === sellerId) {
          return { ...s, reportsCount: s.reportsCount + 1 };
        }
        return s;
      }));
    }

    addAuditLog("Reporte", `Filió un reporte contra ${sellerId ? 'vendedor' : 'producto'} por: ${reason}`);
    sendNotification(userProfile.id, "Reporte Recibido", "Tu reporte ha sido enviado al equipo de administración para su revisión.", 'system');
  };

  const followSeller = (sellerId: string) => {
    // Prevent self-following logic
    if (sellerProfile.id === sellerId || (currentRole === 'Vendedor' && sellerProfile.id === sellerId)) {
      alert("⚠️ No puedes seguir tu propio perfil de vendedor.");
      return;
    }
    setFollowedSellers(prev => {
      if (prev.includes(sellerId)) {
        return prev.filter(id => id !== sellerId);
      } else {
        sendNotification(sellerId, "¡Nuevo Seguidor! ❤️", `El usuario ${userProfile.username} ha comenzado a seguir tu perfil público.`, 'like');
        return [...prev, sellerId];
      }
    });
  };

  const isFollowingSeller = (sellerId: string) => followedSellers.includes(sellerId);

  // --- SELLER ACTIONS & POINTS SYSTEM ---
  const purchasePoints = (pkgId: string) => {
    const pkg = mockPointPackages.find(p => p.id === pkgId);
    if (!pkg) return;

    const addedPoints = pkg.points + (pkg.bonusPoints || 0);

    // Update current seller points
    setSellerProfile(prev => ({
      ...prev,
      points: prev.points + addedPoints
    }));

    addAuditLog("Compra Puntos", `Compró paquete de ${pkg.points} puntos (+${pkg.bonusPoints || 0} bono) por $${pkg.price}`);
    sendNotification(
      userProfile.id,
      "Puntos Adquiridos 🪙",
      `¡Compra exitosa! Se han acreditado +${addedPoints} puntos a tu cuenta de vendedor.`,
      'points'
    );
  };

  const sellerDeductPoints = (actionName: keyof typeof POINT_COSTS, description: string): boolean => {
    const cost = POINT_COSTS[actionName];
    if (sellerProfile.points < cost) {
      return false; // Insufficient points
    }

    setSellerProfile(prev => ({
      ...prev,
      points: prev.points - cost
    }));

    addAuditLog("Gasto Puntos", `Gastó ${cost} puntos: ${description}`);
    sendNotification(
      userProfile.id,
      "Puntos Consumidos",
      `Se han debitado -${cost} puntos de tu saldo por: ${description}.`,
      'points'
    );
    return true;
  };

  const sellerAddProduct = (productData: Partial<Product>) => {
    // 1. Determine cost based on product type
    let costKey: keyof typeof POINT_COSTS = 'publish_account';
    if (productData.type === 'diamante') costKey = 'publish_diamonds';
    if (productData.type === 'recarga') costKey = 'publish_recharges';
    if (productData.type === 'oferta') costKey = 'publish_offer';

    const baseCost = POINT_COSTS[costKey];
    let extraCost = 0;

    // Additional media calculations
    if (productData.videoUrl) extraCost += POINT_COSTS.add_video;
    if (productData.images && productData.images.length > 1) {
      extraCost += (productData.images.length - 1) * POINT_COSTS.extra_image;
    }
    if (productData.tags && productData.tags.length > 0) {
      extraCost += POINT_COSTS.add_tags;
    }

    const totalCost = baseCost + extraCost;

    if (sellerProfile.points < totalCost) {
      return { success: false, message: `No tienes puntos suficientes. Publicar requiere ${totalCost} puntos (Base: ${baseCost} + Extras: ${extraCost}), y tu saldo actual es de ${sellerProfile.points} puntos.` };
    }

    // Deduct points
    setSellerProfile(prev => ({
      ...prev,
      points: prev.points - totalCost
    }));

    // Create product
    const newProduct: Product = {
      id: "p_" + Date.now(),
      sellerId: sellerProfile.id,
      sellerName: sellerProfile.username,
      sellerAvatar: sellerProfile.avatar,
      title: productData.title || "Sin título",
      description: productData.description || "",
      price: productData.price || 0,
      previousPrice: productData.previousPrice,
      discountPercent: productData.discountPercent,
      type: productData.type || 'cuenta',
      category: productData.category || 'Vendedor',
      server: productData.server || 'Sudamérica',
      level: productData.level,
      quantity: productData.quantity,
      stock: productData.stock || 1,
      images: productData.images && productData.images.length > 0 ? productData.images : ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"],
      videoUrl: productData.videoUrl,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days default
      tags: productData.tags || [],
      features: productData.features || [],
      likes: 0,
      dislikes: 0,
      views: 12,
    };

    setProducts(prev => [newProduct, ...prev]);
    
    addAuditLog("Publicar Producto", `Publicó: ${newProduct.title}. Costo: ${totalCost} puntos.`);
    sendNotification(
      userProfile.id,
      "Anuncio Publicado",
      `Tu publicación '${newProduct.title}' ya está en línea. Consumo total: ${totalCost} puntos.`,
      'points'
    );

    return { success: true, message: `Anuncio publicado con éxito. Se descontaron ${totalCost} puntos de tu saldo.` };
  };

  const sellerRenewProduct = (productId: string): boolean => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return false;

    const deducted = sellerDeductPoints('renew_listing', `Renovación de anuncio: '${p.title}'`);
    if (deducted) {
      setProducts(prev => prev.map(prod => {
        if (prod.id === productId) {
          return {
            ...prod,
            status: 'active' as const,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // Extend 15 days
          };
        }
        return prod;
      }));
      return true;
    }
    return false;
  };

  const sellerHighlightProduct = (productId: string): boolean => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return false;

    const deducted = sellerDeductPoints('highlight', `Destacar anuncio: '${p.title}'`);
    if (deducted) {
      setProducts(prev => prev.map(prod => {
        if (prod.id === productId) {
          return { ...prod, isFeatured: true };
        }
        return prod;
      }));
      return true;
    }
    return false;
  };

  const sellerTopFeature = (productId: string): boolean => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return false;

    const deducted = sellerDeductPoints('top_feature', `Subir al inicio (Top Feature): '${p.title}'`);
    if (deducted) {
      // Moves product to first place
      setProducts(prev => {
        const match = prev.find(prod => prod.id === productId);
        if (!match) return prev;
        const filtered = prev.filter(prod => prod.id !== productId);
        return [match, ...filtered];
      });
      return true;
    }
    return false;
  };

  const sellerPremiumPromo = (productId: string): boolean => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return false;

    const deducted = sellerDeductPoints('premium_promo', `Promoción Premium de Anuncio: '${p.title}'`);
    if (deducted) {
      setProducts(prev => prev.map(prod => {
        if (prod.id === productId) {
          return { ...prod, isFeatured: true, title: "PREMIUM | " + prod.title };
        }
        return prod;
      }));
      return true;
    }
    return false;
  };

  // --- REWARDS & QUESTS ---
  const claimDailyReward = () => {
    if (!dailyStreak.availableToday) return;

    const reward = 10 * dailyStreak.streak; // 10, 20, 30... points based on streak
    setUserProfile(prev => ({
      ...prev,
      points: prev.points + reward
    }));

    setDailyStreak(prev => ({
      streak: prev.streak + 1,
      lastClaimed: new Date().toISOString(),
      availableToday: false
    }));

    // Trigger racha mission completion
    setDailyMissions(prev => prev.map(m => {
      if (m.id === 'm_d1') {
        return { ...m, progress: 1, completed: true };
      }
      return m;
    }));

    addAuditLog("Recompensa Diaria", `Reclamó recompensa de racha de ${dailyStreak.streak} días. Recibió +${reward} puntos.`);
    sendNotification(
      userProfile.id,
      "Racha Diaria Reclamada",
      `¡Has reclamado tu premio! +${reward} puntos agregados a tu cartera. Tu racha actual es de ${dailyStreak.streak} días.`,
      'points'
    );
  };

  const claimMissionReward = (missionId: string) => {
    const m = dailyMissions.find(x => x.id === missionId);
    if (!m || !m.completed || m.claimed) return;

    setDailyMissions(prev => prev.map(x => x.id === missionId ? { ...x, claimed: true } : x));
    
    // Give user reward points
    setUserProfile(prev => ({
      ...prev,
      points: prev.points + m.pointsReward
    }));

    addAuditLog("Misión Diaria", `Reclamó recompensa por misión: '${m.title}'. Recibió +${m.pointsReward} puntos.`);
    sendNotification(
      userProfile.id,
      "Misión Diaria Completada ⭐",
      `Has canjeado +${m.pointsReward} puntos por completar la misión: '${m.title}'.`,
      'points'
    );
  };

  const addReferral = (email: string) => {
    if (!email.includes('@')) return { success: false, message: "Ingresa un correo electrónico válido." };

    setUserProfile(prev => ({
      ...prev,
      points: prev.points + 50 // 50 points per referral invite
    }));

    addAuditLog("Invitación", `Invitó al amigo: ${email}`);
    sendNotification(userProfile.id, "Invitación Enviada", `Has invitado a ${email} y ganaste +50 puntos de recompensa de afiliado.`, 'points');

    return { success: true, message: `Invitación enviada con éxito a ${email}. Se han sumado +50 puntos de afiliado a tu perfil.` };
  };

  // --- CHAT SYSTEM ---
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: "m_" + Date.now(),
      conversationId,
      senderId: userProfile.id,
      senderName: userProfile.username,
      senderRole: currentRole,
      text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation last message
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const isParticipantA = c.participantA.id === userProfile.id;
        return {
          ...c,
          lastMessageText: text,
          lastMessageTime: "Hace un momento",
          unreadCountA: isParticipantA ? c.unreadCountA : c.unreadCountA + 1,
          unreadCountB: isParticipantA ? c.unreadCountB + 1 : c.unreadCountB
        };
      }
      return c;
    }));

    // Simulate automated answer after 3 seconds for active customer service feel!
    setTimeout(() => {
      const activeConv = conversations.find(c => c.id === conversationId);
      if (!activeConv) return;
      const otherParticipant = activeConv.participantA.id === userProfile.id ? activeConv.participantB : activeConv.participantA;
      
      const responseText = `¡Hola! He recibido tu mensaje. Soy ${otherParticipant.name} y te responderé de inmediato. Mi tiempo de respuesta actual es ultra rápido. ¡Gracias por contactarme!`;
      
      const autoMessage: Message = {
        id: "m_auto_" + Date.now(),
        conversationId,
        senderId: otherParticipant.id,
        senderName: otherParticipant.name,
        senderRole: otherParticipant.role,
        text: responseText,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, autoMessage]);
      setConversations(prevConv => prevConv.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessageText: responseText,
            lastMessageTime: "Hace un momento",
            unreadCountA: c.participantA.id === userProfile.id ? c.unreadCountA + 1 : c.unreadCountA,
            unreadCountB: c.participantB.id === userProfile.id ? c.unreadCountB + 1 : c.unreadCountB
          };
        }
        return c;
      }));
    }, 2500);
  };

  const startConversation = (sellerId: string, sellerName: string, sellerAvatar: string): string => {
    // Check if conversation already exists
    const existing = conversations.find(c => 
      (c.participantA.id === userProfile.id && c.participantB.id === sellerId) ||
      (c.participantB.id === userProfile.id && c.participantA.id === sellerId)
    );

    if (existing) {
      setActiveChatConvId(existing.id);
      setActiveView('dashboard_user'); // Navigate to User Panel to chat
      return existing.id;
    }

    const newConvId = "conv_" + Date.now();
    const newConv: Conversation = {
      id: newConvId,
      participantA: { id: userProfile.id, name: userProfile.username, avatar: userProfile.avatar, role: 'Usuario' },
      participantB: { id: sellerId, name: sellerName, avatar: sellerAvatar, role: 'Vendedor' },
      lastMessageText: "Chat iniciado",
      lastMessageTime: "Ahora",
      unreadCountA: 0,
      unreadCountB: 0
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveChatConvId(newConvId);
    setActiveView('dashboard_user');
    return newConvId;
  };

  // --- SUPPORT ---
  const addSupportTicket = (subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: "TKT_" + Date.now().toString().slice(-6),
      userId: userProfile.id,
      username: userProfile.username,
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    addAuditLog("Ticket Soporte", `Creado ticket de soporte: '${subject}'`);
    sendNotification(userProfile.id, "Soporte Técnico", `Tu ticket #${newTicket.id} ha sido abierto de forma exitosa.`, 'system');
  };

  // --- ADMINISTRATOR ACTIONS ---
  const adminCreateUser = (userData: { username: string; email: string; role: UserRole; password?: string }) => {
    const emailExists = usersList.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    const usernameExists = usersList.some(u => u.username.toLowerCase() === userData.username.toLowerCase());
    
    if (emailExists) {
      return { success: false, message: "El correo electrónico ya está registrado." };
    }
    if (usernameExists) {
      return { success: false, message: "El nombre de usuario ya está registrado." };
    }

    const newUserId = "u_" + Date.now();
    const newUser: Profile = {
      id: newUserId,
      username: userData.username,
      email: userData.email,
      avatar: `https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-0${Math.floor(Math.random() * 5) + 1}.png?raw=true`,
      role: userData.role,
      level: 1,
      purchaseCount: 0,
      points: 100, // starting gift
      badges: [],
      achievements: [],
      createdAt: new Date().toISOString(),
      password: userData.password || "123456"
    };

    setUsersList(prev => [...prev, newUser]);
    
    // If the role is Vendedor, also create a SellerProfile
    if (userData.role === 'Vendedor') {
      const newSellerId = "s_" + Date.now();
      const newSeller: SellerProfile = {
        id: newSellerId,
        userId: newUserId,
        username: userData.username,
        avatar: newUser.avatar,
        banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        description: `Canal oficial de venta de ${userData.username}. Recargas rápidas de Free Fire 100% seguras y garantizadas.`,
        salesCount: 0,
        points: 100, // starting points to publish
        reputation: 100,
        likesCount: 0,
        dislikesCount: 0,
        reportsCount: 0,
        sellerLevel: 1,
        createdAt: new Date().toISOString(),
        lastActive: "Ahora mismo",
        ratingAverage: 5.0,
        medals: ["Nuevo"]
      };
      setSellersList(prev => [...prev, newSeller]);
    }

    addAuditLog("Admin Crear Usuario", `Creado nuevo usuario: ${userData.username} con rol: ${userData.role}`);
    return { success: true, message: `Usuario ${userData.username} creado con éxito.` };
  };

  const adminUpdateUser = (userId: string, updates: Partial<Profile>) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (userId === userProfile.id) {
      setUserProfile(prev => ({ ...prev, ...updates }));
      
      // Sync with seller profile if they have one
      setSellerProfile(prev => {
        if (prev.userId === userId) {
          const updatedSeller = {
            ...prev,
            username: updates.username !== undefined ? updates.username : prev.username,
            avatar: updates.avatar !== undefined ? updates.avatar : prev.avatar
          };
          
          // Also update sellers list
          setSellersList(prevList => prevList.map(s => s.id === prev.id ? updatedSeller : s));
          
          return updatedSeller;
        }
        return prev;
      });

      // Sync products seller name & avatar
      if (updates.username || updates.avatar) {
        setProducts(prevProducts => prevProducts.map(p => {
          if (p.sellerId === sellerProfile.id) {
            return {
              ...p,
              sellerName: updates.username !== undefined ? updates.username : p.sellerName,
              sellerAvatar: updates.avatar !== undefined ? updates.avatar : p.sellerAvatar,
            };
          }
          return p;
        }));
      }
    }
    addAuditLog("Admin Actualizar Usuario", `Actualizó usuario ID: ${userId}`);
  };

  const adminUpdateSeller = (sellerId: string, updates: Partial<SellerProfile>) => {
    setSellersList(prev => prev.map(s => s.id === sellerId ? { ...s, ...updates } : s));
    if (sellerId === sellerProfile.id) {
      setSellerProfile(prev => ({ ...prev, ...updates }));

      // Sync with user profile so the Navbar and User panel matches
      setUserProfile(prev => ({
        ...prev,
        username: updates.username !== undefined ? updates.username : prev.username,
        avatar: updates.avatar !== undefined ? updates.avatar : prev.avatar,
        frame: updates.frame !== undefined ? updates.frame : prev.frame,
      }));

      // Also sync user in the user list
      setUsersList(prevUsers => prevUsers.map(u => {
        if (u.id === sellerProfile.userId) {
          return {
            ...u,
            username: updates.username !== undefined ? updates.username : u.username,
            avatar: updates.avatar !== undefined ? updates.avatar : u.avatar,
            frame: updates.frame !== undefined ? updates.frame : u.frame,
          };
        }
        return u;
      }));
    }

    // Sync products seller name & avatar
    if (updates.username || updates.avatar) {
      setProducts(prevProducts => prevProducts.map(p => {
        if (p.sellerId === sellerId) {
          return {
            ...p,
            sellerName: updates.username !== undefined ? updates.username : p.sellerName,
            sellerAvatar: updates.avatar !== undefined ? updates.avatar : p.sellerAvatar,
          };
        }
        return p;
      }));
    }

    addAuditLog("Admin Actualizar Vendedor", `Actualizó vendedor ID: ${sellerId}`);
  };

  const adminDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addAuditLog("Admin Borrar Producto", `Eliminó permanentemente producto ID: ${productId}`);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    addAuditLog("Actualizar Producto", `Actualizó producto ID: ${productId}`);
  };

  const adminResolveReport = (reportId: string, action: 'resolve' | 'reject' | 'ban_seller') => {
    const report = reportsList.find(r => r.id === reportId);
    if (!report) return;

    setReportsList(prev => prev.map(r => r.id === reportId ? { ...r, status: action === 'reject' ? 'rejected' as const : 'resolved' as const } : r));

    if (action === 'ban_seller' && report.sellerId) {
      // Ban seller and flag all products
      setSellersList(prev => prev.map(s => s.id === report.sellerId ? { ...s, reportsCount: s.reportsCount + 10, reputation: 0 } : s));
      setProducts(prev => prev.map(p => p.sellerId === report.sellerId ? { ...p, status: 'suspended' as const } : p));
      sendNotification(report.userId, "Reporte Resuelto", "El vendedor reportado ha sido sancionado y suspendido.", 'system');
    } else {
      sendNotification(report.userId, "Reporte Procesado", `Tu reporte #${reportId} ha sido revisado y marcado como resuelto.`, 'system');
    }

    addAuditLog("Admin Resolver Reporte", `Reporte ID: ${reportId} resuelto con acción: ${action}`);
  };

  const adminAddCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
    addAuditLog("Admin Añadir Cupón", `Creó código de cupón: ${coupon.code}`);
  };

  const adminUpdateSettings = (settings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...settings }));
    addAuditLog("Admin Configuración", "Actualizó ajustes generales del sitio");
  };

  const adminGivePoints = (sellerId: string, amount: number) => {
    setSellersList(prev => prev.map(s => s.id === sellerId ? { ...s, points: s.points + amount } : s));
    if (sellerId === sellerProfile.id) {
      setSellerProfile(prev => ({ ...prev, points: prev.points + amount }));
    }
    addAuditLog("Admin Regalo de Puntos", `Otorgó ${amount} puntos de regalo al vendedor ID: ${sellerId}`);
    
    // Locate userId of seller to notify
    const s = sellersList.find(x => x.id === sellerId);
    if (s) {
      sendNotification(
        s.userId,
        "¡Recibiste Regalo de Puntos! 🎁",
        `El equipo de administración te ha acreditado +${amount} puntos de regalo para tus publicaciones.`,
        'points'
      );
    }
  };

  const loginAsUser = (userId: string) => {
    const foundUser = usersList.find(u => u.id === userId);
    if (foundUser) {
      setIsLoggedIn(true);
      localStorage.setItem('ff_is_logged_in', 'true');
      setUserProfile(foundUser);
      setCurrentRoleState(foundUser.role);
      localStorage.setItem('ff_current_role', foundUser.role);
      localStorage.setItem('ff_user_profile', JSON.stringify(foundUser));
      
      // If user is Seller, also switch to corresponding sellerProfile
      if (foundUser.role === 'Vendedor') {
        const foundSeller = sellersList.find(sel => sel.userId === foundUser.id || sel.username === foundUser.username);
        if (foundSeller) {
          setSellerProfile(foundSeller);
          localStorage.setItem('ff_seller_profile', JSON.stringify(foundSeller));
        }
      }
      
      addAuditLog("Inicio de Sesión", `Inició sesión como: ${foundUser.username} (${foundUser.role})`);
      
      // Redirect based on role
      if (foundUser.role === 'Administrador') {
        setActiveViewState('dashboard_admin');
      } else if (foundUser.role === 'Vendedor') {
        setActiveViewState('dashboard_seller');
      } else {
        setActiveViewState('home');
      }
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('ff_is_logged_in', 'false');
    localStorage.removeItem('ff_current_role');
    localStorage.removeItem('ff_user_profile');
    localStorage.removeItem('ff_seller_profile');
    
    // Redirect to login view
    setActiveViewState('login');
    addAuditLog("Cierre de Sesión", `Usuario ${userProfile.username} cerró sesión.`);
  };

  return (
    <AppContext.Provider value={{
      appSettings,
      auditLogs,
      currentRole,
      activeView,
      selectedSellerId,
      selectedProductId,
      activeChatConvId,
      setActiveChatConvId,

      usersList,
      sellersList,
      products,
      reviewsList,
      reportsList,
      notifications,
      conversations,
      messages,
      orders,
      supportTickets,
      coupons,
      dailyMissions,
      dailyStreak,

      isLoggedIn,
      userProfile,
      sellerProfile,
      favorites,
      cart,
      activeCoupon,
      isCartOverlayOpen,
      setIsCartOverlayOpen,
      openCartModal,
      cartToast,
      dismissCartToast,

      setCurrentRole,
      setActiveView,
      addAuditLog,

      addToCart,
      removeFromCart,
      updateCartQty,
      applyCoupon,
      removeCoupon,
      checkout,
      issueBoleta,

      toggleFavorite,
      likeProduct,
      dislikeProduct,

      addReview,
      reportSellerOrProduct,
      followSeller,
      isFollowingSeller,

      purchasePoints,
      sellerAddProduct,
      sellerDeductPoints,
      sellerRenewProduct,
      sellerHighlightProduct,
      sellerTopFeature,
      sellerPremiumPromo,

      claimDailyReward,
      claimMissionReward,
      addReferral,

      sendMessage,
      startConversation,
      addSupportTicket,

      adminCreateUser,
      adminUpdateUser,
      adminUpdateSeller,
      adminDeleteProduct,
      updateProduct,
      adminResolveReport,
      adminAddCoupon,
      adminUpdateSettings,
      adminGivePoints,
      loginAsUser,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
