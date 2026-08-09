/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppContext, POINT_COSTS } from '../store';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { ALL_PAYMENT_METHODS, DEFAULT_SELLER_PAYMENT_METHODS } from '../data/paymentMethods';
import {
  TrendingUp,
  Gem,
  PlusCircle,
  Clock,
  Coins,
  Sparkles,
  ShoppingBag,
  Star,
  DollarSign,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Layers,
  Server,
  ArrowUpRight,
  Heart,
  User,
  Check,
  Edit2,
  Info,
  SlidersHorizontal,
  Globe,
  Share2,
  Eye,
  FileText,
  Printer,
  Copy,
  Receipt,
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';
import { InteractiveChart } from './InteractiveChart';
import { ProfileAvatar } from './ProfileAvatar';
import { motion } from 'motion/react';
import { Product, Order } from '../types';
import { BoletaModal } from './BoletaModal';

const SELLER_FRAMES_LIST = [
  { id: 'none', label: 'Sin Marco', description: 'Borde básico' },
  { id: 'cyan', label: 'Neon Cyan ⚡', description: 'Fuerza Azul - Brillante' },
  { id: 'heroic', label: 'Heroico 🔥', description: 'Fuego Rojo - Rango FF' },
  { id: 'sakura', label: 'Sakura 🌸', description: 'Púrpura - Edición Especial' },
  { id: 'gold', label: 'Dorado Master 🏆', description: 'Oro de Garena - Campeón' },
  { id: 'evolutive', label: 'Evolutivo Cosmic ⭐', description: 'Arcoíris - Efecto Giro' }
];

export const SellerDashboard: React.FC = () => {
  const {
    currentRole,
    sellerProfile,
    purchasePoints,
    products,
    orders,
    issueBoleta,
    sellerAddProduct,
    sellerRenewProduct,
    sellerHighlightProduct,
    sellerTopFeature,
    sellerPremiumPromo,
    reviewsList,
    adminUpdateSeller,
    updateProduct,
    setActiveView
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'stats' | 'listings' | 'pedidos' | 'boletas' | 'perfil'>('stats');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeBoletaOrder, setActiveBoletaOrder] = useState<Order | null>(null);

  // Digital Sales Receipt (Boleta) Generator State
  const [boletaClientName, setBoletaClientName] = useState('');
  const [boletaClientId, setBoletaClientId] = useState('');
  const [boletaClientPhone, setBoletaClientPhone] = useState('');

  // Multi-item Boleta state
  interface BoletaItem {
    id: string;
    title: string;
    quantity: number;
    price: number;
  }

  const [boletaItems, setBoletaItems] = useState<BoletaItem[]>([
    { id: '1', title: '1060 Diamantes ID + Bono +106', quantity: 1, price: 10.91 }
  ]);
  const [customItemTitle, setCustomItemTitle] = useState('');
  const [customItemQty, setCustomItemQty] = useState(1);
  const [customItemPrice, setCustomItemPrice] = useState(0);

  const [boletaCurrency, setBoletaCurrency] = useState<'USD' | 'PEN'>('USD');
  const [boletaPaymentMethod, setBoletaPaymentMethod] = useState('Yape / Plin (Perú)');
  const [boletaNotes, setBoletaNotes] = useState('¡Gracias por tu compra! Tu recarga ha sido acreditada exitosamente en tu ID de Free Fire.');
  const [boletaNumber, setBoletaNumber] = useState(() => 'FFMP-BOL-' + Math.floor(100000 + Math.random() * 900000));
  const [boletaDate, setBoletaDate] = useState(() => new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }));
  const [boletaCopied, setBoletaCopied] = useState(false);

  const handleAddBoletaItem = (title: string, price: number, quantity: number = 1) => {
    if (!title.trim()) return;
    setBoletaItems(prev => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        title: title.trim(),
        quantity: Math.max(1, quantity),
        price: Math.max(0, price)
      }
    ]);
  };

  const handleUpdateBoletaItem = (id: string, field: 'title' | 'quantity' | 'price', value: any) => {
    setBoletaItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleRemoveBoletaItem = (id: string) => {
    setBoletaItems(prev => prev.filter(item => item.id !== id));
  };

  const boletaTotal = boletaItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const handlePrintBoleta = () => {
    const printContent = document.getElementById('printable-boleta-ticket');
    if (!printContent) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Boleta_Venta_${boletaNumber}_FFMarketPro</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
              body {
                font-family: 'Outfit', sans-serif;
                background-color: #0b0f19 !important;
                color: #ffffff !important;
                padding: 24px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .text-neon-purple { color: #a855f7; }
              .text-neon-blue { color: #00d2ff; }
              @media print {
                body { padding: 0; margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body class="bg-[#0b0f19] text-white">
            <div class="max-w-2xl mx-auto">
              ${printContent.innerHTML}
            </div>
            <div class="no-print mt-6 text-center">
              <button onclick="window.print();" style="background:#a855f7; color:white; font-weight:800; padding:12px 28px; border-radius:12px; border:none; cursor:pointer; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 15px rgba(168,85,247,0.4);">
                🖨️ CONFIRMAR IMPRESIÓN / GUARDAR PDF
              </button>
            </div>
            <script>
              setTimeout(() => {
                window.print();
              }, 600);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  useEffect(() => {
    const handleHashCheck = () => {
      if (window.location.hash === '#buy-seller-credits' || window.location.hash === '#credits') {
        setActiveTab('perfil');
        setTimeout(() => {
          const el = document.getElementById('buy-seller-credits-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  // Add listing state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(10.00);
  const [prodType, setProdType] = useState<'cuenta' | 'diamante' | 'recarga' | 'oferta' | 'hack'>('cuenta');
  const [hackCategory, setHackCategory] = useState<'Panel' | 'Texturas' | 'Aimbot' | 'Script' | 'Bypass'>('Panel');
  const [diamondQty, setDiamondQty] = useState<number>(100);
  const [server, setServer] = useState<'Sudamérica' | 'EEUU' | 'Europa' | 'Asia'>('Sudamérica');
  const [level, setLevel] = useState<number>(60);
  const [stock, setStock] = useState<number>(1);
  const [tagsInput, setTagsInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [publishSuccess, setPublishSuccess] = useState('');
  const [publishError, setPublishError] = useState('');

  // Diamond pricing sub-tab states and actions
  const [listingsSubTab, setListingsSubTab] = useState<'diamonds' | 'standard'>('diamonds');
  const [priceValues, setPriceValues] = useState<{ [qty: number]: number }>({});
  const [stockValues, setStockValues] = useState<{ [qty: number]: number }>({});
  const [serverValues, setServerValues] = useState<{ [qty: number]: 'Sudamérica' | 'EEUU' | 'Europa' | 'Asia' }>({});
  const [diamondActionSuccess, setDiamondActionSuccess] = useState<string>('');
  const [diamondActionError, setDiamondActionError] = useState<string>('');

  const DIAMOND_PACKAGES_DATA = [
    {
      quantity: 100,
      bonus: "Bono +10",
      defaultPrice: 1.08,
      imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/100-diamantes.png",
    },
    {
      quantity: 310,
      bonus: "Bono +31",
      defaultPrice: 3.26,
      imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/310-diamantes.png",
    },
    {
      quantity: 520,
      bonus: "Bono +52",
      defaultPrice: 5.08,
      imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/520-diamantes.png",
    },
    {
      quantity: 1060,
      bonus: "Bono +106",
      defaultPrice: 10.91,
      imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/1060-diamantes.png",
    },
    {
      quantity: 2180,
      bonus: "Bono +218",
      defaultPrice: 21.09,
      imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/2180-diamantes.png",
    },
    {
      quantity: 5600,
      bonus: "Bono +560",
      defaultPrice: 50.22,
      imageUrl: "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/diamantes/5600-diamantes.png",
    }
  ];

  const getDiamondPriceForSeller = (quantity: number, sellerId: string) => {
    const foundProd = products.find(p => p.sellerId === sellerId && p.type === 'diamante' && p.quantity === quantity && p.status === 'active');
    if (foundProd) return foundProd.price;
    const foundPkg = DIAMOND_PACKAGES_DATA.find(p => p.quantity === quantity);
    return foundPkg ? foundPkg.defaultPrice : 1.00;
  };

  // Prefill values from active products when component mounts or products change
  useEffect(() => {
    const prices: { [qty: number]: number } = {};
    const stocks: { [qty: number]: number } = {};
    const servers: { [qty: number]: 'Sudamérica' | 'EEUU' | 'Europa' | 'Asia' } = {};

    DIAMOND_PACKAGES_DATA.forEach(pkg => {
      const p = products.find(prod => 
        prod.sellerId === sellerProfile.id && 
        prod.type === 'diamante' && 
        prod.quantity === pkg.quantity && 
        prod.status === 'active'
      );
      if (p) {
        prices[pkg.quantity] = p.price;
        stocks[pkg.quantity] = p.stock;
        servers[pkg.quantity] = p.server;
      }
    });

    setPriceValues(prev => ({ ...prices, ...prev }));
    setStockValues(prev => ({ ...stocks, ...prev }));
    setServerValues(prev => ({ ...servers, ...prev }));
  }, [products, sellerProfile.id]);

  const handleSaveDiamondPackage = (qty: number, pkgDefaultPrice: number, pkgImageUrl: string) => {
    setDiamondActionError('');
    setDiamondActionSuccess('');

    const targetPrice = priceValues[qty] !== undefined ? priceValues[qty] : pkgDefaultPrice;
    const targetStock = stockValues[qty] !== undefined ? stockValues[qty] : 999;
    const targetServer = serverValues[qty] || 'Sudamérica';

    if (Number(targetPrice) <= 0) {
      setDiamondActionError('El precio debe ser mayor a 0.');
      return;
    }

    // Find if product already exists
    const existing = products.find(
      prod => prod.sellerId === sellerProfile.id && prod.type === 'diamante' && prod.quantity === qty && prod.status === 'active'
    );

    if (existing) {
      // Free update
      updateProduct(existing.id, {
        price: Number(targetPrice),
        stock: Number(targetStock),
        server: targetServer
      });
      setDiamondActionSuccess(`¡Paquete de ${qty} Diamantes actualizado con éxito!`);
      setTimeout(() => setDiamondActionSuccess(''), 3000);
    } else {
      // Create new: costs 15 Cr
      const cost = POINT_COSTS.publish_diamonds;
      if (sellerProfile.points < cost) {
        setDiamondActionError(`Saldo de puntos insuficiente. Publicar este paquete requiere ${cost} Cr, y tienes ${sellerProfile.points} Cr.`);
        return;
      }

      const res = sellerAddProduct({
        title: `Recarga ${qty} Diamantes - ${sellerProfile.username}`,
        description: `Recarga directa de ${qty} diamantes por ID de jugador de Free Fire. Rápida, 100% segura y garantizada por ${sellerProfile.username}.`,
        price: Number(targetPrice),
        type: 'diamante',
        quantity: qty,
        stock: Number(targetStock),
        server: targetServer,
        images: [pkgImageUrl],
        category: 'Recarga ID',
        tags: ['Diamantes', 'ID', 'PagoStore'],
        features: [`${qty} Diamantes`, 'Solo ID', 'Entrega Instantánea']
      });

      if (res.success) {
        setDiamondActionSuccess(`¡Paquete de ${qty} Diamantes publicado con éxito! (-15 Cr)`);
        setTimeout(() => setDiamondActionSuccess(''), 4000);
      } else {
        setDiamondActionError(res.message);
      }
    }
  };

  const handlePauseDiamondPackage = (qty: number) => {
    setDiamondActionError('');
    setDiamondActionSuccess('');

    const existing = products.find(
      prod => prod.sellerId === sellerProfile.id && prod.type === 'diamante' && prod.quantity === qty && prod.status === 'active'
    );

    if (existing) {
      updateProduct(existing.id, {
        status: 'inactive'
      });
      setDiamondActionSuccess(`¡Paquete de ${qty} Diamantes pausado y ocultado del catálogo!`);
      setTimeout(() => setDiamondActionSuccess(''), 3000);
    }
  };

  // Sync title and description for diamond packages
  useEffect(() => {
    if (prodType === 'diamante') {
      setTitle(`Paquete de ${diamondQty.toLocaleString()} Diamantes Free Fire`);
      setDescription(`Recarga oficial por ID de jugador de ${diamondQty.toLocaleString()} diamantes. Acreditados directamente a tu ID de forma 100% segura y libre de reembolsos.`);
      setFeaturesInput(`${diamondQty.toLocaleString()} Diamantes, Recarga por ID, Entrega en 5 Minutos`);
      // Default price recommendation based on package
      if (diamondQty === 100) setPrice(1.08);
      else if (diamondQty === 310) setPrice(3.26);
      else if (diamondQty === 520) setPrice(5.08);
      else if (diamondQty === 1060) setPrice(10.91);
      else if (diamondQty === 2180) setPrice(21.09);
      else if (diamondQty === 5600) setPrice(50.22);
    }
  }, [prodType, diamondQty]);

  // Seller profile edit states
  const [sellerName, setSellerName] = useState(sellerProfile.username);
  const [sellerAvatar, setSellerAvatar] = useState(sellerProfile.avatar);
  const [sellerBanner, setSellerBanner] = useState(sellerProfile.banner);
  const [sellerFrame, setSellerFrame] = useState(sellerProfile.frame || 'none');
  const [sellerDesc, setSellerDesc] = useState(sellerProfile.description);
  const [sellerPhone, setSellerPhone] = useState(sellerProfile.phone || '');
  const [sellerPaymentMethods, setSellerPaymentMethods] = useState<string[]>(
    sellerProfile.acceptedPaymentMethods || DEFAULT_SELLER_PAYMENT_METHODS
  );
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    setSellerName(sellerProfile.username);
    setSellerAvatar(sellerProfile.avatar);
    setSellerBanner(sellerProfile.banner);
    setSellerFrame(sellerProfile.frame || 'none');
    setSellerDesc(sellerProfile.description);
    setSellerPhone(sellerProfile.phone || '');
    setSellerPaymentMethods(sellerProfile.acceptedPaymentMethods || DEFAULT_SELLER_PAYMENT_METHODS);
  }, [sellerProfile.id, sellerProfile.username, sellerProfile.avatar, sellerProfile.banner, sellerProfile.frame, sellerProfile.description, sellerProfile.phone, sellerProfile.acceptedPaymentMethods]);

  const togglePaymentMethod = (methodId: string) => {
    setSellerPaymentMethods(prev => 
      prev.includes(methodId)
        ? prev.filter(m => m !== methodId)
        : [...prev, methodId]
    );
  };

  const handleUpdateSellerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateSeller(sellerProfile.id, {
      username: sellerName,
      avatar: sellerAvatar,
      banner: sellerBanner,
      frame: sellerFrame,
      description: sellerDesc,
      phone: sellerPhone,
      acceptedPaymentMethods: sellerPaymentMethods
    });
    setProfileSuccess('¡Perfil de vendedor y métodos de pago actualizados con éxito!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  // Product edit states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editServer, setEditServer] = useState<'Sudamérica' | 'EEUU' | 'Europa' | 'Asia'>('Sudamérica');
  const [editLevel, setEditLevel] = useState(1);
  const [editDiamondQty, setEditDiamondQty] = useState(100);
  const [editTags, setEditTags] = useState('');
  const [editFeatures, setEditFeatures] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  const startEditingProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditTitle(p.title || '');
    setEditDescription(p.description || '');
    setEditPrice(p.price || 0);
    setEditStock(p.stock || 0);
    setEditServer(p.server || 'Sudamérica');
    setEditLevel(p.level || 1);
    setEditDiamondQty(p.quantity || 100);
    setEditTags((p.tags || []).join(', '));
    setEditFeatures((p.features || []).join(', '));
    setEditImageUrl(p.images?.[0] || '');
    setEditVideoUrl(p.videoUrl || '');
  };

  const saveEditedProduct = () => {
    if (!editTitle.trim()) {
      alert("El título es requerido.");
      return;
    }
    const tags = editTags.split(',').map(t => t.trim()).filter(Boolean);
    const features = editFeatures.split(',').map(f => f.trim()).filter(Boolean);
    const images = editImageUrl.trim() ? [editImageUrl.trim()] : ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"];

    updateProduct(editingProductId!, {
      title: editTitle,
      description: editDescription,
      price: Number(editPrice),
      stock: Number(editStock),
      server: editServer,
      level: Number(editLevel),
      quantity: Number(editDiamondQty),
      tags,
      features,
      images,
      videoUrl: editVideoUrl.trim() || undefined,
    });
    setEditingProductId(null);
  };

  // Filtering products to only show this seller's products
  const sellerProducts = products.filter(p => p.sellerId === sellerProfile.id);
  const sellerReviews = reviewsList.filter(r => r.sellerId === sellerProfile.id);

  const calculateCost = () => {
    let base = 20;
    if (prodType === 'diamante') base = 15;
    if (prodType === 'recarga') base = 15;
    if (prodType === 'oferta') base = 25;
    if (prodType === 'hack') base = 30;

    let extra = 0;
    if (videoUrl.trim()) extra += 30;
    if (tagsInput.trim()) extra += 3;
    if (imageUrl.trim()) extra += 0; // First is free, extras cost 5

    return base + extra;
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishError('');
    setPublishSuccess('');

    let tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    if (prodType === 'hack' && hackCategory) {
      if (!tags.includes(hackCategory)) tags.unshift(hackCategory);
      if (!tags.includes('Antiban')) tags.push('Antiban');
    }
    const features = featuresInput.split(',').map(f => f.trim()).filter(Boolean);
    const images = imageUrl.trim() ? [imageUrl.trim()] : ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"];

    const res = sellerAddProduct({
      title,
      description,
      price: Number(price),
      type: prodType,
      server,
      level: prodType === 'cuenta' ? Number(level) : undefined,
      quantity: prodType === 'diamante' ? Number(diamondQty) : undefined,
      stock: Number(stock),
      tags,
      features,
      images,
      videoUrl: videoUrl.trim() || undefined,
      category: prodType === 'cuenta' ? 'Veterana' : prodType === 'diamante' ? 'Recarga ID' : prodType === 'recarga' ? 'Membresía' : prodType === 'hack' ? (hackCategory || 'Panel') : 'Oferta'
    });

    if (res.success) {
      setPublishSuccess(res.message);
      // Reset form
      setTitle('');
      setDescription('');
      setPrice(10);
      setTagsInput('');
      setFeaturesInput('');
      setImageUrl('');
      setVideoUrl('');
      setTimeout(() => setPublishSuccess(''), 4000);
    } else {
      setPublishError(res.message);
    }
  };

  const pointPackages = [
    { id: "pp1", points: 100, price: 3.99, desc: "Básico", isPopular: false },
    { id: "pp2", points: 250, price: 9.99, desc: "Avanzado", isPopular: true },
    { id: "pp3", points: 500, price: 18.99, desc: "Profesional", isPopular: false, bonus: 50 },
    { id: "pp4", points: 1000, price: 34.99, desc: "Distribuidor", isPopular: false, bonus: 120 },
    { id: "pp5", points: 2500, price: 79.99, desc: "Mayorista", isPopular: false, bonus: 400 },
    { id: "pp6", points: 5000, price: 149.99, desc: "Leyenda", isPopular: false, bonus: 1000 },
    { id: "pp7", points: 10000, price: 279.99, desc: "Socio Oro", isPopular: false, bonus: 2500 }
  ];

  return (
    <div id="seller_panel" className="space-y-6">
      
      {/* Header Seller Status */}
      <div className="glass-panel-purple rounded-xl p-5 border border-neon-purple/20 bg-[#111111]/90 flex flex-col md:flex-row items-center justify-between gap-5 animate-neon-pulse">
        <div className="flex items-center space-x-4">
          <ProfileAvatar 
            url={sellerProfile.avatar} 
            frame={sellerProfile.frame || 'none'} 
            size="xl"
          />
          <div className="text-left space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-white">{sellerProfile.username}</h2>
              <span className="bg-neon-purple/20 text-neon-purple text-[9px] font-black uppercase px-2 py-0.5 rounded border border-neon-purple/30">
                Nivel Vendedor {sellerProfile.sellerLevel}
              </span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-1 max-w-md">{sellerProfile.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sellerProfile.medals.map((medal, idx) => (
                <span key={idx} className="bg-white/5 text-gray-400 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border border-white/5">
                  🛡️ {medal}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Balance Credit stats */}
        <div className="flex space-x-4">
          <div 
            onClick={() => {
              setActiveTab('perfil');
              setTimeout(() => {
                const el = document.getElementById('buy-seller-credits-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            className="bg-[#181224] border border-neon-purple/40 hover:border-neon-purple rounded-lg px-4 py-2.5 text-center cursor-pointer transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)]"
            title="Haz clic para comprar más Créditos de Vendedor"
          >
            <span className="text-[9px] font-bold text-neon-purple uppercase tracking-widest block">Créditos de Anuncios (Cr)</span>
            <div className="flex items-center justify-center space-x-1 mt-1 text-neon-purple">
              <Gem className="h-5 w-5 text-neon-purple animate-pulse" />
              <span className="text-lg font-black">{sellerProfile.points} Cr</span>
            </div>
          </div>

          <div className="bg-black/60 border border-white/5 rounded-lg px-4 py-2.5 text-center">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Reputación General</span>
            <span className="text-lg font-black text-emerald-400 block mt-1">{sellerProfile.reputation}% Positivo</span>
          </div>
        </div>
      </div>

      {/* SHAREABLE MINI-WEB PROPIA CARD */}
      <div className="glass-panel rounded-2xl p-4 border border-neon-purple/30 bg-gradient-to-r from-[#181224] via-[#111111] to-[#0c1a30] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(168,85,247,0.15)] text-left">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple flex-shrink-0">
            <Globe className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Tu Mini-Web Personal Compartible</h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/30">Sin Distracciones</span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl">
              Comparte tu enlace exclusivo con tus clientes. Al abrirlo, verán <strong>únicamente tu tienda, tus productos y tus datos</strong> sin pestañas de navegación hacia otros vendedores. Tendrán además la opción de ir al Mercado Principal si lo desean.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2.5 w-full sm:w-auto flex-shrink-0">
          <button
            onClick={() => {
              const link = `${window.location.origin}/?seller=${sellerProfile.id}&mode=storefront`;
              navigator.clipboard.writeText(link);
              alert(`¡Enlace directo a tu Mini-Web personal copiado!\n\n🌐 ${link}\n\nTus clientes verán únicamente tu catálogo oficial sin distracciones de la competencia.`);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all border border-neon-purple/50"
          >
            <Share2 className="h-4 w-4" />
            <span>Copiar Mi Enlace</span>
          </button>

          <button
            onClick={() => {
              setActiveView('seller_storefront', sellerProfile.id);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-white/20 transition-all"
            title="Ver exactamente cómo verán tus clientes tu Mini-Web"
          >
            <Eye className="h-4 w-4 text-neon-blue" />
            <span>Ver Mi Mini-Web</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border border-white/5 bg-[#111111] p-1.5 rounded-lg overflow-x-auto space-x-1.5 scrollbar-none">
        {[
          { id: 'stats', label: 'Estadísticas y Opiniones', icon: TrendingUp },
          { id: 'listings', label: 'Mis Productos (' + sellerProducts.length + ')', icon: Layers },
          { id: 'pedidos', label: '📥 Solicitudes y Boletas (' + orders.filter(o => o.items.some(it => it.sellerId === sellerProfile.id || (!it.sellerId && sellerProfile.id === 's_official'))).length + ')', icon: ShoppingBag },
          { id: 'boletas', label: '🧾 Generador Manual', icon: FileText },
          { id: 'perfil', label: 'Mi Perfil y Créditos', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all rounded-md flex-shrink-0 border ${
                isSel 
                  ? 'text-neon-purple bg-neon-purple/10 border-neon-purple/30 shadow-[0_0_8px_rgba(157,80,187,0.15)]' 
                  : 'text-gray-400 hover:text-white bg-[#181818]/40 border-transparent hover:bg-white/5'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: METRICS AND STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Bento stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Ventas Completadas</span>
                <p className="text-xl font-black text-white">{sellerProfile.salesCount}</p>
              </div>
              <div className="h-10 w-10 bg-neon-purple/15 text-neon-purple rounded-lg flex items-center justify-center border border-neon-purple/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Ganancias Totales Est.</span>
                <p className="text-xl font-black text-white">$1,894.20 USD</p>
              </div>
              <div className="h-10 w-10 bg-emerald-500/15 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Me Gusta Recibidos</span>
                <p className="text-xl font-black text-white">+{sellerProfile.likesCount}</p>
              </div>
              <div className="h-10 w-10 bg-neon-blue/15 text-neon-blue rounded-lg flex items-center justify-center border border-neon-blue/20">
                <Star className="h-5 w-5 fill-current" />
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Reportes en mi Contra</span>
                <p className="text-xl font-black text-red-400">{sellerProfile.reportsCount}</p>
              </div>
              <div className="h-10 w-10 bg-red-500/15 text-red-500 rounded-lg flex items-center justify-center border border-red-500/20">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Line charts panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <InteractiveChart title="Ingresos de Ventas Semanales ($)" data={[120, 310, 420, 290, 560, 480, 894]} labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']} type="revenue" />
            <InteractiveChart title="Visitas a mis Publicaciones" data={[320, 580, 450, 670, 920, 1100, 1420]} labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']} type="users" />
          </div>

          {/* Points rules directory */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111]">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3">Tarifario de Acciones en el Portal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded bg-white/2 border border-white/5">
                <p className="text-gray-400 font-medium">Publicar Cuenta</p>
                <span className="text-neon-purple font-black block mt-0.5">{POINT_COSTS.publish_account} Cr</span>
              </div>
              <div className="p-2.5 rounded bg-white/2 border border-white/5">
                <p className="text-gray-400 font-medium">Renovar Publicación</p>
                <span className="text-neon-purple font-black block mt-0.5">{POINT_COSTS.renew_listing} Cr</span>
              </div>
              <div className="p-2.5 rounded bg-white/2 border border-white/5">
                <p className="text-gray-400 font-medium">Subir al Inicio</p>
                <span className="text-neon-purple font-black block mt-0.5">{POINT_COSTS.top_feature} Cr</span>
              </div>
              <div className="p-2.5 rounded bg-white/2 border border-white/5">
                <p className="text-gray-400 font-medium">Destacar Anuncio</p>
                <span className="text-neon-purple font-black block mt-0.5">{POINT_COSTS.highlight} Cr</span>
              </div>
            </div>
          </div>

          {/* Historial de Calificaciones */}
          <div className="space-y-4">
            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                Historial de Calificaciones ({sellerReviews.length})
              </h3>
              <p className="text-xs text-gray-400 mt-1">Comentarios reales de usuarios que adquirieron tus recargas o cuentas de Free Fire.</p>
            </div>

            {sellerReviews.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 border border-white/5 bg-[#111111] text-center text-gray-500 text-xs">
                No has recibido opiniones de compradores todavía en este navegador. Las calificaciones de tus transacciones aparecerán aquí.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sellerReviews.map((r) => (
                  <div key={r.id} className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] space-y-2 text-xs text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={r.avatar} alt="" className="h-6 w-6 rounded-full object-cover border border-white/10" />
                        <span className="font-bold text-white">{r.username}</span>
                      </div>
                      <div className="flex items-center text-yellow-400 space-x-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 italic">"{r.comment}"</p>
                    <p className="text-[9px] text-gray-500 text-right">Calificado hace poco</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: MANAGE LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4 animate-fade-in text-left">
          
          {/* Sub-tabs to split standard listings from direct diamond pricing */}
          <div className="flex border-b border-white/10 pb-1.5 mb-2 space-x-6">
            <button
              onClick={() => setListingsSubTab('diamonds')}
              className={`pb-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center space-x-1.5 focus:outline-none ${
                listingsSubTab === 'diamonds'
                  ? 'text-cyan-400 border-cyan-400 shadow-[0_3px_10px_rgba(6,182,212,0.15)]'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Gem className="h-4 w-4 text-cyan-400" />
              <span>💎 Tarifas de Diamantes (Estilo PagoStore)</span>
            </button>
            <button
              onClick={() => setListingsSubTab('standard')}
              className={`pb-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center space-x-1.5 focus:outline-none ${
                listingsSubTab === 'standard'
                  ? 'text-neon-purple border-neon-purple shadow-[0_3px_10px_rgba(157,80,187,0.15)]'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4 text-neon-purple" />
              <span>📦 Cuentas y Otros ({sellerProducts.filter(p => p.type !== 'diamante').length})</span>
            </button>
          </div>

          {/* SUB-VIEW 1: DIRECT DIAMOND PRICING EDITOR (PAGOSTORE STYLE) */}
          {listingsSubTab === 'diamonds' && (
            <div className="space-y-4 animate-fade-in">
              <div className="glass-panel rounded-xl p-4 border border-cyan-500/20 bg-[#09172c] space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span className="font-extrabold uppercase tracking-wider font-sans">Editor de Precios Directo</span>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  Este panel reproduce la interfaz exacta de <strong className="text-cyan-400 font-extrabold">PagoStore</strong> que ven tus clientes. 
                  Edita tus precios en dólares, ajusta el stock o cambia el servidor de entrega al instante. No necesitas modificar imágenes ni descripciones.
                </p>
                <div className="text-[10px] text-cyan-300/80 font-mono bg-[#061122] p-2 rounded border border-cyan-500/10 flex flex-wrap gap-x-4 gap-y-1">
                  <span>• Editar precios o stock: <strong className="text-emerald-400">Totalmente Gratis</strong></span>
                  <span>• Activar un nuevo paquete por primera vez: <strong className="text-cyan-400">15 Créditos (Deducido de tu saldo)</strong></span>
                </div>
              </div>

              {diamondActionSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{diamondActionSuccess}</span>
                </div>
              )}
              {diamondActionError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{diamondActionError}</span>
                </div>
              )}

              <div className="w-full overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-cyan-500/30">
                <div className="grid grid-cols-6 gap-2.5 min-w-[800px] lg:min-w-0 mx-auto">
                {DIAMOND_PACKAGES_DATA.map((pkg) => {
                  const existingProduct = sellerProducts.find(
                    p => p.type === 'diamante' && p.quantity === pkg.quantity && p.status === 'active'
                  );
                  
                  const currentPrice = priceValues[pkg.quantity] !== undefined 
                    ? priceValues[pkg.quantity] 
                    : (existingProduct?.price ?? pkg.defaultPrice);
                    
                  const currentStock = stockValues[pkg.quantity] !== undefined 
                    ? stockValues[pkg.quantity] 
                    : (existingProduct?.stock ?? 999);
                    
                  const currentServer = serverValues[pkg.quantity] || existingProduct?.server || 'Sudamérica';

                  const isPriceModified = existingProduct && existingProduct.price !== Number(currentPrice);
                  const isStockModified = existingProduct && existingProduct.stock !== Number(currentStock);
                  const isServerModified = existingProduct && existingProduct.server !== currentServer;
                  const hasPendingChanges = isPriceModified || isStockModified || isServerModified;

                  return (
                    <div
                      key={pkg.quantity}
                      className={`relative rounded-xl overflow-hidden transition-all duration-300 p-2.5 flex flex-col justify-between border ${
                        existingProduct 
                          ? 'border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.12)] bg-[#0c1e36]' 
                          : 'border-white/10 bg-[#071120]/95 opacity-90 hover:opacity-100 shadow-sm'
                      }`}
                    >
                      {/* Top corner indicator of status */}
                      <div className="absolute top-2 right-2 z-10">
                        {existingProduct ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center space-x-1 shadow-sm font-mono">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping mr-0.5" />
                            Activo
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center shadow-sm font-mono">
                            Inactivo
                          </span>
                        )}
                      </div>

                      {/* Image frame from User view */}
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#050c18] border border-cyan-500/10 flex-shrink-0">
                        <img 
                          src={pkg.imageUrl} 
                          alt={`${pkg.quantity} Diamantes`}
                          className="w-full h-full object-cover select-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 left-1.5">
                          <span className="bg-[#ff0055] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm border border-white/10">
                            {pkg.bonus}
                          </span>
                        </div>
                      </div>

                      {/* Text Details */}
                      <div className="pt-2 px-0.5 text-left space-y-0.5">
                        <span className="text-[7px] font-black text-cyan-400 uppercase tracking-widest block font-sans">Canal Directo ID</span>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight font-sans">{pkg.quantity} Diamantes</h4>
                        {existingProduct && (
                          <p className="text-[8px] text-gray-400 font-mono">
                            Vistas: <strong className="text-cyan-300">{existingProduct.views || 0}</strong> | Likes: <strong className="text-cyan-300">+{existingProduct.likes || 0}</strong>
                          </p>
                        )}
                      </div>

                      {/* Fields edit area */}
                      <div className="mt-2 space-y-2 pt-2 border-t border-white/5">
                        {/* Price input styled as a shiny tag */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center px-0.5">
                            <label className="text-[8px] font-black text-cyan-400/90 uppercase tracking-wider font-sans">Precio ($ USD)</label>
                            {existingProduct && (
                              <span className="text-[7px] font-mono text-gray-500">Sugerido: ${pkg.defaultPrice}</span>
                            )}
                          </div>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-400 font-extrabold text-[10px]">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={currentPrice}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPriceValues(prev => ({ ...prev, [pkg.quantity]: val === '' ? '' : Number(val) }));
                              }}
                              className="w-full bg-[#050b14] border border-cyan-500/25 focus:border-cyan-400 rounded-lg pl-5 pr-8 py-1 font-mono text-xs font-black text-white focus:outline-none focus:shadow-[0_0_8px_rgba(6,182,212,0.15)] transition-all text-left"
                              placeholder="Ej. 1.05"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-500 uppercase font-mono">USD</span>
                          </div>
                        </div>

                        {/* Stock & Server Grid */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="space-y-0.5">
                            <label className="text-[7px] font-black text-gray-400 uppercase tracking-wider block px-0.5 font-sans">Stock</label>
                            <input
                              type="number"
                              value={currentStock}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStockValues(prev => ({ ...prev, [pkg.quantity]: val === '' ? '' : Number(val) }));
                              }}
                              className="w-full bg-[#050b14] border border-white/10 focus:border-cyan-400 rounded-md px-2 py-1 font-mono text-[11px] font-bold text-white focus:outline-none"
                              placeholder="999"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[7px] font-black text-gray-400 uppercase tracking-wider block px-0.5 font-sans">Servidor</label>
                            <select
                              value={currentServer}
                              onChange={(e) => {
                                setServerValues(prev => ({ ...prev, [pkg.quantity]: e.target.value as any }));
                              }}
                              className="w-full bg-[#050b14] border border-white/10 focus:border-cyan-400 rounded-md px-1 py-1 font-mono text-[9px] text-white focus:outline-none"
                            >
                              <option value="Cualquier Región">Todas</option>
                              <option value="Sudamérica">SUD</option>
                              <option value="EEUU">EEUU</option>
                              <option value="Europa">EU</option>
                              <option value="Asia">Asia</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Actions container */}
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex gap-1">
                        {existingProduct ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSaveDiamondPackage(pkg.quantity, pkg.defaultPrice, pkg.imageUrl)}
                              className={`flex-1 py-1.5 rounded-md font-bold uppercase tracking-wider text-[8px] transition-all flex items-center justify-center space-x-1 ${
                                hasPendingChanges
                                  ? 'bg-cyan-400 text-black font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:scale-[1.02]'
                                  : 'bg-[#121c2c] text-gray-400 border border-white/5 hover:text-white'
                              }`}
                            >
                              <Check className="h-2.5 w-2.5" />
                              <span>{hasPendingChanges ? 'Guardar' : '✓ Guardado'}</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handlePauseDiamondPackage(pkg.quantity)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-wider transition-all"
                              title="Pausar y ocultar del catálogo"
                            >
                              Pausar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSaveDiamondPackage(pkg.quantity, pkg.defaultPrice, pkg.imageUrl)}
                            className="w-full bg-cyan-500/10 hover:bg-cyan-400 border border-cyan-500/30 hover:border-transparent text-cyan-400 hover:text-black py-1.5 rounded-md font-extrabold uppercase tracking-widest text-[8px] transition-all flex items-center justify-center space-x-1 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                          >
                            <PlusCircle className="h-3 w-3" />
                            <span>Activar (-15 Cr)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: STANDARD PRODUCTS */}
          {listingsSubTab === 'standard' && (
            <div className="space-y-4 animate-fade-in w-full">
              
              <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tus Anuncios en Catálogo</h3>
              <p className="text-xs text-gray-400 mt-1">Sube nuevos anuncios de Free Fire o potencia los existentes usando tus créditos de vendedor.</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1 ${
                showAddForm 
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                  : 'btn-neon-purple shadow-[0_0_10px_rgba(157,80,187,0.2)]'
              }`}
            >
              <PlusCircle className="h-4 w-4 mr-1 inline" />
              <span>{showAddForm ? 'Cerrar Formulario' : '➕ Publicar Nuevo Anuncio'}</span>
            </button>
          </div>

          {/* Collapsible Publish New Form */}
          {showAddForm && (
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-5 animate-fade-in">
              <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center">
                    <PlusCircle className="h-5 w-5 text-neon-purple mr-2" />
                    Crear y Publicar Anuncio
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Sube cuentas veteranas, diamantes directos o combos promocionales de Free Fire.</p>
                </div>
                
                {/* Cost Preview */}
                <div className="bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-lg px-3 py-1 text-xs font-bold text-center">
                  Costo estimado: {calculateCost()} Cr
                </div>
              </div>

              {publishSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded p-3 text-xs flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{publishSuccess}</span>
                </div>
              )}

              {publishError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded p-3 text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{publishError}</span>
                </div>
              )}

              <form onSubmit={handlePublish} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Título del Anuncio</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Cuenta Sakura Nivel 75 + Evolutivas Máximo"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Precio (USD $)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Tipo de Producto</label>
                  <select 
                    value={prodType}
                    onChange={(e) => setProdType(e.target.value as any)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                  >
                    <option value="cuenta">Cuentas</option>
                    <option value="diamante">Diamantes</option>
                    <option value="recarga">Evolutivas</option>
                    <option value="oferta">Ofertas</option>
                    <option value="hack">Hacks, Texturas & Paneles VIP</option>
                  </select>
                </div>

                {prodType === 'hack' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-emerald-400 uppercase">Subcategoría (Texturas, Paneles, Regedit)</label>
                    <select
                      value={hackCategory}
                      onChange={(e) => setHackCategory(e.target.value as any)}
                      className="w-full bg-[#181818] border border-emerald-500/40 rounded px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none font-bold"
                    >
                      <option value="Panel">🎯 Paneles VIP & Mod Menu (AimBot / Headshot)</option>
                      <option value="Texturas">🎨 Pack de Texturas VIP (Skins, Armas & Sacos)</option>
                      <option value="Aimbot">💥 Aimbot & Regedit Pro (Todo Rojo)</option>
                      <option value="Script">⚡ Scripts LUA & Antena Cabeza</option>
                      <option value="Bypass">🛡️ Bypass Antiban & Protección 100%</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Servidor Oficial</label>
                  <select 
                    value={server}
                    onChange={(e) => setServer(e.target.value as any)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                  >
                    <option value="Cualquier Región">Cualquier Región (Global)</option>
                    <option value="Sudamérica">Sudamérica</option>
                    <option value="EEUU">EEUU / Norteamérica</option>
                    <option value="Europa">Europa</option>
                    <option value="Asia">Asia</option>
                  </select>
                </div>

                {prodType === 'cuenta' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Nivel de la Cuenta Free Fire</label>
                    <input 
                      type="number" 
                      value={level}
                      onChange={(e) => setLevel(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                    />
                  </div>
                )}

                {prodType === 'diamante' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#b967ff] uppercase">Paquete de Diamantes (PagoStore)</label>
                    <select
                      value={diamondQty}
                      onChange={(e) => setDiamondQty(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-neon-purple/30 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none font-bold"
                    >
                      <option value={100}>💎 100 Diamantes</option>
                      <option value={310}>💎 310 Diamantes</option>
                      <option value={520}>💎 520 Diamantes</option>
                      <option value={1060}>💎 1,060 Diamantes</option>
                      <option value={2180}>💎 2,180 Diamantes</option>
                      <option value={5600}>💎 5,600 Diamantes</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Stock Inicial</label>
                  <input 
                    type="number" 
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                    required
                  />
                </div>

                {prodType === 'hack' && (
                  <div className="md:col-span-2 bg-[#141d1a] border border-emerald-500/30 rounded-xl p-3 space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                      ⚡ Plantillas Rápidas de Auto-Rellenado para Vendedores:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setHackCategory('Panel');
                          setTitle('Panel VIP Mod Menu - AimBot Todo Rojo & Auto Headshot');
                          setDescription('Panel flotante VIP para Android y PC. Incluye AimBot 100% calibrado, tiro fantasma, menú interactivo y bypass antiban antibot integrado para proteger tu cuenta.');
                          setPrice(14.99);
                          setTagsInput('Panel VIP, AimBot, Todo Rojo, Antiban, Mod Menu');
                          setFeaturesInput('AimBot 100% Automático, Menu Flotable Activable, Bypass Antiban Seguro, Actualización Continua');
                          setImageUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition-all"
                      >
                        🎯 Usar Plantilla Panel VIP
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setHackCategory('Texturas');
                          setTitle('Pack de Texturas VIP - Armas Evolutivas y Skins Raras (Sacura & Criminal)');
                          setDescription('Consigue el aspecto visual de un veterano. Modifica tus armas y ropa en pantalla de forma 100% segura. Incluye AK Dragón Evolutiva, M1887, Pase Sakura, Hip Hop y chaquetas veteranas.');
                          setPrice(7.99);
                          setTagsInput('Texturas, Skins, Armas Evolutivas, Sakura, Criminal, Antiban');
                          setFeaturesInput('Armas Evolutivas al Máximo, Skins Raras Veteranas, 100% Seguro Sin Ban, Instalador Automático 1-Clic');
                          setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold border border-purple-500/30 transition-all"
                      >
                        🎨 Usar Plantilla Texturas VIP
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setHackCategory('Script');
                          setTitle('Script LUA Antena Cabeza & Localizador VIP Antiban');
                          setDescription('Localiza fácilmente a tus enemigos con la antena neón visible a gran distancia. Muestra distancia y vida del enemigo a través de obstáculos. Método bypass optimizado.');
                          setPrice(9.99);
                          setTagsInput('Script, Antena Cabeza, Wallhack, Regedit, Antiban');
                          setFeaturesInput('Antena Neón Ultra Visible, Antiban Activado, Muestra Distancia y Vida, Compatible con Emulador y Móvil');
                          setImageUrl('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 transition-all"
                      >
                        ⚡ Usar Plantilla Script & Regedit
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Descripción Detallada</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalla qué skins posee, pases élite, aspectos evolutivos, diamantes que quedan en saldo, etc..."
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none h-20 resize-none"
                    required
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">URL de Imagen Principal (Aspecto o Banner)</label>
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Sube tu imagen a imgur o pega una URL para previsualizar"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Etiquetas Clave (Separar por comas)</label>
                  <input 
                    type="text" 
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Sakura, Criminal, Evolutivas, EEUU"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Enlace de video de demostración (YouTube/TikTok)</label>
                  <input 
                    type="url" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Añadir video cuesta +30 puntos"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 pt-2 text-right">
                  <button 
                    type="submit"
                    className="btn-neon-purple px-6 py-2.5 rounded text-xs"
                  >
                    Publicar Ahora (Deducir Créditos)
                  </button>
                </div>
              </form>
            </div>
          )}

          {sellerProducts.length === 0 ? (
            <div className="glass-panel rounded-xl p-8 border border-white/5 bg-[#111111] text-center text-gray-500 text-xs">
              No tienes publicaciones subidas todavía. Crea una en la pestaña de 'Publicar'.
            </div>
          ) : (
            <div className="space-y-3">
              {sellerProducts.map((p) => {
                const isEditing = editingProductId === p.id;
                
                if (isEditing) {
                  return (
                    <div key={p.id} className="glass-panel rounded-xl p-5 border border-neon-purple/50 bg-[#120f18] space-y-4 text-left text-xs animate-fade-in">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="font-extrabold text-neon-purple uppercase tracking-widest text-sm flex items-center">
                          <Sparkles className="h-4 w-4 mr-1.5 animate-pulse text-neon-purple" />
                          Modo de Edición de Publicación
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">ID: {p.id}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Título de la Publicación</label>
                          <input 
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Precio ($ USD)</label>
                          <input 
                            type="number" 
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Stock Disponible</label>
                          <input 
                            type="number" 
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Servidor Free Fire</label>
                          <select 
                            value={editServer}
                            onChange={(e) => setEditServer(e.target.value as any)}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                          >
                            <option value="Cualquier Región">Cualquier Región (Global)</option>
                            <option value="Sudamérica">Sudamérica</option>
                            <option value="EEUU">EEUU</option>
                            <option value="Europa">Europa</option>
                            <option value="Asia">Asia</option>
                          </select>
                        </div>

                        {p.type === 'cuenta' && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Nivel de la Cuenta</label>
                            <input 
                              type="number" 
                              value={editLevel}
                              onChange={(e) => setEditLevel(Number(e.target.value))}
                              className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            />
                          </div>
                        )}

                        {p.type === 'diamante' && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Cantidad de Diamantes</label>
                            <input 
                              type="number" 
                              value={editDiamondQty}
                              onChange={(e) => setEditDiamondQty(Number(e.target.value))}
                              className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            />
                          </div>
                        )}

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción de la Oferta</label>
                          <textarea 
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none resize-none"
                            placeholder="Especifica los detalles de tu venta..."
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">URL de Imagen Principal</label>
                          <input 
                            type="url" 
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            placeholder="https://..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">URL de Video (Opcional)</label>
                          <input 
                            type="url" 
                            value={editVideoUrl}
                            onChange={(e) => setEditVideoUrl(e.target.value)}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            placeholder="https://..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Etiquetas (Separadas por comas)</label>
                          <input 
                            type="text" 
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            placeholder="Pase Sakura, Veterana, Barato"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Características Clave (Separadas por comas)</label>
                          <input 
                            type="text" 
                            value={editFeatures}
                            onChange={(e) => setEditFeatures(e.target.value)}
                            className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                            placeholder="Entrega inmediata, 100% seguro"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-3 border-t border-white/5">
                        <button 
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="bg-[#181818] border border-white/10 hover:bg-white/5 text-gray-300 font-bold px-4 py-2 rounded text-xs transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="button"
                          onClick={saveEditedProduct}
                          className="btn-neon-purple font-bold px-5 py-2 rounded text-xs"
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={p.id} className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-3 text-left">
                      <img src={p.images[0]} alt="" className="h-12 w-12 rounded object-cover border border-white/10 flex-shrink-0" />
                      <div className="space-y-1 text-left min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="font-bold text-white text-sm truncate max-w-[220px]">{p.title}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                            p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 flex items-center">
                          <Server className="h-3 w-3 text-neon-blue mr-1" />
                          Servidor: {p.server} | Rango Precio: <strong className="text-neon-purple ml-1">${p.price.toFixed(2)}</strong>
                        </p>
                        <div className="flex items-center space-x-2 text-[9px] text-gray-500">
                          <span>Vistas: <strong>{p.views}</strong></span>
                          <span>Likes: <strong>{p.likes}</strong></span>
                          {p.isFeatured && <span className="text-yellow-500 font-bold">★ Destacado</span>}
                        </div>
                      </div>
                    </div>

                    {/* Points action panel for listings */}
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      <button 
                        onClick={() => startEditingProduct(p)}
                        className="bg-neon-purple/20 border border-neon-purple/40 hover:bg-neon-purple hover:text-white text-[10px] font-bold text-neon-purple px-2.5 py-1.5 rounded flex items-center transition-all"
                        title="Editar todos los campos de esta publicación"
                      >
                        Editar
                      </button>

                      <button 
                        onClick={() => {
                          const done = sellerRenewProduct(p.id);
                          if (!done) alert("Créditos insuficientes para renovar.");
                        }}
                        className="bg-[#181818] border border-white/5 hover:border-neon-purple/40 text-[10px] font-bold text-gray-300 hover:text-white px-2.5 py-1.5 rounded flex items-center space-x-1"
                        title="Renueva duración 15 días extra por 10 puntos"
                      >
                        <span>Renovar</span>
                        <span className="text-neon-purple font-black">(10 Cr)</span>
                      </button>

                      <button 
                        onClick={() => {
                          const done = sellerHighlightProduct(p.id);
                          if (!done) alert("Créditos insuficientes para destacar.");
                        }}
                        className="bg-[#181818] border border-white/5 hover:border-yellow-400/40 text-[10px] font-bold text-gray-300 hover:text-white px-2.5 py-1.5 rounded flex items-center space-x-1"
                        title="Destacar anuncio con etiqueta dorada por 100 puntos"
                      >
                        <span>Destacar</span>
                        <span className="text-yellow-400 font-black">(100 Cr)</span>
                      </button>

                      <button 
                        onClick={() => {
                          const done = sellerTopFeature(p.id);
                          if (!done) alert("Créditos insuficientes para subir al inicio.");
                        }}
                        className="bg-[#181818] border border-white/5 hover:border-neon-blue/40 text-[10px] font-bold text-gray-300 hover:text-white px-2.5 py-1.5 rounded flex items-center space-x-1"
                        title="Sube este anuncio a la cabecera por 50 puntos"
                      >
                        <span>Subir Inicio</span>
                        <span className="text-neon-blue font-black">(50 Cr)</span>
                      </button>

                      <button 
                        onClick={() => {
                          const done = sellerPremiumPromo(p.id);
                          if (!done) alert("Créditos insuficientes para promoción premium.");
                        }}
                        className="bg-[#241324] border border-neon-purple/20 hover:border-neon-purple text-[10px] font-bold text-neon-purple hover:text-white px-2.5 py-1.5 rounded flex items-center space-x-1"
                        title="Aplica promoción VIP premium por 200 puntos"
                      >
                        <span>Premium</span>
                        <span className="font-black text-neon-purple">(200 Cr)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

            </div>
          )}

        </div>
      )}

      {/* TAB 3: EDIT SELLER PROFILE & CREDITS */}
      {activeTab === 'perfil' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Editar Perfil Info */}
            <div className="lg:col-span-2 glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-6">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center">
                  <User className="h-5 w-5 text-neon-purple mr-2" />
                  Detalles de mi Perfil de Vendedor
                </h3>
                <p className="text-xs text-gray-400 mt-1">Configura tu alias comercial, el logo de tu tienda, descripción y contacto.</p>
              </div>

              {/* Security block - Removed restrictions to allow editing */}
              <div className="bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 rounded-lg p-3.5 text-xs flex items-start space-x-2.5">
                <Sparkles className="h-4 w-4 mt-0.5 text-neon-purple flex-shrink-0 animate-pulse" />
                <div>
                  <strong className="block font-bold">¡Personalización de Perfil Activa!</strong>
                  <span className="text-[11px] text-gray-300">Como Vendedor verificado, puedes modificar libremente tu alias de tienda, tu número de contacto/WhatsApp, logo/avatar, banner superior y equipar marcos de rango de forma instantánea.</span>
                </div>
              </div>

              {profileSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg p-3 text-xs flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateSellerProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Nombre de Vendedor (Comercial)</label>
                  <input 
                    type="text" 
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Enlace URL del Logo / Avatar de Tienda</label>
                  <input 
                    type="url" 
                    value={sellerAvatar}
                    onChange={(e) => setSellerAvatar(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Enlace URL del Banner de Perfil</label>
                  <input 
                    type="url" 
                    value={sellerBanner}
                    onChange={(e) => setSellerBanner(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://images.unsplash.com/photo-1542751371-adc38448a05e o similar"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1">💡 Sugerencia: Inserta una URL de imagen para personalizar la cabecera superior de tu perfil de vendedor público.</p>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Número de WhatsApp / Teléfono de Contacto</label>
                  <input 
                    type="text" 
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#25d366] focus:outline-none font-medium"
                    placeholder="Ejemplo: +5491123456789 (Usar formato con código de país sin espacios ni símbolos)"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">🟢 Permite que los clientes vean tu número y te contacten directamente por WhatsApp con un solo clic.</p>
                </div>

                {/* SELECCIONAR MARCO DE VENDEDOR */}
                <div className="md:col-span-2 space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[11px] font-bold text-[#b967ff] uppercase tracking-widest block">
                        Equipar Marco de Rango
                      </label>
                      <p className="text-[9px] text-gray-400">Escoge un aura cosmética exclusiva para destacar tu avatar en tus ofertas</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-[#09090d]/90 p-3 rounded-xl border border-white/5 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
                    {SELLER_FRAMES_LIST.map((f) => {
                      const isSelected = sellerFrame === f.id;
                      let themeBg = "bg-white/2 hover:bg-white/5 border-white/5";
                      let labelColor = "text-gray-400";
                      
                      if (isSelected) {
                        if (f.id === 'cyan') {
                          themeBg = "border-[#00d2ff] bg-[#00d2ff]/10 shadow-[0_0_15px_rgba(0,210,255,0.35)]";
                          labelColor = "text-[#00d2ff]";
                        } else if (f.id === 'heroic') {
                          themeBg = "border-[#ff003c] bg-[#ff003c]/10 shadow-[0_0_15px_rgba(255,0,60,0.35)]";
                          labelColor = "text-[#ff003c]";
                        } else if (f.id === 'sakura') {
                          themeBg = "border-[#e100ff] bg-[#e100ff]/10 shadow-[0_0_15px_rgba(225,0,255,0.35)]";
                          labelColor = "text-[#e100ff]";
                        } else if (f.id === 'gold') {
                          themeBg = "border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.35)]";
                          labelColor = "text-yellow-500";
                        } else if (f.id === 'evolutive') {
                          themeBg = "border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(0,210,255,0.4)]";
                          labelColor = "text-cyan-400";
                        } else {
                          themeBg = "border-white/30 bg-white/5";
                          labelColor = "text-white";
                        }
                      }

                      const isLocked = false;

                      return (
                        <div
                          key={f.id}
                          onClick={() => !isLocked && setSellerFrame(f.id)}
                          className={`relative p-2 rounded-lg border text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[90px] ${
                            isLocked 
                              ? 'opacity-65 cursor-not-allowed border-white/5 bg-black/40' 
                              : `cursor-pointer ${themeBg}`
                          }`}
                          title={isLocked ? "Marcos bloqueados para el Rango Vendedor" : f.description}
                        >
                          <ProfileAvatar url={sellerAvatar} frame={f.id} size="sm" className="mb-1.5" />
                          <span className={`text-[9px] font-black tracking-tight ${labelColor}`}>{f.label}</span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-neon-purple text-white rounded-full p-0.5 shadow-[0_0_6px_rgba(157,80,187,0.8)] flex items-center justify-center z-10">
                              <Check className="h-2 w-2 stroke-[4]" />
                            </div>
                          )}
                          {isLocked && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-lg pointer-events-none">
                              {/* subtle small indicator */}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SELECCIONAR MÉTODOS DE PAGO ACEPTADOS */}
                <div className="md:col-span-2 space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
                      Métodos de Pago Aceptados en mi Mini-Web
                    </label>
                    <p className="text-[10px] text-gray-400">Selecciona los medios de pago internacionales y locales que aceptas para mostrarlos con logo oficial en tu perfil y Mini-Web</p>
                  </div>

                  <div className="flex flex-wrap gap-2 bg-[#09090d]/90 p-3.5 rounded-xl border border-white/5">
                    {ALL_PAYMENT_METHODS.map((pm) => {
                      const isSelected = sellerPaymentMethods.includes(pm.id);
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => togglePaymentMethod(pm.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 ${
                            isSelected
                              ? `${pm.badgeBg} ${pm.borderColor} ${pm.textColor} shadow-md ring-2 ring-emerald-400/40 scale-105`
                              : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-gray-300 opacity-60'
                          }`}
                        >
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                            {isSelected ? 'ACTIVO' : '+ MÉT'}
                          </span>
                          <PaymentMethodBadge methodId={pm.id} size="sm" showFullName />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Descripción de Vendedor</label>
                  <textarea 
                    value={sellerDesc}
                    onChange={(e) => setSellerDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Cuéntale a tus compradores qué tipos de recargas o cuentas vendes, tus horarios de entrega, etc..."
                    required
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded text-xs w-full sm:w-auto font-black uppercase tracking-wider transition-all duration-300 btn-neon-purple"
                  >
                    Guardar Perfil de Vendedor
                  </button>
                </div>
              </form>
            </div>

            {/* Right Col: Resumen de Créditos Rápido & Live Preview */}
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs font-black text-[#b967ff] uppercase tracking-widest flex items-center">
                    <Sparkles className="h-4.5 w-4.5 mr-1.5 animate-pulse text-neon-purple" />
                    Vista Previa de tu Perfil
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Así verán los compradores tu marca en la plataforma</p>
                </div>

                {/* Profile Live Card Box */}
                <div className="relative rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-lg p-4 space-y-3 min-h-[120px] flex flex-col justify-center">
                  <img src={sellerBanner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                  
                  <div className="relative flex items-center space-x-3">
                    <ProfileAvatar url={sellerAvatar} frame={sellerFrame} size="md" />
                    <div className="text-left min-w-0">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider truncate">{sellerName || 'Nombre comercial'}</h4>
                      <p className="text-[9px] text-gray-400 line-clamp-2 max-w-[150px]">{sellerDesc || 'Sin descripción'}</p>
                    </div>
                  </div>
                  <div className="relative flex justify-between items-center text-[9px] bg-black/40 p-1.5 rounded border border-white/5">
                    <span className="text-gray-400 font-bold">Nivel Vendedor:</span>
                    <span className="text-neon-purple font-black">Nivel {sellerProfile.sellerLevel}</span>
                  </div>
                </div>

                <div className="border-b border-white/5 pb-3 pt-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                    <Gem className="h-4 w-4 text-neon-purple mr-2" />
                    Tus Créditos (Cr)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Saldo disponible para publicar, renovar y destacar tus ofertas.</p>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-lg px-4 py-4 text-center mt-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Créditos Disponibles</span>
                  <div className="flex items-center justify-center space-x-1.5 mt-1 text-neon-purple">
                    <Gem className="h-6 w-6 text-neon-purple" />
                    <span className="text-2xl font-black">{sellerProfile.points} Cr</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 bg-white/2 border border-white/5 rounded-lg p-3 space-y-2">
                <p className="font-bold text-white uppercase text-[9px] tracking-wider text-neon-purple">¿Cómo usarlos?</p>
                <p>Usa tus créditos para publicar ofertas o expandir su visibilidad con herramientas premium de impulso.</p>
              </div>
            </div>

          </div>

          {/* Credits Packages (recargas de crédito) right below */}
          <div id="buy-seller-credits-section" className="glass-panel rounded-xl p-5 border border-neon-purple/40 bg-[#111111] space-y-5 shadow-[0_0_25px_rgba(168,85,247,0.15)] scroll-mt-24">
            <div className="border-b border-neon-purple/20 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center text-neon-purple">
                  <Gem className="h-5 w-5 text-neon-purple mr-2 animate-pulse" />
                  Comprar Créditos de Vendedor (Cr)
                </h3>
                <p className="text-xs text-gray-300 mt-1">Recarga tu cuenta de vendedor de manera segura e instantánea para potenciar tu catálogo.</p>
              </div>
              <span className="text-[10px] bg-neon-purple/20 text-neon-purple px-2.5 py-1 rounded-full border border-neon-purple/30 font-bold self-start sm:self-auto">
                Saldo Actual: {sellerProfile.points} Cr
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pointPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`glass-panel rounded-xl p-4 border text-center flex flex-col justify-between transition-all ${
                    pkg.isPopular 
                      ? 'border-neon-purple shadow-lg shadow-neon-purple/5 bg-[#181224]' 
                      : 'border-white/5 bg-[#111111] hover:border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    {pkg.isPopular && (
                      <span className="bg-neon-purple text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block">Mas Vendido</span>
                    )}
                    <h4 className="text-xs text-gray-400 font-bold uppercase">{pkg.desc}</h4>
                    <div className="flex items-center justify-center space-x-1.5 py-3">
                      <Gem className="h-6 w-6 text-neon-purple" />
                      <span className="text-2xl font-black text-white">{pkg.points} Cr</span>
                    </div>
                    {pkg.bonus && (
                      <p className="text-[10px] text-emerald-400 font-bold bg-emerald-400/5 py-0.5 rounded border border-emerald-400/15 inline-block px-1.5">+{pkg.bonus} Créditos de Bono</p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5">
                    <span className="text-lg font-black text-white block mb-3">${pkg.price.toFixed(2)} USD</span>
                    <button 
                      onClick={() => purchasePoints(pkg.id)}
                      className="w-full py-2 rounded text-xs font-bold uppercase tracking-wider btn-neon-purple"
                    >
                      Recargar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB: SOLICITUDES DE COMPRA Y EMISIÓN DE BOLETAS */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-[#0d131f] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex-shrink-0">
                <ShoppingBag className="h-7 w-7 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <span>Solicitudes de Pedidos Recibidos</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/30">
                    Solo Vendedor Autorizado
                  </span>
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                  Aquí recibes los pedidos enviados por los compradores. Verifica la recepción de su pago y presiona <strong>"Emitir Boleta Oficial"</strong> para generar el comprobante legal y activar su entrega.
                </p>
              </div>
            </div>
          </div>

          {/* List of relevant orders for this seller */}
          {(() => {
            const sellerOrders = orders.filter(o => 
              o.items.some(it => it.sellerId === sellerProfile.id || (!it.sellerId && sellerProfile.id === 's_official'))
            );

            if (sellerOrders.length === 0) {
              return (
                <div className="py-12 text-center text-gray-500 text-xs bg-white/2 rounded-2xl border border-white/5">
                  <ShoppingBag className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-400">Aún no has recibido solicitudes de pedidos directos.</p>
                  <p className="text-[10px] text-gray-500 mt-1">Los compradores que adquieran tus productos en el marketplace aparecerán aquí.</p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {sellerOrders.map((order) => {
                  const sellerItems = order.items.filter(it => it.sellerId === sellerProfile.id || (!it.sellerId && sellerProfile.id === 's_official'));
                  const sellerSubtotal = sellerItems.reduce((a, b) => a + (b.price * b.quantity), 0);
                  const isCompleted = order.status === 'completed' || Boolean(order.boletaNumber);

                  return (
                    <div key={order.id} className="border border-cyan-500/20 rounded-xl bg-[#090d16] p-5 text-xs space-y-4 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
                        <div>
                          <span className="font-mono text-cyan-400 font-bold text-sm block">ORDEN ID: {order.id}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{new Date(order.createdAt).toLocaleString('es-PE')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isCompleted ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Boleta Emitida ({order.boletaNumber})</span>
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 animate-pulse">
                              <Clock className="h-3.5 w-3.5 text-amber-400" />
                              <span>Pendiente de Boleta (Pago)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/5 p-3 rounded-lg border border-white/5 text-[11px]">
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Cliente:</span>
                          <strong className="text-white text-xs">{order.userName}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">🎮 ID Free Fire:</span>
                          <strong className="text-cyan-300 font-mono">{order.playerId || 'No especificado'}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">📱 WhatsApp Cliente:</span>
                          <a 
                            href={`https://api.whatsapp.com/send?phone=${(order.userPhone || '').replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 font-mono font-bold hover:underline"
                          >
                            {order.userPhone || 'No especificado'}
                          </a>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Productos Solicitados a tu Tienda:</span>
                        {sellerItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-black/40 p-2.5 rounded border border-white/5">
                            <div>
                              <p className="font-bold text-white text-xs">{item.productTitle}</p>
                              <p className="text-[10px] text-gray-400 uppercase">Categoría: {item.productType} | Cantidad: {item.quantity}</p>
                            </div>
                            <span className="font-bold text-cyan-400 text-sm">${(item.price * item.quantity).toFixed(2)} USD</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/10 gap-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-xs">Total a Cobrar por tus Productos:</span>
                          <span className="text-lg font-black text-emerald-400 font-mono">${sellerSubtotal.toFixed(2)} USD</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {isCompleted ? (
                            <button
                              onClick={() => setActiveBoletaOrder(order)}
                              className="py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all"
                            >
                              <Receipt className="h-4 w-4" />
                              <span>Ver / Imprimir Boleta ({order.boletaNumber})</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const res = issueBoleta(order.id);
                                if (res.success && res.order) {
                                  setActiveBoletaOrder(res.order);
                                }
                              }}
                              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all animate-pulse"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Verificar Pago & Emitir Boleta Oficial</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: GENERADOR DE BOLETAS DE VENTA DIGITALES */}
      {activeTab === 'boletas' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Header Banner */}
          <div className="glass-panel rounded-2xl p-5 border border-neon-purple/40 bg-gradient-to-r from-[#181224] via-[#0f172a] to-[#111111] shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple flex-shrink-0">
                <FileText className="h-7 w-7 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <span>Generador de Boleta Digital de Venta</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/30">
                    Marca Oficial FF Market Pro
                  </span>
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                  Emite comprobantes digitales formales para tus clientes con la insignia de garantía de <strong>FF MARKET PRO</strong>. Puedes imprimirlas, descargarlas o enviar el resumen formateado por WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto flex-shrink-0">
              <button
                onClick={() => {
                  setBoletaNumber('FFMP-BOL-' + Math.floor(100000 + Math.random() * 900000));
                  setBoletaDate(new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }));
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-white/20 transition-all"
                title="Generar un nuevo número de comprobante y actualizar la fecha"
              >
                <Sparkles className="h-4 w-4 text-neon-purple" />
                <span>Nuevo N° Boleta</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT FORM PANEL */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel rounded-2xl p-5 border border-white/10 bg-[#111111] space-y-4">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-2.5 flex items-center justify-between">
                  <span>1. Datos del Cliente y Comprobante</span>
                  <span className="text-[9px] text-neon-purple font-mono font-bold">{boletaNumber}</span>
                </h4>

                {/* Customer Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">👤 Nombre del Cliente</label>
                  <input
                    type="text"
                    value={boletaClientName}
                    onChange={(e) => setBoletaClientName(e.target.value)}
                    placeholder="ej. Carlos Ramírez"
                    className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple placeholder-gray-600"
                  />
                </div>

                {/* Customer Free Fire ID */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">🎮 ID de Jugador / Juego</label>
                    <input
                      type="text"
                      value={boletaClientId}
                      onChange={(e) => setBoletaClientId(e.target.value)}
                      placeholder="ej. 284910294"
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple placeholder-gray-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">📞 Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      value={boletaClientPhone}
                      onChange={(e) => setBoletaClientPhone(e.target.value)}
                      placeholder="ej. +51 987 654 321"
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Payment Method & Currency */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">💳 Método de Pago</label>
                    <select
                      value={boletaPaymentMethod}
                      onChange={(e) => setBoletaPaymentMethod(e.target.value)}
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple font-semibold"
                    >
                      <option value="Yape / Plin (Perú)">📱 Yape / Plin (Perú)</option>
                      <option value="Transferencia Bancaria BCP / Interbank">🏦 Transferencia Bancaria BCP / Interbank</option>
                      <option value="Binance Pay (USDT)">⚡ Binance Pay (USDT)</option>
                      <option value="Saldo FF Market Pro">💳 Saldo FF Market Pro</option>
                      <option value="Mercado Pago / Nequi">💳 Mercado Pago / Nequi / Daviplata</option>
                      <option value="Efectivo / Agente">💵 Efectivo / Depósito en Agente</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Moneda</label>
                    <select
                      value={boletaCurrency}
                      onChange={(e) => setBoletaCurrency(e.target.value as any)}
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple font-bold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PEN">PEN (S/)</option>
                    </select>
                  </div>
                </div>

                {/* Multi-Item Adder Box */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                    <span>2. Productos e Ítems en la Boleta</span>
                    <span className="text-[10px] bg-cyan-400/10 text-cyan-300 font-bold px-2 py-0.5 rounded border border-cyan-400/20">
                      {boletaItems.length} {boletaItems.length === 1 ? 'Producto' : 'Productos'}
                    </span>
                  </h4>

                  {/* Auto-fill from Seller Products or Diamonds */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">⚡ Agregar desde tu Catálogo</label>
                    <select
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        if (val.startsWith('diamond_')) {
                          const qty = parseInt(val.replace('diamond_', ''), 10);
                          const pkg = DIAMOND_PACKAGES_DATA.find(p => p.quantity === qty);
                          if (pkg) {
                            const price = getDiamondPriceForSeller(pkg.quantity, sellerProfile.id);
                            handleAddBoletaItem(`${pkg.quantity} Diamantes ID (${pkg.bonus})`, price, 1);
                          }
                        } else {
                          const prod = sellerProducts.find(p => p.id === val);
                          if (prod) {
                            handleAddBoletaItem(prod.title, prod.price, 1);
                          }
                        }
                      }}
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple"
                    >
                      <option value="">➕ Haz clic para añadir un producto del catálogo...</option>
                      <optgroup label="Paquetes de Diamantes ID">
                        {DIAMOND_PACKAGES_DATA.map((pkg) => (
                          <option key={pkg.quantity} value={`diamond_${pkg.quantity}`}>
                            💎 {pkg.quantity} Diamantes (${getDiamondPriceForSeller(pkg.quantity, sellerProfile.id).toFixed(2)} USD)
                          </option>
                        ))}
                      </optgroup>
                      {sellerProducts.length > 0 && (
                        <optgroup label="Tus Cuentas, Hacks & Combos">
                          {sellerProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              📦 {p.title} (${p.price.toFixed(2)} USD)
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  {/* Custom Manual Item Adder */}
                  <div className="p-3 bg-[#181818] rounded-xl border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">O Agrega un Ítem Personalizado:</span>
                    <input
                      type="text"
                      value={customItemTitle}
                      onChange={(e) => setCustomItemTitle(e.target.value)}
                      placeholder="ej. Pase Élite / Cuenta Veterana / Skin"
                      className="w-full bg-[#111111] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple placeholder-gray-600"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="1"
                        value={customItemQty}
                        onChange={(e) => setCustomItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                        placeholder="Cant."
                        className="w-full bg-[#111111] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={customItemPrice}
                        onChange={(e) => setCustomItemPrice(parseFloat(e.target.value) || 0)}
                        placeholder="Precio Unit."
                        className="w-full bg-[#111111] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!customItemTitle) return;
                        handleAddBoletaItem(customItemTitle, customItemPrice, customItemQty);
                        setCustomItemTitle('');
                        setCustomItemPrice(0);
                        setCustomItemQty(1);
                      }}
                      className="w-full py-1.5 rounded-lg bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1 transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Agregar a la Boleta</span>
                    </button>
                  </div>

                  {/* Added Items List for Quick Editing */}
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {boletaItems.map((item, idx) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-[#151a28] border border-white/10 flex items-center justify-between gap-2 text-xs">
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateBoletaItem(item.id, 'title', e.target.value)}
                            className="w-full bg-transparent text-white font-bold text-xs focus:outline-none border-b border-dashed border-white/20 pb-0.5"
                          />
                          <div className="flex items-center space-x-2 mt-1 text-[11px]">
                            <span className="text-gray-400">Cant:</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateBoletaItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-12 bg-[#0d111d] border border-white/15 rounded px-1 text-center text-white"
                            />
                            <span className="text-gray-400">P.U:</span>
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleUpdateBoletaItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="w-16 bg-[#0d111d] border border-white/15 rounded px-1 text-center text-white"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between space-y-1">
                          <span className="font-extrabold text-neon-blue text-xs font-mono">
                            {boletaCurrency === 'USD' ? '$' : 'S/'}{(item.quantity * item.price).toFixed(2)}
                          </span>
                          {boletaItems.length > 1 && (
                            <button
                              onClick={() => handleRemoveBoletaItem(item.id)}
                              className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                              title="Eliminar este ítem"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Notes */}
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">📝 Nota de Garantía o Mensaje</label>
                  <textarea
                    rows={2}
                    value={boletaNotes}
                    onChange={(e) => setBoletaNotes(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple resize-none"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT LIVE PRINTABLE RECEIPT TICKET PREVIEW */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Receipt Ticket Container */}
              <div 
                id="printable-boleta-ticket"
                className="bg-[#0b0f19] border-2 border-neon-purple/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(168,85,247,0.2)] text-white relative overflow-hidden"
              >
                {/* Background Brand Watermark */}
                <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none select-none">
                  <img src="https://github.com/luqueSmith/FreFire/blob/main/img/logo_ff.png?raw=true" alt="" className="w-80 h-80 object-contain" />
                </div>

                {/* Header Section with Principal Web Name */}
                <div className="border-b-2 border-dashed border-white/20 pb-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 text-left">
                    <img 
                      src="https://github.com/luqueSmith/FreFire/blob/main/img/logo_ff.png?raw=true" 
                      alt="Logo FF" 
                      className="h-12 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h2 className="text-lg font-black tracking-wider text-white">
                        FF<span className="text-neon-blue font-black"> MARKET</span><span className="text-neon-purple font-black text-xs ml-1 bg-neon-purple/20 px-1.5 py-0.5 rounded border border-neon-purple/40">PRO</span>
                      </h2>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Plataforma Oficial de Comercio & Recargas
                      </p>
                      <span className="text-[8px] text-emerald-400 font-mono font-bold block mt-0.5">
                        SISTEMA DE COMPROBANTES DIGITALES VERIFICADOS
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-500/40 inline-flex items-center space-x-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mr-1" />
                      <span>COMPROBANTE VERIFICADO</span>
                    </span>
                    <p className="text-[10px] text-gray-400 font-mono font-bold mt-1">N°: <span className="text-white">{boletaNumber}</span></p>
                    <p className="text-[9px] text-gray-500 font-mono">{boletaDate}</p>
                  </div>
                </div>

                {/* Two Column Issuer & Customer Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#111625] p-4 rounded-xl border border-white/10 text-xs text-left mb-5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-neon-purple uppercase tracking-widest block">EMISOR (VENDEDOR VERIFICADO)</span>
                    <p className="font-extrabold text-white text-sm">{sellerProfile.username}</p>
                    <p className="text-gray-400 text-[10px]">Rango: <span className="text-neon-purple font-bold">Vendedor Nivel {sellerProfile.sellerLevel}</span></p>
                    <p className="text-gray-400 text-[10px]">Reputación: <span className="text-emerald-400 font-bold">{sellerProfile.reputation}% Positivo</span></p>
                    <p className="text-gray-400 text-[10px]">Contacto: <span className="text-gray-200 font-mono">{sellerProfile.phone || '+51 906 328 464'}</span></p>
                  </div>

                  <div className="space-y-1 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block">RECEPTOR (CLIENTE)</span>
                    <p className="font-extrabold text-white text-sm">{boletaClientName || 'Cliente Estimado'}</p>
                    {boletaClientId && (
                      <p className="text-gray-300 font-mono text-[11px]">ID Juego: <strong className="text-cyan-300">{boletaClientId}</strong></p>
                    )}
                    {boletaClientPhone && (
                      <p className="text-gray-400 text-[10px]">WhatsApp: <span className="text-gray-200 font-mono">{boletaClientPhone}</span></p>
                    )}
                    <p className="text-gray-400 text-[10px]">Estado: <span className="text-emerald-400 font-extrabold uppercase">PAGADO & ENTREGADO 🟢</span></p>
                  </div>
                </div>

                {/* Itemized Order Details Table */}
                <div className="space-y-2 mb-5 text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    DETALLE DE LA OPERACIÓN ({boletaItems.length} {boletaItems.length === 1 ? 'ÍTEM' : 'ÍTEMS'})
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/15 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                          <th className="py-2 px-2">DESCRIPCIÓN / ÍTEM</th>
                          <th className="py-2 px-2 text-center">CANT.</th>
                          <th className="py-2 px-2 text-right">PRECIO UNIT.</th>
                          <th className="py-2 px-2 text-right">IMPORTE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boletaItems.map((item, idx) => (
                          <tr key={item.id || idx} className="border-b border-white/5 font-semibold text-white">
                            <td className="py-2.5 px-2 flex items-center space-x-2">
                              <span className="text-neon-purple font-black">📦</span>
                              <span>{item.title}</span>
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono">{item.quantity}</td>
                            <td className="py-2.5 px-2 text-right font-mono">{boletaCurrency === 'USD' ? '$' : 'S/'}{item.price.toFixed(2)}</td>
                            <td className="py-2.5 px-2 text-right font-mono font-bold text-neon-blue">
                              {boletaCurrency === 'USD' ? '$' : 'S/'}{(item.quantity * item.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total & Payment Method Summary */}
                <div className="bg-[#111625] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 text-left">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">MÉTODO DE PAGO</span>
                    <span className="text-xs font-extrabold text-white flex items-center space-x-1.5 mt-0.5">
                      <Coins className="h-4 w-4 text-emerald-400" />
                      <span>{boletaPaymentMethod}</span>
                    </span>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">TOTAL CANCELADO</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {boletaCurrency === 'USD' ? '$' : 'S/'}{boletaTotal.toFixed(2)} {boletaCurrency}
                    </span>
                  </div>
                </div>

                {/* Note & Security Warranty */}
                <div className="space-y-2 text-left border-t border-dashed border-white/15 pt-4">
                  <p className="text-xs text-gray-300 italic">
                    "{boletaNotes}"
                  </p>
                  
                  <div className="flex items-center space-x-2 pt-2 text-[9px] text-gray-400 font-mono">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>
                      Garantía respaldada por la plataforma principal <strong>FF MARKET PRO</strong>. Código de Hash de Seguridad: <strong className="text-white">SEC-{boletaNumber}</strong>.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handlePrintBoleta}
                  className="w-full py-3 px-4 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all border border-neon-purple/50"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimir / Guardar PDF</span>
                </button>

                <button
                  onClick={() => {
                    const itemLines = boletaItems.map((item, idx) => 
                      `  ${idx + 1}. *${item.title}* x${item.quantity} -> ${boletaCurrency === 'USD' ? '$' : 'S/'}${(item.quantity * item.price).toFixed(2)}`
                    ).join('\n');

                    const text = `🧾 *BOLETA DIGITAL DE VENTA - FF MARKET PRO*\n==================================\n🌐 *Plataforma Oficial:* FF Market Pro\n📌 *Comprobante N°:* ${boletaNumber}\n📅 *Fecha:* ${boletaDate}\n----------------------------------\n👤 *Vendedor:* ${sellerProfile.username} (Nivel ${sellerProfile.sellerLevel})\n🎯 *Cliente:* ${boletaClientName || 'Cliente'}\n${boletaClientId ? `🎮 *ID Free Fire:* ${boletaClientId}\n` : ''}${boletaClientPhone ? `📞 *Teléfono:* ${boletaClientPhone}\n` : ''}----------------------------------\n📦 *DETALLE DE PRODUCTOS (${boletaItems.length}):*\n${itemLines}\n----------------------------------\n💵 *TOTAL CANCELADO:* ${boletaCurrency === 'USD' ? '$' : 'S/'}${boletaTotal.toFixed(2)} ${boletaCurrency}\n💳 *Método de Pago:* ${boletaPaymentMethod}\n----------------------------------\n✅ *Estado:* VERIFICADO & ENTREGADO 🟢\n🛡️ *Garantía Respaldada por FF Market Pro*\n\n¡Gracias por tu compra!`;

                    navigator.clipboard.writeText(text);
                    setBoletaCopied(true);
                    setTimeout(() => setBoletaCopied(false), 2500);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  {boletaCopied ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>¡Copiado para WhatsApp!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copiar Texto WhatsApp</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setBoletaClientName('');
                    setBoletaClientId('');
                    setBoletaClientPhone('');
                    setBoletaItems([{ id: '1', title: '1060 Diamantes ID + Bono +106', quantity: 1, price: 10.91 }]);
                    setBoletaNumber('FFMP-BOL-' + Math.floor(100000 + Math.random() * 900000));
                    setBoletaDate(new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }));
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-white/20 transition-all"
                >
                  <Receipt className="h-4 w-4 text-cyan-400" />
                  <span>Limpiar Formulario</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Boleta Modal for Seller */}
      <BoletaModal order={activeBoletaOrder} onClose={() => setActiveBoletaOrder(null)} />
    </div>
  );
};
