/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AppProvider, useAppContext, POINT_COSTS } from './store';
import { Navbar } from './components/Navbar';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProductCard } from './components/ProductCard';
import { UserDashboard } from './components/UserDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { BoletaModal } from './components/BoletaModal';
import { CartToast } from './components/CartToast';
import { PaymentMethodBadge } from './components/PaymentMethodBadge';
import { ALL_PAYMENT_METHODS, DEFAULT_SELLER_PAYMENT_METHODS } from './data/paymentMethods';
import {
  Flame,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Store,
  Mail,
  Send,
  HelpCircle,
  Gem,
  Award,
  Layers,
  Server,
  Star,
  Tv,
  Heart,
  ShoppingCart,
  MessageSquare,
  AlertCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Flag,
  UserPlus,
  UserCheck,
  Coins,
  FileText,
  Gamepad2,
  Zap,
  Key,
  BookOpen,
  Info,
  Phone,
  Lock,
  User,
  Globe,
  Share2,
  Eye,
  X,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { mockNews, mockFaq, mockSellers } from './mockData';
import { Product, SellerProfile, Order, OrderItem } from './types';

const DIAMOND_PACKAGES_DATA = [
  {
    quantity: 100,
    bonus: "Bono +10",
    defaultPrice: 1.08,
    imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/100-diamantes.png",
    iconSize: "text-2xl",
    sparkles: "✨"
  },
  {
    quantity: 310,
    bonus: "Bono +31",
    defaultPrice: 3.26,
    imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/310-diamantes.png",
    iconSize: "text-3xl",
    sparkles: "⚡"
  },
  {
    quantity: 520,
    bonus: "Bono +52",
    defaultPrice: 5.08,
    imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/520-diamantes.png",
    iconSize: "text-4xl",
    sparkles: "🔥"
  },
  {
    quantity: 1060,
    bonus: "Bono +106",
    defaultPrice: 10.91,
    imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/1060-diamantes.png",
    iconSize: "text-5xl",
    sparkles: "💎"
  },
  {
    quantity: 2180,
    bonus: "Bono +218",
    defaultPrice: 21.09,
    imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/2180-diamantes.png",
    iconSize: "text-6xl",
    sparkles: "🏆"
  },
  {
    quantity: 5600,
    bonus: "Bono +560",
    defaultPrice: 50.22,
    imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/5600-diamantes.png",
    iconSize: "text-7xl",
    sparkles: "👑"
  }
];

// --- MAIN APPLICATION CONTENT INNER ORCHESTRATOR ---
function AppContent() {
  const {
    isLoggedIn,
    activeView,
    setActiveView,
    selectedSellerId,
    selectedProductId,
    products,
    sellersList,
    usersList,
    userProfile,
    sellerProfile,
    cart,
    isCartOverlayOpen,
    setIsCartOverlayOpen,
    addToCart,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    activeCoupon,
    checkout,
    favorites,
    toggleFavorite,
    startConversation,
    reviewsList,
    addReview,
    currentRole,
    adminUpdateSeller,
    reportSellerOrProduct,
    followSeller,
    isFollowingSeller,
  } = useAppContext();

  // Carousel slider state for Home page
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      title: "Pase Sakura & Evolutivas",
      subtitle: "Adquiere cuentas veteranas verificadas con garantía total de reembolso.",
      img: "https://github.com/luqueSmith/FreFire/blob/main/img/venta-cuentas.png?raw=true",
      view: "marketplace"
    },
    {
      title: "Diamantes Express por ID",
      subtitle: "Entrega automática en menos de 5 minutos mediante PagoStore oficial.",
      img: "https://github.com/luqueSmith/FreFire/blob/main/img/venta-diamantes.png?raw=true",
      view: "diamantes"
    },
    {
      title: "Membresías con 400% Ahorro",
      subtitle: "Activa pases semanales y mensuales para recibir diamantes diarios.",
      img: "https://github.com/luqueSmith/FreFire/blob/main/img/venta-bonos.png?raw=true",
      view: "recargas"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeView === 'home') {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [activeView]);

  // Handle URL query parameters for direct shared seller storefront links (?seller=id&mode=storefront)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sellerParam = params.get('seller');
    const modeParam = params.get('mode');
    if (sellerParam) {
      if (modeParam === 'storefront') {
        setActiveView('seller_storefront', sellerParam);
      } else {
        setActiveView('public_seller', sellerParam);
      }
    }
  }, []);

  // --- FILTERS STATE FOR MARKETPLACE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [serverFilter, setServerFilter] = useState('');
  const [levelMin, setLevelMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'popular'>('recent');
  const [hackFilter, setHackFilter] = useState<string>('');

  // --- DIAMONDS PLAYER ID CHECKER ---
  const [playerId, setPlayerId] = useState('99382103');
  const [idVerified, setIdVerified] = useState(true);
  const [verifyingId, setVerifyingId] = useState(false);
  const [selectedDiamondPkgId, setSelectedDiamondPkgId] = useState<string | null>(null);
  const [selectedDiamondQty, setSelectedDiamondQty] = useState<number>(100);
  const [selectedSellerForDiamonds, setSelectedSellerForDiamonds] = useState<string>('s_megastore');
  const [isSellerSelectorOpen, setIsSellerSelectorOpen] = useState<boolean>(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'compra' | 'funciona' | 'uso'>('compra');
  const [cartSubmittedOrder, setCartSubmittedOrder] = useState<Order | null>(null);
  const [copiedShareNotice, setCopiedShareNotice] = useState<string | null>(null);

  // Simulated sellers and their multipliers
  const simulatedDiamondSellers = [
    {
      id: "s_megastore",
      name: "FF_MegaStore",
      avatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80",
      reputation: 97,
      isOfficial: false,
      level: 4,
      frame: "cyan",
      multiplier: 0.91
    },
    {
      id: "s_diamond",
      name: "DiamondGamer_LATAM",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      reputation: 99,
      isOfficial: false,
      level: 5,
      frame: "gold",
      multiplier: 0.94
    },
    {
      id: "s_chrono",
      name: "ChronoSales_ES",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      reputation: 98,
      isOfficial: false,
      level: 4,
      frame: "evolutive",
      multiplier: 0.97
    },
    {
      id: "s_official",
      name: "Tienda Oficial FF",
      avatar: "https://github.com/luqueSmith/FreFire/blob/main/img/venta-diamantes.png?raw=true",
      reputation: 100,
      isOfficial: true,
      level: 5,
      frame: "heroic",
      multiplier: 1.00
    },
    {
      id: "s_sakura",
      name: "SakuraVentas_FF",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      reputation: 94,
      isOfficial: false,
      level: 3,
      frame: "sakura",
      multiplier: 1.05
    }
  ];

  // Dynamic union of simulated + actual registered sellers who might sell diamonds
  const activeDiamondSellersList = [
    ...simulatedDiamondSellers,
    ...sellersList
      .filter(s => !["s_megastore", "s_diamond", "s_chrono", "s_official", "s_sakura"].includes(s.id))
      .map(s => ({
        id: s.id,
        name: s.username,
        avatar: s.avatar,
        reputation: s.reputation || 98,
        isOfficial: false,
        level: s.sellerLevel || 1,
        frame: s.frame || 'none',
        multiplier: 1.00
      }))
  ];

  const getDiamondPriceForSeller = (quantity: number, sellerId: string) => {
    const pkg = DIAMOND_PACKAGES_DATA.find(p => p.quantity === quantity)!;
    const isProductSellerValid = (prod: any) => {
      return sellersList.some(s => s.id === prod.sellerId);
    };
    const customProduct = products.find(p => 
      p.type === 'diamante' && 
      p.quantity === quantity && 
      p.sellerId === sellerId && 
      p.status === 'active' &&
      isProductSellerValid(p)
    );
    if (customProduct) {
      return customProduct.price;
    }
    const sellerMeta = activeDiamondSellersList.find(s => s.id === sellerId) || activeDiamondSellersList[0];
    return pkg.defaultPrice * (sellerMeta.multiplier || 1.00);
  };

  // --- NEWS VIEW EXPANDED ---
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // --- PURCHASE DETAILS OVERLAY STATES ---
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta' | 'PayPal' | 'PagoEfectivo'>('Tarjeta');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // --- REVIEW SUBMISSION FORM STATES ---
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // --- REPORT MODAL STATES ---
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetType, setReportTargetType] = useState<'seller' | 'product'>('seller');
  const [reportReasonType, setReportReasonType] = useState<'fraud' | 'spam' | 'fake_account' | 'offensive_content' | 'scam' | 'other'>('scam');
  const [reportReasonText, setReportReasonText] = useState('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState('');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  // --- MOCK TIMER FOR SALES COUNTERS ---
  const [countdown, setCountdown] = useState("04h 52m 10s");
  useEffect(() => {
    const interval = setInterval(() => {
      const hours = Math.floor(Math.random() * 5) + 2;
      const mins = Math.floor(Math.random() * 59);
      const secs = Math.floor(Math.random() * 59);
      setCountdown(`${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
    } else {
      setCouponError(res.message);
    }
  };

  // Mandatory Buyer Phone & Boleta modal states
  const [countryCode, setCountryCode] = useState('+51');
  const [buyerPhoneInput, setBuyerPhoneInput] = useState(userProfile.phone || '906328464');
  const [activeBoletaOrder, setActiveBoletaOrder] = useState<Order | null>(null);

  // Seller vote states (toggle recommendation)
  const [votedSellers, setVotedSellers] = useState<{ [sellerId: string]: 'like' | 'dislike' }>({});

  const handleSellerVote = (seller: SellerProfile, type: 'like' | 'dislike') => {
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión con tu cuenta para recomendar o calificar a este vendedor.");
      setActiveView('login');
      return;
    }
    const currentVote = votedSellers[seller.id];
    if (currentVote === type) {
      // Undo vote
      const updatedVoted = { ...votedSellers };
      delete updatedVoted[seller.id];
      setVotedSellers(updatedVoted);

      if (type === 'like') {
        const newLikes = Math.max(0, seller.likesCount - 1);
        const total = newLikes + (seller.dislikesCount || 0);
        const rep = total > 0 ? Math.round((newLikes / total) * 100) : 100;
        adminUpdateSeller(seller.id, { likesCount: newLikes, reputation: rep });
      } else {
        const newDislikes = Math.max(0, (seller.dislikesCount || 0) - 1);
        const total = seller.likesCount + newDislikes;
        const rep = total > 0 ? Math.round((seller.likesCount / total) * 100) : 100;
        adminUpdateSeller(seller.id, { dislikesCount: newDislikes, reputation: rep });
      }
    } else {
      let newLikes = seller.likesCount;
      let newDislikes = seller.dislikesCount || 0;

      if (currentVote === 'like') newLikes = Math.max(0, newLikes - 1);
      if (currentVote === 'dislike') newDislikes = Math.max(0, newDislikes - 1);

      if (type === 'like') newLikes += 1;
      if (type === 'dislike') newDislikes += 1;

      const total = newLikes + newDislikes;
      const rep = total > 0 ? Math.round((newLikes / total) * 100) : 100;

      setVotedSellers({ ...votedSellers, [seller.id]: type });
      adminUpdateSeller(seller.id, { likesCount: newLikes, dislikesCount: newDislikes, reputation: rep });
    }
  };

  const handleCheckoutSubmit = () => {
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión con tu cuenta para completar tu compra.");
      setActiveView('login');
      return;
    }
    const cleanNumber = buyerPhoneInput.trim();
    if (!cleanNumber) {
      alert("⚠️ Es obligatorio ingresar tu número de WhatsApp para procesar tu orden y enviarte la boleta.");
      return;
    }
    const fullPhone = `${countryCode} ${cleanNumber}`;
    setIsCheckingOut(true);
    setTimeout(() => {
      const res = checkout(paymentMethod, fullPhone);
      setIsCheckingOut(false);
      if (res.success && res.order) {
        setActiveBoletaOrder(res.order);
      } else {
        alert(res.message);
      }
    }, 800);
  };

  const verifyPlayerId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId.trim() || playerId.length < 8) {
      alert("Por favor ingresa un ID válido de Free Fire (8-10 números).");
      return;
    }
    setVerifyingId(true);
    setTimeout(() => {
      setVerifyingId(false);
      setIdVerified(true);
    }, 1200);
  };

  const handleReviewSubmit = (e: React.FormEvent, sellerId: string) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión con tu cuenta para dejar una calificación u opinión.");
      setActiveView('login');
      return;
    }
    if (!reviewText.trim()) return;
    addReview(rating, reviewText, sellerId, selectedProductId || undefined);
    setReviewSuccess('¡Calificación enviada al vendedor!');
    setReviewText('');
    setTimeout(() => setReviewSuccess(''), 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess('¡Mensaje enviado con éxito! Nos comunicaremos al correo provisto.');
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSuccess(''), 4000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión con tu cuenta para enviar un reporte.");
      setActiveView('login');
      return;
    }
    if (!reportReasonText.trim()) return;
    
    reportSellerOrProduct(
      reportReasonType,
      reportReasonText,
      selectedSeller?.id || '',
      undefined
    );
    
    setReportSuccessMsg('Reporte enviado con éxito. El equipo de administración revisará el perfil.');
    setReportReasonText('');
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccessMsg('');
    }, 3000);
  };

  // --- PRODUCT SELECTION FOR DETAIL VIEW ---
  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Robust selectedSeller calculation ensuring seller details never render empty or incorrect
  const selectedSeller = useMemo(() => {
    if (selectedSellerId) {
      if (sellerProfile && sellerProfile.id === selectedSellerId) return sellerProfile;
      const found = sellersList.find(s => s.id === selectedSellerId);
      if (found) return found;

      const simulated = simulatedDiamondSellers.find(s => s.id === selectedSellerId);
      if (simulated) {
        return {
          id: simulated.id,
          userId: `u_${simulated.id}`,
          username: simulated.name,
          avatar: simulated.avatar,
          banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80",
          frame: simulated.frame || 'none',
          description: `Distribuidor Oficial Autorizado de Recargas de Diamantes Free Fire. Soporte 24/7 y entregas automáticas por ID.`,
          salesCount: 3450,
          points: 1250,
          reputation: simulated.reputation || 99,
          likesCount: 2840,
          dislikesCount: 15,
          reportsCount: 1,
          sellerLevel: simulated.level || 10,
          createdAt: "2025-05-12T14:40:00Z",
          lastActive: "En línea",
          ratingAverage: 4.95,
          medals: ["Oficial", "Super Ventas", "Soporte 24/7"],
          phone: "+51 906328464",
        };
      }
    }
    if (selectedProduct?.sellerId) {
      if (sellerProfile && sellerProfile.id === selectedProduct.sellerId) return sellerProfile;
      const found = sellersList.find(s => s.id === selectedProduct.sellerId);
      if (found) return found;
    }
    return sellersList[0] || sellerProfile;
  }, [selectedSellerId, selectedProduct, sellersList, sellerProfile, activeView, simulatedDiamondSellers]);

  // Helper to filter products so only sellers with role 'Vendedor' or 'Administrador' are shown
  const isProductSellerValid = (product: Product) => {
    const seller = (sellerProfile && product.sellerId === sellerProfile.id)
      ? sellerProfile 
      : sellersList.find(s => s.id === product.sellerId);
    if (!seller) return false;
    const user = usersList.find(u => u.id === seller.userId);
    if (!user) return isCurrentUserSeller(seller.userId);
    const isCurrentUser = user.id === userProfile?.id;
    const actualRole = isCurrentUser ? currentRole : user.role;
    return actualRole === 'Vendedor' || actualRole === 'Administrador';
  };

  const isCurrentUserSeller = (userId: string) => {
    if (userProfile && userId === userProfile.id) {
      return currentRole === 'Vendedor' || currentRole === 'Administrador';
    }
    return true;
  };

  // Filter Catalog items for Marketplace View
  const filteredProducts = products.filter(p => {
    if (p.status !== 'active') return false;
    if (!isProductSellerValid(p)) return false;

    // View type locks
    if (activeView === 'marketplace' && p.type !== 'cuenta') return false;
    if (activeView === 'diamantes' && p.type !== 'diamante') return false;
    if (activeView === 'recargas' && p.type !== 'recarga') return false;
    if (activeView === 'ofertas' && p.type !== 'oferta') return false;
    if (activeView === 'hacks' && p.type !== 'hack') return false;

    // Hack Category Filter (Texturas, Aimbot, Panel)
    if (activeView === 'hacks' && hackFilter) {
      const hFilter = hackFilter.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(hFilter);
      const matchDesc = p.description.toLowerCase().includes(hFilter);
      const matchCategory = p.category ? p.category.toLowerCase().includes(hFilter) : false;
      const matchTags = p.tags ? p.tags.some(t => t.toLowerCase().includes(hFilter)) : false;
      const matchFeatures = p.features ? p.features.some(f => f.toLowerCase().includes(hFilter)) : false;
      if (!matchTitle && !matchDesc && !matchCategory && !matchTags && !matchFeatures) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(query);
      const matchDesc = p.description.toLowerCase().includes(query);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    // Server
    if (serverFilter && p.server !== serverFilter && p.server !== 'Cualquier Región' && p.server !== 'Global') return false;

    // Level
    if (p.level && p.level < levelMin) return false;

    // Price Max
    if (p.price > priceMax) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'popular') return b.views - a.views;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // recent
  });

  return (
    <div className="min-h-screen bg-transparent text-gray-100 font-sans selection:bg-neon-blue selection:text-black flex flex-col justify-between">
      {/* FLOATING COPY NOTIFICATION TOAST */}
      {copiedShareNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(52,211,153,0.6)] flex items-center space-x-2.5 animate-bounce border-2 border-white">
          <Check className="h-5 w-5 text-black stroke-[3]" />
          <span>{copiedShareNotice}</span>
        </div>
      )}

      {/* AMBIENT BACKGROUND */}
      <div id="ambient-background" />

      {/* GLOBAL HEADER BAR */}
      <Navbar onOpenCartModal={() => setIsCartOverlayOpen(true)} />

      {/* GUEST BANNER PROMPT */}
      {!isLoggedIn && activeView !== 'login' && (
        <div className="bg-gradient-to-r from-[#0a182e] via-[#0c1f3c] to-[#071326] border-b border-[#00d2ff]/25 px-4 py-2 text-center text-xs text-gray-300 flex flex-wrap items-center justify-center gap-2 font-medium shadow-md">
          <span className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
            <User className="h-3 w-3 mr-0.5" />
            <span>Modo Invitado</span>
          </span>
          <span>Navegación libre: Inicia sesión o regístrate para dar <strong>Me Gusta</strong>, guardar <strong>Favoritos</strong> y realizar <strong>Compras</strong>.</span>
          <button 
            onClick={() => setActiveView('login')}
            className="ml-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black px-3 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-md hover:scale-105"
          >
            Acceder / Registrarse
          </button>
        </div>
      )}

      {/* MASTER CENTRAL VIEWS BODY CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: HOME PANEL */}
        {activeView === 'home' && (
          <div className="space-y-10 animate-fade-in text-left">
            
            {/* HERO CAROUSEL */}
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] w-full border border-white/5 shadow-2xl bg-black">
              <img 
                src={slides[activeSlide].img} 
                alt="" 
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-1000 scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/60 to-transparent" />
              
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-16 max-w-xl space-y-4">
                <span className="text-neon-blue text-xs font-black uppercase tracking-widest flex items-center space-x-1 animate-pulse">
                  <Flame className="h-4 w-4" />
                  <span>SaaS Oficial de Free Fire</span>
                </span>
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none text-glow-blue">
                  {slides[activeSlide].title}
                </h1>
                <p className="text-xs md:text-sm text-gray-300">
                  {slides[activeSlide].subtitle}
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setActiveView(slides[activeSlide].view)}
                    className="btn-neon-blue px-6 py-3 rounded text-xs"
                  >
                    Explorar Catálogo
                  </button>
                </div>
              </div>

              {/* Slider Dots indicators */}
              <div className="absolute bottom-4 right-8 flex space-x-2">
                {slides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 w-2 rounded-full transition-all ${activeSlide === idx ? 'bg-neon-blue w-6' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
            </div>

            {/* PLATFORM GENERAL STATS BLOCK */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#111111]/80 border border-white/5 rounded-xl p-5 text-center backdrop-blur-md">
              <div className="space-y-1 border-r border-white/5">
                <p className="text-lg md:text-2xl font-black text-neon-blue text-glow-blue">24,502+</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Entregas Completadas</p>
              </div>
              <div className="space-y-1 md:border-r border-white/5">
                <p className="text-lg md:text-2xl font-black text-neon-purple text-glow-purple">120+</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vendedores Verificados</p>
              </div>
              <div className="space-y-1 border-r border-white/5">
                <p className="text-lg md:text-2xl font-black text-white">4.95 / 5</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Valoración Clientes</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg md:text-2xl font-black text-[#ff007f]">100%</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Garantía Antireembolso</p>
              </div>
            </div>

            {/* BENTO ACCESS GATEWAYS CATEGORIES */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center">
                <span className="w-1 h-4 bg-[#00d2ff] rounded-full mr-2"></span>
                <span>Nuestros Servicios Disponibles</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: "Cuentas Veteranas", desc: "Sakura, Hip Hop, Evolutivas al Máximo", label: "COMPRAR CUENTAS", view: "marketplace", icon: <Gamepad2 className="h-6 w-6 text-neon-purple" />, color: "from-[#9d4edd]/20 to-[#6600cc]/20 border-neon-purple/20 hover:border-neon-purple/50" },
                  { title: "Diamantes por ID", desc: "Carga inmediata vía PagoStore sin contraseñas", label: "RECARGAR ID", view: "diamantes", icon: <Gem className="h-6 w-6 text-neon-blue" />, color: "from-[#00d2ff]/20 to-[#0066ff]/20 border-neon-blue/20 hover:border-neon-blue/50" },
                  { title: "Armas Evolutivas", desc: "Skins evolutivas y cuentas con sets especiales", label: "VER EVOLUTIVAS", view: "recargas", icon: <Zap className="h-6 w-6 text-[#ff007f]" />, color: "from-[#ff007f]/20 to-[#cc005f]/20 border-[#ff007f]/20 hover:border-[#ff007f]/50" },
                  { title: "Combos en Oferta", desc: "Ventas flash 2x1 y packs a mitad de precio", label: "VER COMBOS", view: "ofertas", icon: <Flame className="h-6 w-6 text-yellow-500" />, color: "from-yellow-500/10 to-amber-600/10 border-yellow-500/20 hover:border-yellow-500/50" },
                  { title: "Hacks y Scripts", desc: "Inyectores VIP, antiban, autoapuntado & regedit", label: "VER HACKS", view: "hacks", icon: <Key className="h-6 w-6 text-emerald-400" />, color: "from-emerald-500/10 to-teal-600/10 border-emerald-500/20 hover:border-emerald-500/50" }
                ].map((cat, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveView(cat.view)}
                    className={`glass-panel p-5 rounded-xl border bg-gradient-to-br ${cat.color} cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-44`}
                  >
                    <div className="text-left space-y-1.5">
                      <span className="text-2xl block">{cat.icon}</span>
                      <h4 className="text-sm font-black text-white">{cat.title}</h4>
                      <p className="text-[11px] text-gray-400">{cat.desc}</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-white text-left tracking-wider hover:underline flex items-center space-x-1 pt-2">
                      <span>{cat.label}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERMEDIARY SERVICE BANNER */}
            <div className="relative rounded-2xl overflow-hidden border border-[#00d2ff]/30 bg-gradient-to-r from-[#061224] via-[#091b36] to-[#040a17] p-6 md:p-8 shadow-[0_0_25px_rgba(0,210,255,0.15)]">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                      Servicio Opcional de Custodia
                    </span>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider font-mono">100% Antiestafa</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center">
                    Servicio de Intermediario para Venta de Cuentas
                  </h3>

                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    ¿Deseas comprar o vender una cuenta de Free Fire con total tranquilidad? Ofrecemos nuestro servicio de intermediación oficial. Retenemos el pago y verificamos la cuenta antes de liberar el dinero al vendedor. <strong className="text-cyan-400 font-bold">(Servicio opcional, solo si comprador o vendedor lo prefieren)</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="flex items-center space-x-2 bg-[#0a1628]/80 border border-[#00d2ff]/20 rounded-lg p-2.5">
                      <ShieldCheck className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-[11px] font-bold text-gray-200">Verificación de Datos</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-[#0a1628]/80 border border-[#00d2ff]/20 rounded-lg p-2.5">
                      <Lock className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-[11px] font-bold text-gray-200">Custodia Segura del Pago</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-[#0a1628]/80 border border-[#00d2ff]/20 rounded-lg p-2.5">
                      <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-[11px] font-bold text-gray-200">Entrega Garantizada</span>
                    </div>
                  </div>
                </div>

                {/* Price & Call to Action box */}
                <div className="w-full lg:w-auto flex-shrink-0 bg-[#040e1c] border border-cyan-500/30 rounded-xl p-5 text-center space-y-3 min-w-[240px] shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">Tarifa de Intermediario</span>
                  <div>
                    <span className="text-3xl font-black text-white font-mono">$2.70 <span className="text-xs text-cyan-400">USD</span></span>
                    <span className="block text-[11px] text-gray-400 font-medium font-mono mt-0.5">(Aproximadamente S/ 10.00 PEN)</span>
                  </div>
                  <a 
                    href="https://api.whatsapp.com/send?phone=51906328464&text=Hola,%20solicito%20el%20servicio%20de%20intermediario%20oficial."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black uppercase text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center space-x-1 font-extrabold"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    <span>Solicitar Intermediario (+51 906328464)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* FEATURED GENERAL CATALOG HIGHLIGHT */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center">
                  <span className="w-1 h-4 bg-[#00d2ff] rounded-full mr-2"></span>
                  <span>Destacados de la Semana</span>
                </h3>
                <button 
                  onClick={() => setActiveView('marketplace')}
                  className="text-xs text-neon-blue hover:underline"
                >
                  Ver Todo el Catálogo
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {products.filter(p => p.status === 'active' && isProductSellerValid(p)).slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>

            {/* LATEST GAME NEWS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-white/5">
              <div className="lg:col-span-2 space-y-4 text-left">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center">
                  <span className="w-1 h-4 bg-[#00d2ff] rounded-full mr-2"></span>
                  <span>Noticias y Novedades de Garena Free Fire</span>
                </h3>
                <div className="space-y-4">
                  {mockNews.slice(0, 2).map((art) => (
                    <div 
                      key={art.id} 
                      onClick={() => {
                        setSelectedArticleId(art.id);
                        setActiveView('news');
                      }}
                      className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] hover:border-white/10 cursor-pointer flex flex-col sm:flex-row gap-4 items-center"
                    >
                      <img src={art.image} alt="" className="h-24 w-full sm:w-36 rounded-lg object-cover" />
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                          {art.tag}
                        </span>
                        <h4 className="text-sm font-bold text-white hover:text-neon-blue transition-colors">{art.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2">{art.summary}</p>
                        <span className="text-[10px] text-gray-500 block">Publicado: {art.publishedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SIDEBAR MINI FAQ SUMMARY */}
              <div className="lg:col-span-1 space-y-4 text-left">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center">
                  <span className="w-1 h-4 bg-[#00d2ff] rounded-full mr-2"></span>
                  <span>Preguntas Frecuentes</span>
                </h3>
                <div className="space-y-3">
                  {mockFaq.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setActiveView('faq')}
                      className="bg-white/2 border border-white/5 hover:border-neon-blue/20 rounded-lg p-3 cursor-pointer text-xs transition-colors"
                    >
                      <p className="font-bold text-gray-200">{item.question}</p>
                      <p className="text-gray-400 text-[11px] line-clamp-2 mt-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: MARKETPLACE / GENERAL CATALOG FOR CUENTAS */}
        {(activeView === 'marketplace' || activeView === 'recargas' || activeView === 'ofertas' || activeView === 'hacks') && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in text-left">
            
            {/* Sidebar Advanced Filters */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                    <SlidersHorizontal className="h-4 w-4 text-neon-blue mr-1.5" />
                    Filtros de Búsqueda
                  </span>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setServerFilter('');
                      setLevelMin(0);
                      setPriceMax(500);
                      setSortBy('recent');
                      setHackFilter('');
                    }}
                    className="text-[10px] text-gray-500 hover:text-neon-blue hover:underline"
                  >
                    Restablecer
                  </button>
                </div>

                {/* Filter: Search input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buscador Inteligente</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Sakura, evolutivas..."
                      className="w-full bg-[#181818] border border-white/10 rounded px-3 py-1.5 text-xs text-white pl-8 focus:border-neon-blue focus:outline-none"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                  </div>
                </div>

                {/* Filter: Server Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Región / Servidor Garena</label>
                  <select 
                    value={serverFilter}
                    onChange={(e) => setServerFilter(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-neon-blue focus:outline-none font-medium"
                  >
                    <option value="">Cualquier Región (Todas)</option>
                    <option value="Sudamérica">Sudamérica</option>
                    <option value="EEUU">EEUU / Norteamérica</option>
                    <option value="Europa">Europa</option>
                    <option value="Asia">Asia</option>
                    <option value="Cualquier Región">Cualquier Región (Global)</option>
                  </select>
                </div>

                {/* Filter: Price Range Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Precio Máximo</span>
                    <span className="text-neon-blue font-mono">${priceMax} USD</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="500" 
                    value={priceMax} 
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-neon-blue cursor-pointer h-1 rounded" 
                  />
                </div>

                {/* Filter: Minimum Level (only relevant for accounts) */}
                {activeView === 'marketplace' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>Nivel Mínimo Cuenta</span>
                      <span className="text-neon-purple font-mono">Lv {levelMin}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="85" 
                      value={levelMin} 
                      onChange={(e) => setLevelMin(Number(e.target.value))}
                      className="w-full accent-neon-purple cursor-pointer h-1 rounded" 
                    />
                  </div>
                )}

                {/* Filter: Hack Category Selector */}
                {activeView === 'hacks' && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categoría Hack</label>
                    <select 
                      value={hackFilter}
                      onChange={(e) => setHackFilter(e.target.value)}
                      className="w-full bg-[#181818] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-neon-blue focus:outline-none"
                    >
                      <option value="">Todos los Hacks</option>
                      <option value="Texturas">Texturas</option>
                      <option value="Aimbot">Aimbot</option>
                      <option value="Panel">Panel</option>
                    </select>
                  </div>
                )}

                {/* Sort selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ordenar por</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-neon-blue focus:outline-none"
                  >
                    <option value="recent">Más Reciente</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="popular">Popularidad / Vistas</option>
                  </select>
                </div>

              </div>

              {/* Help tip card */}
              <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111]/40 text-xs">
                <p className="font-bold text-white flex items-center">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 mr-1.5" />
                  Compra Protegida
                </p>
                <p className="text-gray-400 text-[11px] mt-1">Los fondos se retienen de forma segura y se liberan al vendedor únicamente cuando confirmas la entrega.</p>
              </div>
            </div>

            {/* Catalog Grid View */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Context header & verification gate for diamonds/recharges */}
              <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20">
                    {activeView === 'marketplace' ? 'CUENTAS VETERANAS' :
                     activeView === 'diamantes' ? 'TIENDA DE DIAMANTES' :
                     activeView === 'recargas' ? 'ARMAS EVOLUTIVAS' :
                     activeView === 'hacks' ? 'HACKS & SCRIPTS' : 'OFERTAS FLASH'}
                  </span>
                  <h2 className="text-base font-black text-white uppercase mt-1.5">
                    {activeView === 'marketplace' ? 'Catálogo de Cuentas Free Fire' :
                     activeView === 'diamantes' ? 'Recargas Oficiales por ID de Jugador' :
                     activeView === 'recargas' ? 'Cuentas y Skins Evolutivas al Máximo' :
                     activeView === 'hacks' ? 'Inyectores y Scripts Antiban Todo Rojo' : 'Combos Promocionales de Fin de Semana'}
                  </h2>
                </div>

                {/* Countdown timer for Ofertas sales */}
                {activeView === 'ofertas' && (
                  <div className="flex items-center space-x-1.5 bg-red-600/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse">
                    <Clock className="h-4 w-4" />
                    <span>Termina en: {countdown}</span>
                  </div>
                )}

                {/* Player ID prompt for diamond purchases */}
                {activeView === 'diamantes' && (
                  <form onSubmit={verifyPlayerId} className="flex space-x-1.5 items-center">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ingresar ID Garena"
                        className="bg-[#181818] border border-white/10 rounded px-3 py-1.5 text-xs text-white w-40 focus:border-neon-blue focus:outline-none font-bold"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className={`px-3 py-1.5 text-xs font-bold rounded transition-all flex items-center space-x-1 uppercase tracking-wider ${
                        idVerified 
                          ? 'bg-emerald-600 text-white cursor-default' 
                          : 'btn-neon-blue'
                      }`}
                    >
                      {verifyingId ? 'Verificando...' : idVerified ? 'Verificado ✓' : 'Verificar ID'}
                    </button>
                  </form>
                )}
              </div>

              {/* Hack category filter chips (Only visible in hacks view) */}
              {activeView === 'hacks' && (
                <div className="flex flex-wrap items-center gap-2 bg-[#111111]/40 p-2 rounded-xl border border-white/5 animate-fade-in">
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider pl-2 mr-2">Filtrar por:</span>
                  {(['Todos', 'Paneles', 'Texturas', 'Aimbot', 'Regedit', 'Bypass'] as const).map((filter) => {
                    const isSelected = (filter === 'Todos' && hackFilter === '') || hackFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setHackFilter(filter === 'Todos' ? '' : filter)}
                        className={`px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                          isSelected
                            ? 'bg-neon-blue/15 text-neon-blue border-neon-blue/40 shadow-sm shadow-neon-blue/10'
                            : 'bg-[#181818]/80 text-gray-400 border-white/5 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Products Catalog list */}
              {filteredProducts.length === 0 ? (
                <div className="glass-panel rounded-xl p-12 border border-white/5 bg-[#111111] text-center text-gray-500 text-xs">
                  No hay productos activos que coincidan con los filtros seleccionados. Intenta restablecer o buscar otro término.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW: DEDICATED DIAMOND STORE */}
        {activeView === 'diamantes' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Header section with instant delivery information */}
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1">
                <span className="text-[10px] text-[#00d2ff] font-bold uppercase bg-[#00d2ff]/10 px-2.5 py-0.5 rounded border border-[#00d2ff]/20">
                  RECARGAS INMEDIATAS PAGOSTORE CO-SOCIOS
                </span>
                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                  Tienda de Diamantes por ID (PagoStore)
                </h2>
                <p className="text-xs text-gray-400">
                  Recarga tus diamantes al instante mediante tu ID de jugador. Sin contraseñas, 100% legal, seguro y con entrega express garantizada de 2 a 5 minutos.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-[#0d223f]/60 px-4 py-2.5 rounded-lg border border-[#00d2ff]/20">
                <Gem className="h-5 w-5 text-[#00d2ff] animate-pulse" />
                <div className="text-left">
                  <span className="text-[10px] font-black text-white block uppercase tracking-wider">Compra Segura y Directa</span>
                  <span className="text-[9px] text-gray-400 block">Agrega al carrito sin registrar contraseñas ni demoras</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side: PagoStore Diamond Card Selection Grid (2 Cols span) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs font-black text-[#00d2ff] uppercase tracking-widest flex items-center">
                    <Gem className="h-4 w-4 text-[#00d2ff] mr-2" />
                    Paso 1: Selecciona el Paquete de Diamantes
                  </h3>
                </div>

                {/* Dynamic Seller Selection Filter Bar - Collapsible & Intuitive */}
                {(() => {
                  const currentSelectedSeller = activeDiamondSellersList.find(s => s.id === selectedSellerForDiamonds) || activeDiamondSellersList[0];
                  return (
                    <div id="diamond-seller-selector" className="bg-gradient-to-r from-[#0c1a30] via-[#0b1628] to-[#0f2342] border border-[#00d2ff]/30 p-3.5 sm:p-4 rounded-2xl text-left mb-5 shadow-[0_0_20px_rgba(0,210,255,0.08)] transition-all">
                      {/* Top Bar Summary / Accordion Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] flex-shrink-0">
                            <SlidersHorizontal className="h-5 w-5 animate-pulse" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs text-[#00d2ff] font-black block uppercase tracking-wider">
                              Vendedor Preferido para Precios de Diamantes
                            </span>
                            
                            {/* Currently active seller pill */}
                            {currentSelectedSeller && (
                              <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                                <div className="flex items-center space-x-1.5 bg-[#071120] px-2 py-1 rounded-lg border border-[#00d2ff]/20">
                                  <ProfileAvatar url={currentSelectedSeller.avatar} frame={currentSelectedSeller.frame as any} size="xs" />
                                  <span className="text-xs font-bold text-white truncate max-w-[120px]">{currentSelectedSeller.name}</span>
                                  <span className="text-[10px] text-emerald-400 font-black bg-emerald-500/10 px-1 rounded">
                                    {currentSelectedSeller.reputation}% Rep.
                                  </span>
                                </div>
                                <span className="text-[9px] bg-[#00d2ff]/20 text-[#00d2ff] px-2 py-0.5 rounded font-black uppercase tracking-wide border border-[#00d2ff]/30">
                                  Tarifa Aplicada ✓
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Collapsible Action Button */}
                        <button
                          onClick={() => setIsSellerSelectorOpen(!isSellerSelectorOpen)}
                          className={`flex items-center justify-between sm:justify-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-black transition-all duration-300 shadow-md ${
                            isSellerSelectorOpen
                              ? 'bg-[#00d2ff] text-black border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                              : 'bg-[#132c52]/80 hover:bg-[#183664] text-white border-[#00d2ff]/40 hover:border-[#00d2ff] hover:shadow-[0_0_12px_rgba(0,210,255,0.2)]'
                          }`}
                        >
                          <span className="flex items-center space-x-1.5">
                            <Store className="h-3.5 w-3.5" />
                            <span>{isSellerSelectorOpen ? 'Ocultar Vendedores' : 'Cambiar Vendedor'}</span>
                          </span>
                          <span className="text-[10px] opacity-90 bg-black/30 px-1.5 py-0.5 rounded font-mono">
                            {activeDiamondSellersList.length} Opcs
                          </span>
                          {isSellerSelectorOpen ? (
                            <ChevronUp className="h-4 w-4 ml-0.5" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-0.5 animate-bounce" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Sellers Grid */}
                      {isSellerSelectorOpen && (
                        <div className="mt-3.5 pt-3.5 border-t border-white/10 animate-fade-in space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <p className="text-[11px] text-gray-300 font-medium">
                              Haz clic en cualquier vendedor autorizado para aplicar sus tarifas a todos los paquetes:
                            </p>
                            <span className="text-[10px] text-[#00d2ff] font-extrabold">
                              ✨ Precios actualizados en tiempo real
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                            {activeDiamondSellersList.map((seller) => {
                              const isActive = selectedSellerForDiamonds === seller.id;
                              return (
                                <div
                                  key={seller.id}
                                  onClick={() => {
                                    setSelectedSellerForDiamonds(seller.id);
                                    setIsSellerSelectorOpen(false);
                                  }}
                                  className={`relative group p-2.5 rounded-xl transition-all duration-300 cursor-pointer border flex flex-col justify-between ${
                                    isActive
                                      ? 'bg-gradient-to-b from-[#00d2ff]/20 to-[#00d2ff]/5 border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                                      : 'bg-[#132c52]/40 border-white/10 hover:border-[#00d2ff]/40 hover:bg-[#132c52]/80'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-1.5">
                                    <ProfileAvatar url={seller.avatar} frame={seller.frame as any} size="sm" />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveView('public_seller', seller.id);
                                      }}
                                      className="p-1 rounded bg-white/5 hover:bg-[#00d2ff] text-gray-400 hover:text-black transition-colors"
                                      title={`Ver perfil público de ${seller.name}`}
                                    >
                                      <User className="h-3 w-3" />
                                    </button>
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-[11px] font-black text-white truncate group-hover:text-[#00d2ff] transition-colors">
                                      {seller.name}
                                    </p>
                                    <span className="text-[9px] text-emerald-400 font-bold block">
                                      {seller.reputation}% Reputación
                                    </span>
                                  </div>

                                  <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between">
                                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                                      isActive
                                        ? 'bg-[#00d2ff] text-black font-black'
                                        : 'bg-white/5 text-gray-400 group-hover:text-white'
                                    }`}>
                                      {isActive ? 'Seleccionado ✓' : 'Elegir Tarifa'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {DIAMOND_PACKAGES_DATA.map((pkg) => {
                    const isSelected = selectedDiamondQty === pkg.quantity;
                    
                    const priceForSelectedSeller = getDiamondPriceForSeller(pkg.quantity, selectedSellerForDiamonds);
                    const activeSellerMeta = activeDiamondSellersList.find(s => s.id === selectedSellerForDiamonds) || activeDiamondSellersList[0];

                    return (
                      <div
                        key={pkg.quantity}
                        onClick={() => setSelectedDiamondQty(pkg.quantity)}
                        className={`relative rounded-2xl overflow-hidden transition-all duration-300 p-2.5 flex flex-col justify-between cursor-pointer min-h-[220px] group border ${
                          isSelected 
                            ? 'border-[#00d2ff] shadow-[0_0_22px_rgba(0,210,255,0.35)] bg-[#102a50]' 
                            : 'border-[#00d2ff]/20 hover:border-[#00d2ff]/60 bg-[#0c1a30] hover:bg-[#0e213d] hover:shadow-[0_0_15px_rgba(0,210,255,0.15)]'
                        }`}
                      >
                        {/* Clean pre-designed image frame in dark-blue with cyan-tinged borders */}
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#071120] border border-[#00d2ff]/10 flex-shrink-0 flex items-center justify-center">
                          <img 
                            src={pkg.imageUrl} 
                            alt={`${pkg.quantity} Diamantes`}
                            className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.tried1) {
                                target.dataset.tried1 = 'true';
                                target.src = `https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/${pkg.quantity}-diamantes.png`;
                              } else if (!target.dataset.tried2) {
                                target.dataset.tried2 = 'true';
                                target.src = "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/venta-diamantes.png";
                              } else if (!target.dataset.tried3) {
                                target.dataset.tried3 = 'true';
                                target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";
                              }
                            }}
                          />
                          {/* Floating Top bonus tag */}
                          <div className="absolute top-2 left-2">
                            <span className="bg-[#ff0055] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md shadow-lg border border-white/10 animate-pulse">
                              {pkg.bonus}
                            </span>
                          </div>
                        </div>

                        {/* Info details with minimalist professional styling */}
                        <div className="pt-2.5 px-1.5 space-y-2 flex-grow flex flex-col justify-between text-left">
                          <div>
                            <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest block">PagoStore Oficial</span>
                            <h4 className="text-xs font-black text-white uppercase tracking-tight">{pkg.quantity} Diamantes</h4>
                          </div>

                          <div className="space-y-1.5 w-full">
                            <div className={`w-full py-1.5 rounded-xl font-mono text-[11px] font-black text-center border transition-all ${
                              isSelected 
                                ? 'bg-[#00d2ff] text-black border-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.25)]' 
                                : 'bg-[#132c52] text-gray-200 border-[#00d2ff]/20 group-hover:border-[#00d2ff]/55 group-hover:text-[#00d2ff]'
                            }`}>
                              ${priceForSelectedSeller.toFixed(2)} USD
                            </div>
                            
                            {/* Active seller display */}
                            <div className="flex items-center space-x-1.5 justify-center py-1 px-1.5 rounded-lg bg-white/5 border border-white/10">
                              <img 
                                src={activeSellerMeta.avatar} 
                                alt="" 
                                className="w-4 h-4 rounded-full object-cover border border-[#00d2ff]/40" 
                              />
                              <span className="text-[9px] text-gray-300 font-black truncate max-w-[95px] uppercase tracking-wider">
                                {activeSellerMeta.name}
                              </span>
                            </div>

                            {/* Direct Add to Cart Button */}
                            {(() => {
                              const diamondProductId = `diamante_${pkg.quantity}_${activeSellerMeta.id}`;
                              const simulatedProduct: Product = {
                                id: diamondProductId,
                                sellerId: activeSellerMeta.id,
                                sellerName: activeSellerMeta.name,
                                sellerAvatar: activeSellerMeta.avatar,
                                title: `Recarga ${pkg.quantity.toLocaleString()} Diamantes (${pkg.bonus}) - Vendedor ${activeSellerMeta.name}`,
                                description: `Recarga de ${pkg.quantity.toLocaleString()} diamantes directos por ID. Vendedor oficial: ${activeSellerMeta.name}.`,
                                price: priceForSelectedSeller,
                                type: "diamante",
                                category: "Recarga ID",
                                server: "Cualquier Región",
                                stock: 999,
                                images: [pkg.imageUrl],
                                status: "active",
                                createdAt: new Date().toISOString(),
                                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
                                tags: ["Diamantes", activeSellerMeta.name],
                                features: [`${pkg.quantity} Diamantes`, pkg.bonus, "Directo por ID"],
                                likes: 500,
                                dislikes: 0,
                                views: 5000
                              };
                              const isInCart = cart.some(item => item.id === diamondProductId);

                              return (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDiamondQty(pkg.quantity);
                                    if (!isInCart) {
                                      addToCart(simulatedProduct);
                                    }
                                  }}
                                  disabled={isInCart}
                                  className={`w-full mt-1.5 py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all ${
                                    isInCart 
                                      ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                                      : 'bg-gradient-to-r from-[#00d2ff] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_12px_rgba(0,210,255,0.25)]'
                                  }`}
                                >
                                  {isInCart ? (
                                    <>
                                      <Check className="h-3 w-3 stroke-[3]" />
                                      <span>¡Agregado!</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingCart className="h-3 w-3" />
                                      <span>Añadir al Carrito</span>
                                    </>
                                  )}
                                </button>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Selected Checkmark overlay indicator */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-[#00d2ff] text-black rounded-full p-1 shadow-[0_0_10px_rgba(0,210,255,0.8)] flex items-center justify-center z-10 scale-90">
                            <Check className="h-3 w-3 stroke-[4]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Available Offers & Add to Cart (1 Col span) */}
              <div className="lg:col-span-1 space-y-4 animate-fade-in" key={selectedDiamondQty}>
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs font-black text-[#b967ff] uppercase tracking-widest flex items-center">
                    <SlidersHorizontal className="h-4 w-4 text-[#b967ff] mr-2" />
                    Paso 2: Ofertas de Vendedores
                  </h3>
                </div>

                <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-4 text-left">
                  <div className="border-b border-white/5 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Tamaño Seleccionado</span>
                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        {selectedDiamondQty} Diamantes
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider mt-2 flex items-center">
                      <Gem className="h-4.5 w-4.5 text-[#00d2ff] mr-1.5" />
                      Recarga de {selectedDiamondQty.toLocaleString()} Diamantes
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1">Escoge tu vendedor de preferencia para realizar la recarga mediante PagoStore.</p>
                  </div>

                  {/* Sellers List offerings */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block">Vendedores Disponibles</span>
                    
                    {(() => {
                      const matching = products.filter(p => p.type === 'diamante' && p.quantity === selectedDiamondQty && p.status === 'active' && isProductSellerValid(p));
                      
                      // Map matching products
                      const customOffers = matching.map(p => {
                        const sellerObj = sellersList.find(s => s.id === p.sellerId);
                        return {
                          product: p,
                          sellerName: p.sellerName,
                          sellerAvatar: p.sellerAvatar,
                          reputation: sellerObj?.reputation || 98,
                          isOfficial: false,
                          level: sellerObj?.sellerLevel || 1,
                          price: p.price,
                          frame: sellerObj?.frame || 'none'
                        };
                      });

                      // Construct five simulated sellers with varied prices
                      const pkgObj = DIAMOND_PACKAGES_DATA.find(pkg => pkg.quantity === selectedDiamondQty)!;
                      const simulatedSellersMeta = [
                        {
                          id: "s_megastore",
                          name: "FF_MegaStore",
                          avatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80",
                          reputation: 97,
                          isOfficial: false,
                          level: 4,
                          frame: "neon",
                          multiplier: 0.91 // Cheapest (approx 9% off)
                        },
                        {
                          id: "s_diamond",
                          name: "DiamondGamer_LATAM",
                          avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
                          reputation: 99,
                          isOfficial: false,
                          level: 5,
                          frame: "golden",
                          multiplier: 0.94 // Discounted (6% off)
                        },
                        {
                          id: "s_chrono",
                          name: "ChronoSales_ES",
                          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                          reputation: 98,
                          isOfficial: false,
                          level: 4,
                          frame: "animated",
                          multiplier: 0.97 // Small discount (3% off)
                        },
                        {
                          id: "s_official",
                          name: "Tienda Oficial FF",
                          avatar: "https://github.com/luqueSmith/FreFire/blob/main/img/venta-diamantes.png?raw=true",
                          reputation: 100,
                          isOfficial: true,
                          level: 5,
                          frame: "evolutive",
                          multiplier: 1.00 // Standard official price
                        },
                        {
                          id: "s_sakura",
                          name: "SakuraVentas_FF",
                          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                          reputation: 94,
                          isOfficial: false,
                          level: 3,
                          frame: "none",
                          multiplier: 1.05 // Premium service
                        }
                      ];

                      const simulatedOffers = simulatedSellersMeta.map(seller => {
                        const calculatedPrice = pkgObj.defaultPrice * seller.multiplier;
                        const simulatedProduct: Product = {
                          id: `diamante_${selectedDiamondQty}_${seller.id}`,
                          sellerId: seller.id,
                          sellerName: seller.name,
                          sellerAvatar: seller.avatar,
                          title: `Recarga ${selectedDiamondQty.toLocaleString()} Diamantes - ${seller.name}`,
                          description: `Recarga de ${selectedDiamondQty.toLocaleString()} diamantes directos por ID de jugador. Entregado al instante de forma automática por ${seller.name}.`,
                          price: calculatedPrice,
                          type: "diamante",
                          category: "Recarga ID",
                          server: "Cualquier Región",
                          stock: 999,
                          images: [pkgObj.imageUrl],
                          status: "active",
                          createdAt: new Date().toISOString(),
                          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
                          tags: ["Diamantes", seller.isOfficial ? "Oficial" : "Socio"],
                          features: [`${selectedDiamondQty} Diamantes`, "Solo ID", "Entrega instantánea"],
                          likes: 350 + Math.floor(Math.random() * 200),
                          dislikes: 0,
                          views: 4000 + Math.floor(Math.random() * 8000)
                        };

                        return {
                          product: simulatedProduct,
                          sellerName: seller.name,
                          sellerAvatar: seller.avatar,
                          reputation: seller.reputation,
                          isOfficial: seller.isOfficial,
                          level: seller.level,
                          price: calculatedPrice,
                          frame: seller.frame
                        };
                      });

                      // Combine and sort ascending (Cheapest at the top, increasing prices down the list)
                      const allOffers = [...customOffers, ...simulatedOffers];
                      allOffers.sort((a, b) => a.price - b.price);

                      return allOffers.map((offer, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            selectedSellerForDiamonds === offer.product.sellerId
                              ? 'bg-[#00d2ff]/5 border-[#00d2ff]/45 shadow-[0_0_12px_rgba(0,210,255,0.12)]'
                              : offer.isOfficial 
                                ? 'bg-gradient-to-r from-purple-950/20 to-black/40 border-neon-purple/20 shadow-[inset_0_0_10px_rgba(157,80,187,0.05)] hover:border-neon-purple/35' 
                                : 'bg-black/30 border-white/5 hover:border-white/10'
                          } flex flex-col justify-between space-y-2.5`}
                        >
                          <div className="flex items-center justify-between">
                            <div 
                              onClick={() => {
                                if (offer.product.sellerId) {
                                  setActiveView('public_seller', offer.product.sellerId);
                                }
                              }}
                              className="flex items-center space-x-2 cursor-pointer group/seller hover:opacity-80 transition-opacity"
                              title="Ver Perfil Público de Vendedor"
                            >
                              <ProfileAvatar url={offer.sellerAvatar} frame={offer.frame as any} size="sm" />
                              <div className="text-left min-w-0">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-black text-white truncate max-w-[95px] group-hover/seller:text-[#00d2ff] transition-colors">{offer.sellerName}</span>
                                  {offer.isOfficial && (
                                    <span className="bg-neon-purple/20 text-neon-purple text-[8px] font-bold px-1 py-0.2 rounded border border-neon-purple/30 flex-shrink-0">VERIFICADO</span>
                                  )}
                                </div>
                                <span className="text-[9px] text-emerald-400 font-bold block">{offer.reputation}% Reputación</span>
                                
                                {/* Option to see their prices and change active selection */}
                                <div className="mt-1 flex items-center">
                                  {selectedSellerForDiamonds === offer.product.sellerId ? (
                                    <span className="bg-[#00d2ff]/10 text-[#00d2ff] text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-[#00d2ff]/30 uppercase tracking-wider">
                                      Vendedor Seleccionado
                                    </span>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSellerForDiamonds(offer.product.sellerId);
                                      }}
                                      className="bg-white/5 hover:bg-[#00d2ff]/15 text-gray-400 hover:text-[#00d2ff] text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-white/10 hover:border-[#00d2ff]/30 uppercase tracking-wider transition-all"
                                      title="Mostrar los precios de este vendedor en el catálogo de diamantes"
                                    >
                                      Ver sus precios
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {!offer.isOfficial && (
                                <a
                                  href={`https://api.whatsapp.com/send?phone=51906328464&text=Hola,%20quisiera%20consultar%20sobre%20la%20oferta%20de%20${encodeURIComponent(offer.sellerName)}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 transition-all border border-emerald-500/20 flex items-center space-x-1"
                                  title="Contactar WhatsApp Vendedor"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </a>
                              )}
                              <div className="text-right">
                                <span className="text-xs font-mono font-black text-[#00d2ff] block">${offer.price.toFixed(2)} USD</span>
                                <span className="text-[8px] text-gray-500 block">Express</span>
                              </div>
                            </div>
                          </div>

                          {(() => {
                            const isInCart = cart.some(item => item.id === offer.product.id);
                            return (
                              <button
                                onClick={() => {
                                  if (isInCart) {
                                    return;
                                  }
                                  addToCart(offer.product);
                                }}
                                className={`w-full py-2 rounded text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-1 ${
                                  isInCart
                                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:bg-emerald-500'
                                    : 'bg-[#00d2ff] hover:bg-[#00b2df] text-black hover:shadow-[0_0_15px_rgba(0,210,255,0.3)] font-black'
                                }`}
                              >
                                {isInCart ? (
                                  <>
                                    <Check className="h-3 w-3 stroke-[3] mr-1" />
                                    <span>¡Agregado al Carrito!</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    <span>Añadir al Carrito</span>
                                  </>
                                )}
                              </button>
                            );
                          })()}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* GUÍA DE COMPRA Y FUNCIONAMIENTO DE DIAMANTES */}
            <div className="glass-panel rounded-xl p-6 border border-[#00d2ff]/10 bg-[#0d1629]/90 space-y-6 mt-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2ff]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 relative z-10">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2 bg-[#00d2ff]/10 text-[#00d2ff] rounded-lg border border-[#00d2ff]/20">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#00d2ff] font-extrabold uppercase tracking-widest block">Centro de Ayuda Integrado</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Guía Completa y Funcionamiento de Diamantes
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      Descubre cómo funciona el sistema de recargas PagoStore, cómo comprar y cómo sacar el máximo provecho a la pestaña de "Diamantes".
                    </p>
                  </div>
                </div>

                {/* Tab selectors */}
                <div className="flex flex-wrap items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setActiveGuideTab('compra')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center space-x-1.5 ${
                      activeGuideTab === 'compra'
                        ? 'bg-[#00d2ff] text-black shadow-[0_0_10px_rgba(0,210,255,0.25)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>¿Cómo comprar?</span>
                  </button>
                  <button
                    onClick={() => setActiveGuideTab('funciona')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center space-x-1.5 ${
                      activeGuideTab === 'funciona'
                        ? 'bg-[#00d2ff] text-black shadow-[0_0_10px_rgba(0,210,255,0.25)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>¿Cómo funciona?</span>
                  </button>
                  <button
                    onClick={() => setActiveGuideTab('uso')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center space-x-1.5 ${
                      activeGuideTab === 'uso'
                        ? 'bg-[#00d2ff] text-black shadow-[0_0_10px_rgba(0,210,255,0.25)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>¿Cómo usar la pestaña?</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: ¿CÓMO COMPRAR? */}
              {activeGuideTab === 'compra' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 animate-fade-in text-left">
                  <div className="bg-[#111c30]/40 border border-[#00d2ff]/5 p-4 rounded-xl space-y-2 hover:border-[#00d2ff]/20 transition-all group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#00d2ff] font-mono font-black bg-[#00d2ff]/10 px-2 py-0.5 rounded">Paso 01</span>
                      <UserCheck className="h-4 w-4 text-[#00d2ff] group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight">Ingresa tu ID</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      En la barra superior de la pestaña de Diamantes, escribe tu ID de jugador de Free Fire y presiona verificar. El sistema confirmará que sea un ID válido para evitar errores de envío.
                    </p>
                  </div>

                  <div className="bg-[#111c30]/40 border border-[#00d2ff]/5 p-4 rounded-xl space-y-2 hover:border-[#00d2ff]/20 transition-all group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#00d2ff] font-mono font-black bg-[#00d2ff]/10 px-2 py-0.5 rounded">Paso 02</span>
                      <Gem className="h-4 w-4 text-[#00d2ff] group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight">Selecciona tu Paquete</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Haz clic en el paquete de diamantes de tu elección (desde 100 hasta 5,600 diamantes). La tarjeta seleccionada se marcará con un borde brillante y un check azul.
                    </p>
                  </div>

                  <div className="bg-[#111c30]/40 border border-[#00d2ff]/5 p-4 rounded-xl space-y-2 hover:border-[#00d2ff]/20 transition-all group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#00d2ff] font-mono font-black bg-[#00d2ff]/10 px-2 py-0.5 rounded">Paso 03</span>
                      <SlidersHorizontal className="h-4 w-4 text-[#00d2ff] group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight">Elige el Mejor Vendedor</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Revisa en la columna derecha las ofertas disponibles de diferentes vendedores para ese paquete. Compara precios, reputaciones de entrega y beneficios adicionales.
                    </p>
                  </div>

                  <div className="bg-[#111c30]/40 border border-[#00d2ff]/5 p-4 rounded-xl space-y-2 hover:border-[#00d2ff]/20 transition-all group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#00d2ff] font-mono font-black bg-[#00d2ff]/10 px-2 py-0.5 rounded">Paso 04</span>
                      <ShoppingCart className="h-4 w-4 text-[#00d2ff] group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight">Al Carrito y Checkout</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Haz clic en "Añadir al Carrito" en la oferta elegida. Ve al ícono del carrito en la barra superior de navegación, confirma tus datos e ID, y completa el checkout de tu pedido.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ¿CÓMO FUNCIONA? */}
              {activeGuideTab === 'funciona' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10 animate-fade-in text-left">
                  <div className="bg-[#111c30]/40 border border-white/5 p-4 rounded-xl space-y-2.5">
                    <div className="flex items-center space-x-2 text-[#00d2ff]">
                      <ShieldCheck className="h-4 w-4" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight">Cero Contraseñas (100% ID)</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Las recargas se realizan de manera 100% externa utilizando el sistema de recargas por ID oficial de PagoStore. Esto significa que <strong>nunca se te pedirá tu correo, contraseña ni datos de redes sociales</strong>, garantizando que tu cuenta de Free Fire esté totalmente protegida.
                    </p>
                  </div>

                  <div className="bg-[#111c30]/40 border border-white/5 p-4 rounded-xl space-y-2.5">
                    <div className="flex items-center space-x-2 text-[#00d2ff]">
                      <Zap className="h-4 w-4 animate-pulse" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight">Entrega Express Directa</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Una vez que confirmas y pagas tu pedido a través de tu carrito de compras, el vendedor es notificado instantáneamente con tu ID de jugador. El proceso de carga toma únicamente de <strong>2 a 5 minutos hábiles</strong> y podrás ver el incremento directo en tu juego.
                    </p>
                  </div>

                  <div className="bg-[#111c30]/40 border border-white/5 p-4 rounded-xl space-y-2.5">
                    <div className="flex items-center space-x-2 text-[#00d2ff]">
                      <Check className="h-4 w-4 stroke-[3]" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight">Garantía Anti-Estafas</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Tu dinero se almacena de forma segura en la billetera temporal de la plataforma. El vendedor no recibe el saldo de tu compra sino hasta que ingreses a tu cuenta de juego, confirmes el estado de tus diamantes y marques el pedido como "Recibido" en tu panel de compras.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: ¿CÓMO USAR LA PESTAÑA? */}
              {activeGuideTab === 'uso' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10 animate-fade-in text-left">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 bg-black/20 p-3.5 rounded-xl border border-white/5">
                      <div className="p-1.5 bg-[#00d2ff]/10 text-[#00d2ff] rounded-lg mt-0.5">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white uppercase">Selector de Vendedor Preferido</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                          Usa la barra de filtros de vendedores preferidos ubicada debajo del título de la sección. Al hacer clic en un vendedor (por ejemplo, <em>FF_MegaStore</em> o <em>Tienda Oficial FF</em>), el catálogo calculará automáticamente los precios de todos los paquetes basados en la oferta específica de ese vendedor.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 bg-black/20 p-3.5 rounded-xl border border-white/5">
                      <div className="p-1.5 bg-[#00d2ff]/10 text-[#00d2ff] rounded-lg mt-0.5">
                        <Info className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white uppercase">Acceso de Filtro desde "Ofertas"</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                          Cuando estés revisando los vendedores en el panel derecho de ofertas (Paso 2), puedes presionar el botón <strong>"Ver sus precios"</strong> en cualquier vendedor de la lista. Esto actualizará el selector superior y re-calculará todo el catálogo con los precios de ese vendedor.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 bg-black/20 p-3.5 rounded-xl border border-emerald-500/20">
                      <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg mt-0.5">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white uppercase">Soporte y Atención por WhatsApp</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                          ¿Tienes dudas sobre una entrega, recargas o verificación de pagos? Nuestra central oficial en WhatsApp <strong>+51 906328464</strong> está disponible para asistirte directamente en todo momento.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 bg-black/20 p-3.5 rounded-xl border border-white/5">
                      <div className="p-1.5 bg-[#00d2ff]/10 text-[#00d2ff] rounded-lg mt-0.5">
                        <Coins className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white uppercase">Comparación de Precios del Mercado</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                          Nuestra plataforma integra un motor comparador de precios dinámico. Cada paquete de diamantes calcula en tiempo real los márgenes y multiplicadores de reputación de los vendedores de la comunidad para asegurar que siempre tengas la transparencia de quién ofrece el mejor precio.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: TOP SELLERS */}
        {activeView === 'sellers' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111]">
              <span className="text-[10px] text-neon-blue font-bold uppercase bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20">Reputación y Confianza</span>
              <h2 className="text-base font-black text-white uppercase mt-1.5">Top Vendedores Verificados de FF MARKET PRO</h2>
              <p className="text-xs text-gray-400 mt-1">Nuestros mejores comerciantes con tasas de entrega del 100% y tiempos de respuesta ultra rápidos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sellersList.filter(seller => {
                const user = usersList.find(u => u.id === seller.userId);
                if (!user) return false;
                const isCurrentUser = user.id === userProfile?.id;
                const actualRole = isCurrentUser ? currentRole : user.role;
                return actualRole === 'Vendedor' || actualRole === 'Administrador';
              }).map((seller) => (
                <div 
                  key={seller.id} 
                  className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-neon-purple/40 bg-[#111111] transition-all flex flex-col justify-between"
                >
                  <div className="relative h-20 bg-black">
                    <img src={seller.banner} alt="" className="h-full w-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
                  </div>

                  <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
                    <div className="text-center -mt-10 relative space-y-1.5">
                      <img src={seller.avatar} alt="" className="h-16 w-16 rounded-full object-cover mx-auto border-2 border-neon-purple" />
                      <h3 className="text-sm font-black text-white">{seller.username}</h3>
                      <p className="text-[11px] text-gray-400 line-clamp-2 min-h-[32px]">{seller.description}</p>
                    </div>

                    <div className="border-t border-b border-white/5 my-3 py-2 flex justify-between text-center text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] block">Ventas</span>
                        <strong className="text-white text-sm">{seller.salesCount}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Confianza</span>
                        <strong className="text-emerald-400 text-sm">{seller.reputation}%</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Valoración</span>
                        <strong className="text-yellow-400 text-sm flex items-center justify-center">
                          <Star className="h-3 w-3 fill-current mr-0.5" />
                          {seller.ratingAverage}
                        </strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView('public_seller', seller.id)}
                      className="w-full text-center py-2 text-xs font-bold uppercase tracking-wider rounded btn-neon-purple"
                    >
                      Ver Perfil Público
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: PUBLIC SELLER PROFILE & DEDICATED SELLER STOREFRONT MINI-WEB */}
        {(activeView === 'public_seller' || activeView === 'seller_storefront') && selectedSeller && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* UNIFIED SINGLE HERO PROFILE BANNER */}
            <div className="relative rounded-3xl overflow-hidden border border-neon-purple/30 bg-[#0d0a1a] shadow-[0_0_35px_rgba(168,85,247,0.15)] transition-all">
              {/* Background Cover Image with Gradient */}
              <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                <img 
                  src={selectedSeller.banner} 
                  alt={selectedSeller.username} 
                  className="h-full w-full object-cover opacity-50 scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a1a] via-[#0d0a1a]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d0a1a]/90 via-transparent to-transparent" />
              </div>

              {/* Profile Info & Unified Action Bar */}
              <div className="px-5 sm:px-8 pb-6 -mt-20 sm:-mt-24 relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                
                {/* Avatar & Text Details */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-4">
                  <div className="relative flex-shrink-0">
                    <ProfileAvatar 
                      url={selectedSeller.avatar} 
                      frame={selectedSeller.frame || 'none'} 
                      size="xl" 
                      className="ring-4 ring-[#0d0a1a] shadow-2xl" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-1 rounded-full border-2 border-[#0d0a1a]" title="Vendedor Verificado Activo">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{selectedSeller.username}</h2>
                      <span className="bg-neon-purple/20 text-neon-purple text-xs font-black uppercase px-2.5 py-0.5 rounded-md border border-neon-purple/30">
                        Nivel {selectedSeller.sellerLevel}
                      </span>
                      {selectedSeller.medals && selectedSeller.medals.map((m, idx) => (
                        <span key={idx} className="bg-cyan-500/10 text-cyan-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-cyan-500/20">
                          {m}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-gray-300 max-w-lg leading-relaxed line-clamp-2 pt-0.5">
                      {selectedSeller.description}
                    </p>

                    {/* Stats pill row */}
                    <div className="flex items-center justify-center sm:justify-start space-x-4 pt-1 text-xs">
                      <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <Check className="h-3.5 w-3.5" />
                        <span>{selectedSeller.reputation}% Positivo</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-400 font-bold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{selectedSeller.ratingAverage} ({selectedSeller.salesCount} ventas)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unified Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto flex-shrink-0">
                  
                  {/* Share Button with prominent copy toast */}
                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/?seller=${selectedSeller.id}&mode=storefront`;
                      navigator.clipboard.writeText(link);
                      setCopiedShareNotice(`¡Link de la Mini-Web de ${selectedSeller.username} copiado al portapapeles! 🌐`);
                      setTimeout(() => setCopiedShareNotice(null), 4000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-neon-purple/20 border border-neon-purple/40 transition-all hover:scale-105 active:scale-95"
                    title="Copiar link directo para compartir esta Mini-Web"
                  >
                    <Share2 className="h-4 w-4 text-white" />
                    <span>Compartir Mini-Web</span>
                  </button>

                  {/* WhatsApp Direct Contact */}
                  <a
                    href={`https://api.whatsapp.com/send?phone=51906328464&text=Hola,%20quisiera%20contactar%20con%20el%20vendedor%20${encodeURIComponent(selectedSeller.username)}%20en%20FF%20Market%20Pro.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <Phone className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Follow Button */}
                  {!(sellerProfile.id === selectedSeller.id || (isLoggedIn && userProfile.id === selectedSeller.userId) || (sellerProfile.username === selectedSeller.username)) && (
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          alert("🔒 Debes iniciar sesión con tu cuenta para seguir a este vendedor.");
                          setActiveView('login');
                          return;
                        }
                        followSeller(selectedSeller.id);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center space-x-2 border transition-all hover:scale-105 active:scale-95 shadow-md ${
                        isFollowingSeller(selectedSeller.id)
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                      }`}
                    >
                      {isFollowingSeller(selectedSeller.id) ? (
                        <>
                          <UserCheck className="h-4 w-4 text-emerald-400" />
                          <span>Siguiendo</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 text-gray-300" />
                          <span>Seguir</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Switch Mode Button */}
                  {activeView === 'seller_storefront' ? (
                    <button
                      onClick={() => setActiveView('home')}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-extrabold text-xs uppercase tracking-wider border border-white/10 flex items-center space-x-1.5 transition-all"
                      title="Volver al mercado general con todas las tiendas"
                    >
                      <Globe className="h-4 w-4 text-cyan-400" />
                      <span>Mercado General</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveView('seller_storefront', selectedSeller.id)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider border border-purple-400/30 flex items-center space-x-1.5 transition-all shadow-md"
                      title="Abrir en modo Mini-Web exclusiva"
                    >
                      <Globe className="h-4 w-4 text-cyan-300 animate-pulse" />
                      <span>Modo Mini-Web</span>
                    </button>
                  )}

                </div>
              </div>
            </div>

            {/* Seller stats & items grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              <div id="storefront-reputation-section" className="lg:col-span-1 space-y-4">
                <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] space-y-3.5 text-xs">
                  <h3 className="font-bold text-white uppercase border-b border-white/5 pb-2">Reputación</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Calificaciones Positivas:</span>
                    <strong className="text-emerald-400">{selectedSeller.reputation}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Likes en Perfil:</span>
                    <strong className="text-neon-blue">{selectedSeller.likesCount} 👍</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dislikes:</span>
                    <strong className="text-[#ff007f]">{selectedSeller.dislikesCount || 0} 👎</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Última Conexión:</span>
                    <strong className="text-gray-300">{selectedSeller.lastActive}</strong>
                  </div>

                  {/* Direct Like / Dislike buttons for the seller */}
                  <div className="border-t border-white/5 pt-3.5 mt-2 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">¿Recomiendas a este vendedor?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSellerVote(selectedSeller, 'like')}
                        className={`flex items-center justify-center space-x-1 py-1.5 rounded transition-all font-bold ${
                          votedSellers[selectedSeller.id] === 'like'
                            ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                            : 'bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400'
                        }`}
                        title={votedSellers[selectedSeller.id] === 'like' ? "Quitar Recomendación" : "Recomendar Vendedor"}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{votedSellers[selectedSeller.id] === 'like' ? 'Recomendado' : 'Sí'}</span>
                      </button>
                      <button
                        onClick={() => handleSellerVote(selectedSeller, 'dislike')}
                        className={`flex items-center justify-center space-x-1 py-1.5 rounded transition-all font-bold ${
                          votedSellers[selectedSeller.id] === 'dislike'
                            ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                            : 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400'
                        }`}
                        title={votedSellers[selectedSeller.id] === 'dislike' ? "Quitar No Recomendación" : "No Recomendar Vendedor"}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        <span>{votedSellers[selectedSeller.id] === 'dislike' ? 'No Recomendado' : 'No'}</span>
                      </button>
                    </div>
                  </div>

                  {selectedSeller.phone && (
                    <div className="border-t border-white/5 pt-3.5 mt-2 space-y-2 text-left">
                      <span className="text-gray-400 block font-bold uppercase text-[9px] tracking-wider">Contacto Directo</span>
                      <a
                        href={`https://wa.me/${selectedSeller.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-wide transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
                      >
                        <Phone className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </a>
                      <span className="text-[10px] text-gray-500 text-center block font-mono">{selectedSeller.phone}</span>
                    </div>
                  )}
                </div>

                {/* INSIGNIAS CARD */}
                <div className="rounded-2xl p-4.5 border border-indigo-900/50 bg-[#0b0e1b] shadow-[0_0_25px_rgba(30,27,75,0.3)] text-xs">
                  <h3 className="font-black text-white text-sm uppercase tracking-wider border-b border-white/10 pb-2.5 mb-3.5 flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="text-yellow-400">🏅</span>
                      <span>INSIGNIAS</span>
                    </span>
                    <span className="text-[9px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 uppercase tracking-wider">
                      {selectedSeller.medals.length} Obtendidas
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeller.medals.map((m, idx) => (
                      <div key={idx} className="bg-[#12162b] border border-indigo-500/30 text-gray-200 px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wide flex items-center space-x-1.5 shadow-sm">
                        <span className="text-amber-400">🎖️</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MÉTODOS DE PAGO CARD (Right below Insignias) */}
                <div className="rounded-2xl p-4.5 border border-purple-900/50 bg-[#0c0d1c] shadow-[0_0_25px_rgba(88,28,135,0.25)] text-xs">
                  <h3 className="font-black text-white text-sm uppercase tracking-wider border-b border-white/10 pb-2.5 mb-3.5 flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="text-cyan-400">💳</span>
                      <span>MÉTODOS DE PAGO</span>
                    </span>
                    <span className="text-[9px] text-emerald-400 font-black bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30 uppercase tracking-wider flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Aceptados</span>
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {(selectedSeller.acceptedPaymentMethods && selectedSeller.acceptedPaymentMethods.length > 0
                      ? selectedSeller.acceptedPaymentMethods
                      : DEFAULT_SELLER_PAYMENT_METHODS
                    ).map((mId) => (
                      <PaymentMethodBadge key={mId} methodId={mId} size="md" showFullName />
                    ))}
                  </div>
                </div>

                {/* Report button */}
                <button
                  onClick={() => {
                    setReportTargetType('seller');
                    setReportReasonText('');
                    setReportSuccessMsg('');
                    setReportModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 rounded bg-red-500/5 hover:bg-red-500/15 border border-red-500/25 hover:border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Flag className="h-3.5 w-3.5 text-red-400 animate-pulse" />
                  <span>Reportar Vendedor</span>
                </button>
              </div>

              <div className="lg:col-span-3 space-y-6">
                {/* 1. SELLER DIAMOND CATALOG (PAGOSTORE) */}
                <div id="storefront-diamonds-section" className="space-y-4">
                  <div className="flex items-center justify-between border-l-2 border-[#00d2ff] pl-2.5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center">
                      <Gem className="h-4 w-4 text-[#00d2ff] mr-2" />
                      Precios y Paquetes de Diamantes de {selectedSeller.username}
                    </h3>
                    <span className="text-[10px] text-cyan-400 font-extrabold uppercase bg-[#00d2ff]/10 px-2.5 py-1 rounded-full border border-[#00d2ff]/20">
                      PagoStore Oficial
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {DIAMOND_PACKAGES_DATA.map((pkg) => {
                      const price = getDiamondPriceForSeller(pkg.quantity, selectedSeller.id);
                      
                      const diamondProductId = `diamante_${pkg.quantity}_${selectedSeller.id}`;
                      const existingProduct = products.find(p => p.type === 'diamante' && p.quantity === pkg.quantity && p.sellerId === selectedSeller.id && p.status === 'active');
                      
                      const diamondProduct: Product = existingProduct || {
                        id: diamondProductId,
                        sellerId: selectedSeller.id,
                        sellerName: selectedSeller.username,
                        sellerAvatar: selectedSeller.avatar,
                        title: `Recarga ${pkg.quantity.toLocaleString()} Diamantes - ${selectedSeller.username}`,
                        description: `Recarga de ${pkg.quantity.toLocaleString()} diamantes directos por ID de jugador por ${selectedSeller.username}.`,
                        price: price,
                        type: "diamante",
                        category: "Recarga ID",
                        server: "Cualquier Región",
                        stock: 999,
                        images: [pkg.imageUrl],
                        status: "active",
                        createdAt: new Date().toISOString(),
                        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
                        tags: ["Diamantes", "PagoStore"],
                        features: [`${pkg.quantity} Diamantes`, "Solo ID", "Entrega Instantánea"],
                        likes: 250,
                        dislikes: 0,
                        views: 1200
                      };

                      const isInCart = cart.some(item => item.id === diamondProduct.id);

                      return (
                        <div
                          key={pkg.quantity}
                          className="relative rounded-2xl overflow-hidden transition-all duration-300 p-2.5 flex flex-col justify-between group border border-[#00d2ff]/20 hover:border-[#00d2ff]/60 bg-[#0c1a30] hover:bg-[#0e213d] hover:shadow-[0_0_15px_rgba(0,210,255,0.15)] min-h-[220px]"
                        >
                          {/* Image Frame */}
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#071120] border border-[#00d2ff]/10 flex-shrink-0 flex items-center justify-center">
                            <img 
                              src={pkg.imageUrl} 
                              alt={`${pkg.quantity} Diamantes`}
                              className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (!target.dataset.tried1) {
                                  target.dataset.tried1 = 'true';
                                  target.src = `https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/${pkg.quantity}-diamantes.png`;
                                } else if (!target.dataset.tried2) {
                                  target.dataset.tried2 = 'true';
                                  target.src = "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/venta-diamantes.png";
                                } else if (!target.dataset.tried3) {
                                  target.dataset.tried3 = 'true';
                                  target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80";
                                }
                              }}
                            />
                            {/* Floating Top bonus tag */}
                            <div className="absolute top-2 left-2">
                              <span className="bg-[#ff0055] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md shadow-lg border border-white/10 animate-pulse">
                                {pkg.bonus}
                              </span>
                            </div>
                          </div>

                          {/* Info details */}
                          <div className="pt-2 px-1 space-y-2 flex-grow flex flex-col justify-between text-left">
                            <div>
                              <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest block">PagoStore Oficial</span>
                              <h4 className="text-xs font-black text-white uppercase tracking-tight">{pkg.quantity} Diamantes</h4>
                            </div>

                            <div className="space-y-1.5 w-full">
                              <div className="w-full py-1.5 rounded-xl font-mono text-[11px] font-black text-center border bg-[#132c52] text-gray-200 border-[#00d2ff]/20 group-hover:border-[#00d2ff]/55 group-hover:text-[#00d2ff]">
                                ${price.toFixed(2)} USD
                              </div>
                              
                              <div className="flex items-center space-x-1.5 justify-center opacity-90 px-1">
                                <ProfileAvatar url={selectedSeller.avatar} frame={selectedSeller.frame || 'none'} size="xs" />
                                <span className="text-[8px] text-gray-400 font-extrabold truncate max-w-[95px] uppercase tracking-wider">
                                  {selectedSeller.username}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  if (!isInCart) {
                                    addToCart(diamondProduct);
                                  }
                                }}
                                disabled={isInCart}
                                className={`w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-1 ${
                                  isInCart 
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-[#00d2ff] hover:bg-[#00b2df] text-black hover:shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                                }`}
                              >
                                {isInCart ? (
                                  <>
                                    <Check className="h-3 w-3 stroke-[3] mr-1" />
                                    <span>Agregado</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    <span>Añadir al Carrito</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. OTHER ACTIVE PUBLICATIONS (CUENTAS, HACKS, COMBOS) */}
                {(() => {
                  const otherProducts = products.filter(p => p.sellerId === selectedSeller.id && p.status === 'active' && p.type !== 'diamante');
                  return (
                    <div id="storefront-products-section" className="space-y-4 pt-4 border-t border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-l-2 border-neon-purple pl-2.5">
                        Otras Publicaciones de {selectedSeller.username} ({otherProducts.length})
                      </h3>

                      {otherProducts.length === 0 ? (
                        <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111]/50 text-center text-gray-500 text-xs">
                          Este vendedor no tiene otras publicaciones activas (cuentas, combos o hacks) actualmente.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {otherProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* REVIEWS AND FEEDBACK SECTION */}
                <div className="border-t border-white/5 pt-6 mt-6 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-l-2 border-neon-purple pl-2.5">
                    Opiniones y Calificaciones ({reviewsList.filter(r => r.sellerId === selectedSeller.id).length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reviews list */}
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {reviewsList.filter(r => r.sellerId === selectedSeller.id).length === 0 ? (
                        <div className="glass-panel rounded-xl p-6 border border-white/5 bg-[#111111]/40 text-center text-gray-500 text-xs">
                          Este vendedor aún no tiene opiniones. ¡Sé el primero en calificar su servicio!
                        </div>
                      ) : (
                        reviewsList.filter(r => r.sellerId === selectedSeller.id).map((rev) => (
                          <div key={rev.id} className="glass-panel p-4 rounded-xl border border-white/5 bg-[#111111]/80 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <img src={rev.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                                <span className="font-bold text-gray-200">{rev.username}</span>
                              </div>
                              <div className="flex items-center text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < rev.rating ? 'fill-current text-yellow-400' : 'text-gray-600'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed italic">"{rev.comment}"</p>
                            <span className="text-[10px] text-gray-500 block text-right">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Review Form */}
                    <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-4 h-fit">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dejar una Calificación</h4>
                      {reviewSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-xs p-2 rounded">
                          {reviewSuccess}
                        </div>
                      )}
                      <form onSubmit={(e) => handleReviewSubmit(e, selectedSeller.id)} className="space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Puntuación</label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                              >
                                <Star 
                                  className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Tu Opinión</label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Escribe tu experiencia con este vendedor..."
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-white focus:border-neon-purple focus:outline-none h-20 resize-none text-xs"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 rounded text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-blue hover:to-blue-600 transition-all shadow-md"
                        >
                          Enviar Calificación
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* VIEW 5: NEWS LIST */}
        {activeView === 'news' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111]">
              <span className="text-[10px] text-neon-blue font-bold uppercase bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20">Agenda Semanal y Blog</span>
              <h2 className="text-base font-black text-white uppercase mt-1.5">FF Noticias y Novedades</h2>
              <p className="text-xs text-gray-400 mt-1">Agenda semanal oficial, códigos de canje e informes de seguridad sobre Free Fire.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockNews.map((art) => (
                <div 
                  key={art.id} 
                  onClick={() => setSelectedArticleId(art.id)}
                  className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-white/10 bg-[#111111] cursor-pointer flex flex-col justify-between"
                >
                  <img src={art.image} alt="" className="h-44 w-full object-cover" />
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5 text-left">
                      <span className="text-[9px] bg-neon-purple/20 text-neon-purple border border-neon-purple/20 px-2 py-0.5 rounded font-black uppercase">
                        {art.tag}
                      </span>
                      <h3 className="text-sm font-bold text-white hover:text-neon-blue transition-colors line-clamp-2">{art.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-3">{art.summary}</p>
                    </div>
                    <span className="text-[10px] text-gray-500 block pt-3 border-t border-white/5 mt-4">Publicado: {art.publishedAt}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Read news modal expansion */}
            {selectedArticleId && (
              <div 
                onClick={() => setSelectedArticleId(null)}
                className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md cursor-pointer"
              >
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#111111] border border-white/10 rounded-xl max-w-2xl w-full p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl glow-blue cursor-default"
                >
                  <div className="flex justify-between items-start border-b border-white/5 pb-2">
                    <span className="text-xs font-bold uppercase text-neon-blue">{mockNews.find(a => a.id === selectedArticleId)?.tag}</span>
                    <button onClick={() => setSelectedArticleId(null)} className="text-gray-400 hover:text-white font-bold">✕ Cerrar</button>
                  </div>
                  <img src={mockNews.find(a => a.id === selectedArticleId)?.image} alt="" className="w-full h-56 object-cover rounded-lg" />
                  <h2 className="text-lg font-black text-white">{mockNews.find(a => a.id === selectedArticleId)?.title}</h2>
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{mockNews.find(a => a.id === selectedArticleId)?.content}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: FAQ ACCORDION */}
        {activeView === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in text-left">
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] text-center">
              <span className="text-[10px] text-neon-blue font-bold uppercase bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20">Centro de Respuestas</span>
              <h2 className="text-base font-black text-white uppercase mt-1.5">Centro de Ayuda y FAQ</h2>
              <p className="text-xs text-gray-400 mt-1">Preguntas y respuestas sobre el proceso de compra, el sistema de retención de fondos y entrega.</p>
            </div>

            <div className="space-y-3">
              {mockFaq.map((item) => (
                <div 
                  key={item.id} 
                  className="glass-panel rounded-xl border border-white/5 bg-[#111111] p-4 text-xs space-y-2"
                >
                  <h3 className="font-bold text-white flex items-center">
                    <HelpCircle className="h-4 w-4 text-neon-blue mr-2" />
                    {item.question}
                  </h3>
                  <p className="text-gray-400 leading-relaxed pl-6">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: CONTACTO DIRECTO & INTERMEDIARIO VIA WHATSAPP */}
        {activeView === 'contact' && (
          <div className="max-w-2xl mx-auto animate-fade-in text-left">
            <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-[#0d131f] space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center">
                    <Phone className="h-6 w-6 text-emerald-400 mr-2.5" />
                    Atención Directa y Soporte Oficial
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Contacta directamente a nuestra central de atención telefónica y WhatsApp para ventas, intermediario y recargas.
                  </p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  Atención 24/7
                </span>
              </div>

              {/* Direct Number Card */}
              <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-cyan-900/40 border border-emerald-500/40 rounded-xl p-5 text-center space-y-3">
                <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest">Número de Atención Principal</p>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider text-glow-blue">
                  +51 906328464
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <a
                    href="https://api.whatsapp.com/send?phone=51906328464&text=Hola,%20quisiera%20solicitar%20soporte%20o%20consultar%20sobre%20las%20ventas/intermediario%20en%20FF%20Market%20Pro."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>WhatsApp Directo (+51 906328464)</span>
                  </a>
                  <a
                    href="tel:+51906328464"
                    className="py-3 px-5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Llamar por Teléfono</span>
                  </a>
                </div>
              </div>

              {/* Services details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-sm">Servicio Intermediario</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    Protegemos las transferencias entre comprador y vendedor. Cobramos solo <strong>$2.70 USD (S/ 10.00 PEN)</strong> para verificar datos antes del pago.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold">
                    <Gem className="h-5 w-5" />
                    <span className="text-sm">Recargas Directas por ID</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    Si necesitas ayuda enviando la captura de tu boleta para diamantes instantáneos, contáctanos directo al número <strong>+51 906328464</strong>.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ACTIVE DASHBOARDS DISPATCHER */}
        {activeView === 'dashboard_user' && <UserDashboard />}
        {activeView === 'dashboard_seller' && <SellerDashboard />}
        {activeView === 'dashboard_admin' && <AdminDashboard />}
        {activeView === 'login' && <Login />}

      </main>

      {/* --- FLOATING OVERLAY MODAL FOR CART CHECKOUT & MULTI-SELLER MESSAGING --- */}
      {isCartOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative bg-[#0d131f] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-5 sm:p-6 text-left space-y-5 shadow-[0_0_50px_rgba(0,210,255,0.2)] max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                    {cartSubmittedOrder ? '✅ Solicitud de Pedido Registrada' : '🛒 Carrito y Verificación de Compra'}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    {cartSubmittedOrder ? `ID de Pedido: ${cartSubmittedOrder.id}` : 'Revisa tus productos y solicita la boleta oficial al vendedor'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCartOverlayOpen(false);
                  setCartSubmittedOrder(null);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* IF NO ORDER YET: Show Cart items and Form */}
            {!cartSubmittedOrder ? (
              <div className="space-y-5">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-xs">
                    <ShoppingCart className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold">Tu carrito está vacío.</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-black/50 p-3 rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img src={item.product.images[0]} alt="" className="h-10 w-10 object-cover rounded-lg border border-white/10" />
                            ) : (
                              <div className="h-10 w-10 bg-cyan-950/60 rounded-lg flex items-center justify-center border border-cyan-500/30 text-cyan-400">
                                <Gem className="h-5 w-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white text-xs">{item.product.title}</p>
                              <span className="text-[10px] text-cyan-400 font-medium block">
                                Vendedor: {item.product.sellerName || 'FF Market Oficial'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-mono font-black text-cyan-300 text-sm">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">
                          🎮 ID de Jugador (Free Fire) *
                        </label>
                        <input
                          type="text"
                          value={playerId}
                          onChange={(e) => setPlayerId(e.target.value)}
                          placeholder="Ej. 99382103"
                          className="w-full bg-[#111111] border border-cyan-500/40 text-cyan-300 font-mono font-bold rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                          📱 WhatsApp Comprador *
                        </label>
                        <div className="flex space-x-1.5">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="bg-[#111111] border border-emerald-500/40 text-emerald-300 font-bold rounded-lg px-2 py-2 text-xs focus:outline-none"
                          >
                            <option value="+51">🇵🇪 +51</option>
                            <option value="+57">🇨🇴 +57</option>
                            <option value="+52">🇲🇽 +52</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+54">🇦🇷 +54</option>
                            <option value="+56">🇨🇱 +56</option>
                            <option value="+593">🇪🇨 +593</option>
                          </select>
                          <input
                            type="text"
                            value={buyerPhoneInput}
                            onChange={(e) => setBuyerPhoneInput(e.target.value)}
                            placeholder="906328464"
                            className="flex-1 bg-[#111111] border border-emerald-500/40 text-white font-bold rounded-lg px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Método de Pago Preferido:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['Yape / Plin', 'Tarjeta', 'PayPal'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method as any)}
                            className={`py-2 px-2 rounded-lg font-bold text-[10px] uppercase border transition-all ${
                              paymentMethod === method
                                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,210,255,0.2)]'
                                : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total & Submit */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Total a Pagar:</span>
                        <span className="text-xl font-black text-cyan-300 font-mono">
                          ${cart.reduce((a, b) => a + (b.product.price * b.quantity), 0).toFixed(2)} USD
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const fullPhone = `${countryCode} ${buyerPhoneInput}`.trim();
                          const res = checkout(paymentMethod, fullPhone, playerId);
                          if (res.success && res.order) {
                            setCartSubmittedOrder(res.order);
                          }
                        }}
                        className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center space-x-2"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Generar Solicitud de Pedido</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* IF ORDER SUBMITTED: Multi-Seller WhatsApp Messaging & Information */
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                  <p className="font-black text-sm flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span>¡Solicitud de Pedido Registrada con Éxito!</span>
                  </p>
                  <p className="text-[11px] text-gray-300">
                    Tu orden <strong>{cartSubmittedOrder.id}</strong> ha sido enviada al sistema. Para completar tu pago y recibir la <strong>Boleta Oficial de Garantía emitida por el vendedor</strong>, envía un mensaje por WhatsApp a cada vendedor listado abajo:
                  </p>
                </div>

                {/* Group items by seller */}
                {(() => {
                  const groupedBySeller: Record<string, OrderItem[]> = {};
                  cartSubmittedOrder.items.forEach((item) => {
                    const sid = item.sellerId || 's_megastore';
                    if (!groupedBySeller[sid]) groupedBySeller[sid] = [];
                    groupedBySeller[sid].push(item);
                  });

                  return (
                    <div className="space-y-4">
                      {Object.entries(groupedBySeller).map(([sellerId, items]) => {
                        const sellerMeta = simulatedDiamondSellers.find(s => s.id === sellerId) || {
                          id: sellerId,
                          name: items[0]?.sellerName || 'Vendedor Oficial',
                          avatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80',
                          phone: '+51 906328464'
                        };
                        const sellerSubtotal = items.reduce((a, b) => a + (b.price * b.quantity), 0);
                        const cleanSellerPhone = "51906328464";

                        const itemsListFormatted = items.map(it => `  • *${it.productTitle}* (x${it.quantity}) -> $${(it.price * it.quantity).toFixed(2)} USD`).join('\n');
                        const rawText = 
                          `Hola *${sellerMeta.name}*, he realizado una solicitud de pedido en *FF Market Pro*:\n\n` +
                          `📌 *ID Orden:* ${cartSubmittedOrder.id}\n` +
                          `👤 *Cliente:* ${userProfile.username}\n` +
                          `🎮 *ID Free Fire:* ${cartSubmittedOrder.playerId || 'No especificado'}\n` +
                          `📱 *WhatsApp:* ${cartSubmittedOrder.userPhone}\n` +
                          `💳 *Método de Pago:* ${cartSubmittedOrder.paymentMethod}\n\n` +
                          `📦 *PRODUCTOS SOLICITADOS EN TU TIENDA:*\n${itemsListFormatted}\n\n` +
                          `💰 *Total a pagar a ti:* $${sellerSubtotal.toFixed(2)} USD\n\n` +
                          `🔗 *Enlace para que el vendedor verifique y genere la Boleta Oficial:*\n` +
                          `${window.location.origin}/#dashboard_seller?orderId=${cartSubmittedOrder.id}&sellerId=${sellerId}`;

                        const waUrl = `https://api.whatsapp.com/send?phone=${cleanSellerPhone}&text=${encodeURIComponent(rawText)}`;

                        return (
                          <div key={sellerId} className="p-4 rounded-xl bg-black/60 border border-cyan-500/30 text-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <div className="flex items-center space-x-2">
                                <img src={sellerMeta.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-cyan-400" />
                                <span className="font-black text-white text-xs">{sellerMeta.name}</span>
                              </div>
                              <span className="font-mono font-bold text-cyan-300 text-sm">${sellerSubtotal.toFixed(2)} USD</span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] text-gray-400 uppercase font-bold block">Productos para este vendedor:</span>
                              {items.map(it => (
                                <p key={it.id} className="text-gray-200 text-[11px]">
                                  • {it.productTitle} (x{it.quantity})
                                </p>
                              ))}
                            </div>

                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                            >
                              <Phone className="h-4 w-4" />
                              <span>Enviar Pedido a {sellerMeta.name} por WhatsApp</span>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsCartOverlayOpen(false);
                      setCartSubmittedOrder(null);
                      setActiveView('dashboard_user');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase"
                  >
                    📋 Ver Mis Compras
                  </button>

                  <button
                    onClick={() => {
                      setIsCartOverlayOpen(false);
                      setCartSubmittedOrder(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs uppercase hover:bg-cyan-500/30"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- REVIEWS SUBMISSION ACCORDION INNER PRODUCT DETAIL --- */}
      {selectedProductId && selectedProduct && (
        <div 
          onClick={() => setActiveView('marketplace', null, null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111111] border border-white/10 rounded-xl max-w-lg w-full p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl glow-blue cursor-default"
          >
            <div className="flex justify-between items-start border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase text-neon-blue">Detalles de Anuncio</span>
              <button onClick={() => setActiveView('marketplace', null, null)} className="text-gray-400 hover:text-white font-bold">✕ Cerrar</button>
            </div>
            
            {selectedProduct.images && selectedProduct.images.length > 0 ? (
              <img src={selectedProduct.images[0]} alt="" className="w-full h-44 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-44 bg-gradient-to-br from-[#0a192f] to-[#001122] rounded-lg flex flex-col items-center justify-center p-4 border border-[#00d2ff]/20">
                <Gem className="h-12 w-12 text-neon-blue animate-pulse mb-1.5 text-glow-blue" />
                <span className="text-xs font-black tracking-widest text-neon-blue uppercase text-glow-blue">OFERTA DE DIAMANTES</span>
                <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold text-center">Recarga instantánea con tu ID</span>
              </div>
            )}
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">{selectedProduct.title}</h3>
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-gray-400">
                  Vendedor: <button 
                    onClick={() => {
                      setActiveView('public_seller', selectedProduct.sellerId);
                    }}
                    className="text-cyan-400 hover:text-neon-blue font-bold underline transition-colors"
                  >
                    {selectedProduct.sellerName}
                  </button>
                </p>
                <button
                  onClick={() => {
                    setActiveView('public_seller', selectedProduct.sellerId);
                  }}
                  className="bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2.5 py-1 rounded flex items-center space-x-1 transition-all"
                >
                  <User className="h-3 w-3" />
                  <span>Ver Perfil de Vendedor</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-300 leading-relaxed space-y-3 border-t border-b border-white/5 py-3">
              <p><strong>Descripción:</strong> {selectedProduct.description}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/2 p-2.5 rounded">
                <p>🌍 Servidor: <strong>{selectedProduct.server}</strong></p>
                {selectedProduct.level && <p>🛡️ Nivel Cuenta: <strong>{selectedProduct.level}</strong></p>}
                <p>🛒 Stock: <strong>{selectedProduct.stock} unidades</strong></p>
                <p>💰 Precio Neto: <strong className="text-neon-blue">${selectedProduct.price} USD</strong></p>
              </div>

              {/* ACTION BUTTONS: DIRECT BOLETA GENERATION & ADD TO CART */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setActiveView('marketplace', null, null);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <ShoppingCart className="h-4 w-4 text-cyan-400" />
                  <span>Añadir al Carrito</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setActiveView('marketplace', null, null);
                    // Trigger immediate checkout
                    setTimeout(() => {
                      handleCheckoutSubmit();
                    }, 200);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  <Phone className="h-4 w-4 fill-black" />
                  <span>Comprar & Generar Boleta</span>
                </button>
              </div>
            </div>

            {/* Leave a review block */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Dejar Opinión al Vendedor</h4>
              
              {reviewSuccess && (
                <p className="text-emerald-400 text-xs font-bold bg-emerald-400/5 p-2 rounded border border-emerald-400/25">{reviewSuccess}</p>
              )}

              <form onSubmit={(e) => handleReviewSubmit(e, selectedProduct.sellerId)} className="space-y-2.5 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="text-gray-400">Puntaje estrellas:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)}
                      className={`text-sm ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Excelente entrega súper rápida..."
                  className="w-full bg-[#181818] border border-white/10 rounded p-2 text-xs text-white focus:border-neon-blue focus:outline-none h-16 resize-none"
                  required
                />
                <button type="submit" className="bg-neon-purple text-white hover:bg-neon-blue hover:text-black font-bold uppercase py-1.5 px-4 rounded text-[10px]">
                  Enviar Calificación
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP BOTTOM PROMINENT BANNER SECTION */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-16 animate-fade-in">
        <div className="bg-gradient-to-r from-emerald-950/40 via-[#111111]/90 to-teal-950/40 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Grupo de WhatsApp Oficial
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              ¡Únete a la Comunidad de FF MARKET PRO!
            </h3>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              Mantente al tanto de todas las actualizaciones en tiempo real, recibe asistencia al instante de nuestros administradores, obtén hacks gratuitos y participa de sorteos semanales en nuestro grupo oficial de WhatsApp.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <a 
              href="https://chat.whatsapp.com/J9jVHYPdtzeL5hCzh9pCAU" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-950/50 uppercase tracking-wider"
            >
              <MessageSquare className="h-4 w-4 fill-white text-white animate-pulse" />
              <span>Unirse al Grupo Oficial</span>
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#080808] py-8 text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="font-black text-white tracking-wider text-sm flex items-center justify-center md:justify-start gap-1">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>FF MARKET PRO</span>
            </span>
            <p className="mt-1">© 2026 FF MARKET PRO. Todos los derechos reservados. No oficial, sin vínculos a Garena Corporation.</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => setActiveView('faq')} className="hover:text-white transition-colors">Centro de Ayuda</button>
            <button onClick={() => setActiveView('contact')} className="hover:text-white transition-colors">Contacto Comercial</button>
            <button onClick={() => setActiveView('news')} className="hover:text-white transition-colors">Blog y Novedades</button>
          </div>
        </div>
      </footer>



      {/* COMMUNITY REPORT MODAL */}
      {reportModalOpen && selectedSeller && (
        <div 
          onClick={() => setReportModalOpen(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111111] border border-white/10 rounded-xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl glow-blue cursor-default animate-scale-up"
          >
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                  Sistema de Reportes
                </span>
                <h3 className="text-sm font-black text-white uppercase mt-1">
                  Reportar Vendedor: {selectedSeller.username}
                </h3>
              </div>
              <button 
                onClick={() => setReportModalOpen(false)} 
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {reportSuccessMsg ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-lg text-xs space-y-1">
                <p className="font-bold">¡Reporte Enviado!</p>
                <p>{reportSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Motivo del Reporte</label>
                  <select
                    value={reportReasonType}
                    onChange={(e) => setReportReasonType(e.target.value as any)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none text-xs"
                  >
                    <option value="scam">Fraude o Estafa de Cuenta</option>
                    <option value="spam">Spam / Publicaciones Repetitivas</option>
                    <option value="fake_account">Perfil o Datos Falsos</option>
                    <option value="offensive_content">Contenido Ofensivo / Mal Comportamiento</option>
                    <option value="other">Otro Motivo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Detalles del Reporte</label>
                  <textarea
                    value={reportReasonText}
                    onChange={(e) => setReportReasonText(e.target.value)}
                    placeholder="Describe detalladamente lo sucedido con este vendedor para que los administradores tomen medidas..."
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-white focus:border-red-500 focus:outline-none h-24 resize-none text-xs"
                    required
                  />
                </div>

                <div className="bg-red-500/5 border border-red-500/10 rounded p-3 text-red-400 text-[10px] leading-relaxed">
                  ⚠️ El abuso del sistema de reportes falsos resultará en la suspensión permanente de tu cuenta. Todo reporte es auditado de manera automática.
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-300 font-bold uppercase transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-950/50"
                  >
                    Enviar Reporte
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* BOLETA DIGITAL MODAL */}
      <BoletaModal order={activeBoletaOrder} onClose={() => setActiveBoletaOrder(null)} />

      {/* CART NOTIFICATION FLOATING TOAST */}
      <CartToast />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
