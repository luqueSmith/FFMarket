/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Profile,
  SellerProfile,
  Product,
  PointPackage,
  Coupon,
  Notification,
  Conversation,
  Message,
  SupportTicket,
  NewsArticle,
  FaqItem,
  DailyMission,
  AuditLog,
  AppSettings,
  Badge,
  Achievement
} from './types';

// --- SYSTEM CONFIG ---
export const initialSettings: AppSettings = {
  siteName: "FF MARKET PRO",
  logoText: "FF MARKET PRO",
  contactEmail: "soporte@ffmarketpro.com",
  commissionPercent: 5,
  taxPercent: 2,
  featuredSlotsCost: 100,
  isMaintenanceMode: false,
};

// --- BADGES ---
export const mockBadges: Badge[] = [
  { id: 'b1', name: 'Comprador Verificado', description: 'Ha realizado más de 5 compras exitosas', icon: 'ShieldCheck', color: '#3b82f6' },
  { id: 'b2', name: 'Inversionista', description: 'Ha recargado más de 5000 diamantes', icon: 'Gem', color: '#a855f7' },
  { id: 'b3', name: 'Cliente Dorado', description: 'Usuario con nivel de cuenta superior a 5', icon: 'Award', color: '#eab308' },
  { id: 'b4', name: 'Comentador Estrella', description: 'Ha dejado más de 10 calificaciones constructivas', icon: 'MessageSquare', color: '#10b981' }
];

// --- ACHIEVEMENTS ---
export const mockAchievements: Achievement[] = [
  { id: 'ac1', title: 'Primer Paso', description: 'Regístrate en la plataforma', icon: 'UserPlus', unlockedAt: '2026-07-01T12:00:00Z' },
  { id: 'ac2', title: 'Cazador de Ofertas', description: 'Usa tu primer cupón de descuento', icon: 'Percent' },
  { id: 'ac3', title: 'Comerciante', description: 'Realiza tu primera compra de diamantes o cuenta', icon: 'ShoppingBag' },
  { id: 'ac4', title: 'Patrocinador', description: 'Sigue a 3 vendedores profesionales', icon: 'Heart' },
  { id: 'ac5', title: 'Fidelidad Absoluta', description: 'Reclama tu recompensa diaria por 7 días seguidos', icon: 'Flame' }
];

// --- CURRENT USER (USUARIO ROLE) ---
export const mockCurrentUser: Profile = {
  id: "u1",
  username: "garena_king99",
  email: "luquesmith537@gmail.com",
  avatar: "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-01.png?raw=true",
  role: "Usuario",
  level: 8,
  purchaseCount: 14,
  points: 450, // User Loyalty Reward Points
  badges: [mockBadges[0], mockBadges[1]],
  achievements: [mockAchievements[0], mockAchievements[3]],
  createdAt: "2026-01-10T10:30:00Z",
};

// --- CURRENT USER AS SELLER PROFILE (if role changes to Vendedor) ---
export const mockCurrentSellerProfile: SellerProfile = {
  id: "s_u1",
  userId: "u1",
  username: "garena_king99",
  avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
  banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
  frame: "none",
  description: "¡Hola! Vendo cuentas verificadas, diamantes súper rápidos y recargas seguras. 100% de confianza. Atiendo rápido por chat.",
  salesCount: 89,
  points: 620, // Internal points for publishing/renewing
  reputation: 98,
  likesCount: 142,
  dislikesCount: 3,
  reportsCount: 0,
  sellerLevel: 4,
  createdAt: "2026-02-15T08:20:00Z",
  lastActive: "En línea",
  ratingAverage: 4.9,
  medals: ["Top Seller", "Fast Delivery", "Garantizado"],
  acceptedPaymentMethods: ["binance", "paypal", "bybit", "western_union", "usdt", "yape_plin", "cards", "mercadopago"],
  phone: "+51 906328464",
};

// --- SELLERS DATA ---
export const mockSellers: SellerProfile[] = [
  mockCurrentSellerProfile,
  {
    id: "s_megastore",
    userId: "u2",
    username: "FF_MegaStore",
    avatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80",
    frame: "evolutive",
    description: "Distribuidor Oficial Autorizado de Recargas de Diamantes Free Fire. Soporte 24/7 y entregas automáticas por ID.",
    salesCount: 3450,
    points: 1250,
    reputation: 99,
    likesCount: 2840,
    dislikesCount: 15,
    reportsCount: 1,
    sellerLevel: 10,
    createdAt: "2025-05-12T14:40:00Z",
    lastActive: "Hace 5 min",
    ratingAverage: 4.95,
    medals: ["Oficial", "Super Ventas", "Soporte 24/7"],
    phone: "+51 906328464",
  },
  {
    id: "s2",
    userId: "u2",
    username: "FF_MegaStore",
    avatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80",
    frame: "evolutive",
    description: "Distribuidor Oficial Autorizado de Recargas de Diamantes Free Fire. Soporte 24/7 y entregas automáticas por ID.",
    salesCount: 3450,
    points: 1250,
    reputation: 99,
    likesCount: 2840,
    dislikesCount: 15,
    reportsCount: 1,
    sellerLevel: 10,
    createdAt: "2025-05-12T14:40:00Z",
    lastActive: "Hace 5 min",
    ratingAverage: 4.95,
    medals: ["Oficial", "Super Ventas", "Soporte 24/7"],
    phone: "+51 906328464",
  },
  {
    id: "s_chrono",
    userId: "u3",
    username: "ChronoSales_ES",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&auto=format&fit=crop&q=80",
    frame: "sakura",
    description: "Vendedor especializado en cuentas veteranas, Sakura, Hip Hop y recargas express de diamantes en menos de 3 minutos.",
    salesCount: 124,
    points: 40,
    reputation: 98,
    likesCount: 98,
    dislikesCount: 2,
    reportsCount: 0,
    sellerLevel: 4,
    createdAt: "2026-03-22T19:15:00Z",
    lastActive: "Hace 1 hora",
    ratingAverage: 4.8,
    medals: ["Veterano", "Garantía de Reembolso"],
    phone: "+51 906328464",
  },
  {
    id: "s3",
    userId: "u3",
    username: "ChronoSales_ES",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&auto=format&fit=crop&q=80",
    frame: "sakura",
    description: "Vendedor especializado en cuentas veteranas, Sakura, Hip Hop y recargas express de diamantes en menos de 3 minutos.",
    salesCount: 124,
    points: 40,
    reputation: 98,
    likesCount: 98,
    dislikesCount: 2,
    reportsCount: 0,
    sellerLevel: 4,
    createdAt: "2026-03-22T19:15:00Z",
    lastActive: "Hace 1 hora",
    ratingAverage: 4.8,
    medals: ["Veterano", "Garantía de Reembolso"],
    phone: "+51 906328464",
  },
  {
    id: "s_diamond",
    userId: "u4",
    username: "DiamondGamer_LATAM",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80",
    frame: "cyan",
    description: "Los diamantes más baratos de todo LATAM. Recargas vía PagoStore Oficial al instante con tu ID.",
    salesCount: 982,
    points: 310,
    reputation: 99,
    likesCount: 745,
    dislikesCount: 5,
    reportsCount: 0,
    sellerLevel: 5,
    createdAt: "2025-09-01T11:00:00Z",
    lastActive: "Hace 12 min",
    ratingAverage: 4.9,
    medals: ["Recomendado", "Precios Bajos"],
    phone: "+51 906328464",
  },
  {
    id: "s4",
    userId: "u4",
    username: "DiamondGamer_LATAM",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80",
    frame: "cyan",
    description: "Los diamantes más baratos de todo LATAM. Recargas vía PagoStore Oficial al instante con tu ID.",
    salesCount: 982,
    points: 310,
    reputation: 99,
    likesCount: 745,
    dislikesCount: 5,
    reportsCount: 0,
    sellerLevel: 5,
    createdAt: "2025-09-01T11:00:00Z",
    lastActive: "Hace 12 min",
    ratingAverage: 4.9,
    medals: ["Recomendado", "Precios Bajos"],
    phone: "+51 906328464",
  },
  {
    id: "s_official",
    userId: "u_official",
    username: "Tienda Oficial FF",
    avatar: "https://github.com/luqueSmith/FreFire/blob/main/img/venta-diamantes.png?raw=true",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80",
    frame: "golden",
    description: "Servidor central y distribuidor directo autorizado por Garena PagoStore. Garantía del 100% de entrega inmediata por ID.",
    salesCount: 15400,
    points: 9999,
    reputation: 100,
    likesCount: 12400,
    dislikesCount: 0,
    reportsCount: 0,
    sellerLevel: 10,
    createdAt: "2024-01-01T00:00:00Z",
    lastActive: "En línea (Servidor Central)",
    ratingAverage: 5.0,
    medals: ["Oficial", "PagoStore", "Entrega Garantizada"],
    phone: "+51 906328464",
  },
  {
    id: "s_sakura",
    userId: "u_sakura",
    username: "SakuraVentas_FF",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80",
    frame: "sakura",
    description: "Atención personalizada de diamantes y cuentas VIP. Atención por WhatsApp e intermediación garantizada.",
    salesCount: 620,
    points: 210,
    reputation: 94,
    likesCount: 410,
    dislikesCount: 12,
    reportsCount: 1,
    sellerLevel: 3,
    createdAt: "2025-11-15T12:00:00Z",
    lastActive: "Hace 30 min",
    ratingAverage: 4.6,
    medals: ["VIP", "Atención Personal"],
    phone: "+51 906328464",
  }
];

// --- PRODUCTS DATA ---
export const mockProducts: Product[] = [
  // --- ACCOUNTS (CUENTAS) ---
  {
    id: "p1",
    sellerId: "s3",
    sellerName: "ChronoSales_ES",
    sellerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    title: "Cuenta Veterana Free Fire - Pase Sakura, Hip Hop & Criminal Azul",
    description: "Excelente cuenta de colección con skins ultra veteranas muy difíciles de conseguir. Incluye el Pase Elite Temporada 1 (Sakura) y Temporada 2 (Hip Hop) completos, además de la skin incubadora Pase Criminal Azul y Puño de Oro. Tiene más de 50 skins de armas legendarias como MP40 Cobra Evolutiva al Máximo, M1014 Dragón Verde, etc. Se entrega con correo de creación y desvinculación de Facebook inmediata.",
    price: 350.00,
    previousPrice: 450.00,
    discountPercent: 22,
    type: "cuenta",
    category: "Veterana Sakura",
    server: "Sudamérica",
    level: 72,
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=80"
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "active",
    createdAt: "2026-07-10T15:30:00Z",
    expiresAt: "2026-07-24T15:30:00Z",
    tags: ["Sakura", "Hip Hop", "Evolutivas", "Criminal", "Veterana"],
    features: ["Pase Sakura completo", "MP40 Cobra Máximo", "Nivel 72", "Servidor Sudamérica", "Desvinculada"],
    likes: 42,
    dislikes: 1,
    views: 1250,
    isFeatured: true,
  },
  {
    id: "p2",
    sellerId: "s_u1",
    sellerName: "garena_king99",
    sellerAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
    title: "Cuenta Free Fire Rango Gran Maestro - Temporada Actual",
    description: "Vendo cuenta competitiva en rango Gran Maestro con un KD Ratio de 5.2. Cuenta perfecta para lucirse en torneos y salas privadas. Contiene el set completo de Criminal Verde, Pase Booyah actual al nivel 150, AK47 Dragón Flama Azul Nivel 5, y más de 30,000 monedas de oro listas para usar. Todo legal, subido a mano sin hacks ni programas de terceros.",
    price: 120.00,
    previousPrice: 150.00,
    discountPercent: 20,
    type: "cuenta",
    category: "Competitiva",
    server: "EEUU",
    level: 65,
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-12T10:00:00Z",
    expiresAt: "2026-07-19T10:00:00Z",
    tags: ["Gran Maestro", "Criminal", "Evolutivas", "EEUU"],
    features: ["Rango Gran Maestro", "Set Criminal Verde", "KD Ratio 5.2", "AK47 Flama Azul Lv 5"],
    likes: 19,
    dislikes: 0,
    views: 420,
    isFeatured: false,
  },

  // --- DIAMONDS (DIAMANTES) ---
  {
    id: "p3",
    sellerId: "s2",
    sellerName: "FF_MegaStore",
    sellerAvatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80",
    title: "Paquete 1,060 Diamantes Free Fire - Recarga Directa por ID",
    description: "Recarga rápida de 1,060 diamantes directamente a tu cuenta ingresando únicamente tu ID de jugador. La entrega tarda entre 2 y 5 minutos máximo después de confirmado el pago. Compatible con todos los servidores de América y Europa. Proceso 100% seguro libre de reembolsos o ban.",
    price: 9.99,
    previousPrice: 12.50,
    discountPercent: 20,
    type: "diamante",
    category: "Diamantes ID",
    server: "Sudamérica",
    stock: 999,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-01T08:00:00Z",
    expiresAt: "2026-12-31T23:59:59Z",
    tags: ["Diamantes", "Recarga ID", "Entrega Rápida"],
    features: ["1,060 Diamantes", "Solo requiere ID", "Entrega en 5 minutos", "Sin riesgo de ban"],
    likes: 450,
    dislikes: 2,
    views: 8900,
    isFeatured: true,
  },
  {
    id: "p10",
    sellerId: "s4",
    sellerName: "DiamondGamer_LATAM",
    sellerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    title: "OFERTA DE DIAMANTES FREE FIRE 💎💥",
    description: "RECARGAS SOLO CON ID, LLEGAN AL INSTANTE 💥\n\n120    Diamantes 💎 = S/3.5\n372    Diamantes 💎 = S/10\n624    Diamantes 💎 = S/17\n1272   Diamantes 💎 = S/34\n2616   Diamantes 💎 = S/65\n6720   Diamantes 💎 = S/150\n\nPagos por Yape, BCP, PayPal y Binance",
    price: 3.50,
    previousPrice: 5.00,
    discountPercent: 30,
    type: "diamante",
    category: "Recarga ID",
    server: "Sudamérica",
    stock: 999,
    images: [],
    status: "active",
    createdAt: "2026-07-17T09:00:00Z",
    expiresAt: "2026-12-31T23:59:59Z",
    tags: ["Diamantes", "ID", "Yape", "BCP", "Soles"],
    features: [
      "120 Diamantes = S/3.5",
      "372 Diamantes = S/10",
      "624 Diamantes = S/17",
      "1272 Diamantes = S/34",
      "2616 Diamantes = S/65",
      "6720 Diamantes = S/150",
      "Pagos por Yape, BCP, PayPal y Binance"
    ],
    likes: 580,
    dislikes: 1,
    views: 3100,
    isFeatured: true,
  },
  {
    id: "p4",
    sellerId: "s2",
    sellerName: "FF_MegaStore",
    sellerAvatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80",
    title: "Paquete 5,600 Diamantes Free Fire - Súper Oferta",
    description: "Súper paquete masivo de 5,600 diamantes. Ideal para girar ruletas de evolutivas y comprar los últimos aspectos. Recarga oficial autorizada que también acumula puntos en eventos de recarga dentro del juego. Envío express.",
    price: 45.99,
    previousPrice: 55.00,
    discountPercent: 16,
    type: "diamante",
    category: "Diamantes ID",
    server: "Sudamérica",
    stock: 250,
    images: [
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-01T08:00:00Z",
    expiresAt: "2026-10-31T23:59:59Z",
    tags: ["Diamantes", "Mayorista", "Garena Oficial"],
    features: ["5,600 Diamantes", "Solo requiere ID", "Acumula para eventos internos", "Garantía total"],
    likes: 312,
    dislikes: 1,
    views: 5200,
    isFeatured: false,
  },

  // --- RECHARGES (RECARGAS / MEMBRESÍAS) ---
  {
    id: "p5",
    sellerId: "s4",
    sellerName: "DiamondGamer_LATAM",
    sellerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    title: "Membresía Semanal Free Fire - 450 Diamantes en total",
    description: "Activa tu membresía semanal con la que recibirás 100 diamantes de manera inmediata y 50 diamantes diarios durante 7 días (450 diamantes en total), además de un icono exclusivo y recompensas adicionales. ¡Ahorra hasta un 400% en comparación con recargas directas!",
    price: 1.99,
    previousPrice: 3.50,
    discountPercent: 43,
    type: "recarga",
    category: "Membresía",
    server: "Sudamérica",
    stock: 500,
    images: [
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-05T12:00:00Z",
    expiresAt: "2026-09-30T12:00:00Z",
    tags: ["Membresía", "Semanal", "Ahorro", "Suscripción"],
    features: ["450 Diamantes en total", "100 Diamantes al instante", "Recompensas diarias por 7 días", "Icono semanal especial"],
    likes: 189,
    dislikes: 4,
    views: 3100,
    isFeatured: true,
  },
  {
    id: "p6",
    sellerId: "s4",
    sellerName: "DiamondGamer_LATAM",
    sellerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    title: "Membresía Mensual Free Fire - 2,600 Diamantes en total",
    description: "La mejor opción para jugadores activos. Recibe 500 diamantes al instante y 70 diamantes todos los días durante 30 días, completando 2,600 diamantes en total. Incluye la caja de regalo mensual, medallas de pase, e icono dorado de membresía. Excelente para acumular skins.",
    price: 7.99,
    previousPrice: 12.00,
    discountPercent: 33,
    type: "recarga",
    category: "Membresía",
    server: "Sudamérica",
    stock: 300,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-05T12:00:00Z",
    expiresAt: "2026-09-30T12:00:00Z",
    tags: ["Membresía", "Mensual", "Gran Ahorro", "VIP"],
    features: ["2,600 Diamantes en total", "500 Diamantes al instante", "70 Diamantes diarios por 30 días", "Medallas y cajas extra"],
    likes: 275,
    dislikes: 3,
    views: 4500,
    isFeatured: false,
  },

  // --- OFFERS (OFERTAS) ---
  {
    id: "p7",
    sellerId: "s_u1",
    sellerName: "garena_king99",
    sellerAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
    title: "Super Combo Booyah: Cuenta Diamante IV + 520 Diamantes ID",
    description: "Pack especial promocional diseñado para subir tu estatus. Te entregamos una cuenta de nivel 45 en rango Diamante IV (con varias skins de pase) Y ADEMÁS te recargamos 520 diamantes a la cuenta que tú elijas. Todo por un único precio de oferta limitada.",
    price: 24.99,
    previousPrice: 50.00,
    discountPercent: 50,
    type: "oferta",
    category: "Combo Pack",
    server: "Sudamérica",
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-14T14:00:00Z",
    expiresAt: "2026-07-21T14:00:00Z",
    tags: ["Oferta del Día", "Combo", "Cuenta", "Diamantes", "Descuento50"],
    features: ["Cuenta Nivel 45", "Rango Diamante IV", "520 Diamantes de regalo en tu ID", "50% de Descuento total"],
    likes: 56,
    dislikes: 1,
    views: 790,
    isFeatured: true,
  },
  {
    id: "p8",
    sellerId: "s2",
    sellerName: "FF_MegaStore",
    sellerAvatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80",
    title: "Inyector VIP Antiban - Aimbot 100% Cabeza & Regedit Pro",
    description: "La mejor herramienta para dar todo rojo en tus salas y clasificatorias. Incluye sensibilidad optimizada, Regedit integrado, No Recoil, y bypass avanzado antiban para evitar reportes del juego. Funciona para Android y PC. Actualizado a la última versión del parche del juego de forma automática.",
    price: 15.00,
    previousPrice: 30.00,
    discountPercent: 50,
    type: "hack",
    category: "Aimbot",
    server: "Sudamérica",
    stock: 150,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-16T12:00:00Z",
    expiresAt: "2026-10-15T12:00:00Z",
    tags: ["Hacks", "Aimbot", "Regedit", "Todo Rojo", "Antiban"],
    features: ["Aimbot 100% Automático", "Bypass Antiban Activado", "Funciona en Mobile y Emulador", "Soporte Técnico 24/7"],
    likes: 312,
    dislikes: 3,
    views: 4500,
    isFeatured: true,
  },
  {
    id: "p9",
    sellerId: "s4",
    sellerName: "DiamondGamer_LATAM",
    sellerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    title: "Script Lua Antena Cabeza & Localizador de Enemigos VIP",
    description: "Encuentra a todos tus enemigos con la antena cabeza de color neón ultra visible. Te permite saber exactamente la posición de los rivales a través de las paredes, la distancia y la vida que tienen. Seguro para usar en tu cuenta principal con método bypass optimizado para el último parche.",
    price: 8.99,
    previousPrice: 15.00,
    discountPercent: 40,
    type: "hack",
    category: "Texturas",
    server: "Sudamérica",
    stock: 80,
    images: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-15T10:00:00Z",
    expiresAt: "2026-09-15T10:00:00Z",
    tags: ["Script", "Antena Cabeza", "Wallhack", "Bypass", "Texturas"],
    features: ["Antena Neón de largo alcance", "Localizador en tiempo real", "Fácil instalación con un clic", "Compatible con todas las versiones"],
    likes: 125,
    dislikes: 1,
    views: 2200,
    isFeatured: false,
  },
  {
    id: "p11",
    sellerId: "s2",
    sellerName: "FF_MegaStore",
    sellerAvatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80",
    title: "Panel VIP Pro - Mod Menu Auto-Headshot, Fly & Speed Hack",
    description: "El panel flotante definitivo para dominar cualquier modo de juego de Free Fire. Con menú interactivo in-game que te permite activar y desactivar funciones en tiempo real: Autoapuntado (Aimbot), tiro fantasma, hack de velocidad, antena y bypass antiban integrado. Compatible con Android sin root y emuladores de PC.",
    price: 24.99,
    previousPrice: 40.00,
    discountPercent: 37,
    type: "hack",
    category: "Panel",
    server: "Sudamérica",
    stock: 120,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-16T14:30:00Z",
    expiresAt: "2026-10-15T14:30:00Z",
    tags: ["Panel", "VIP", "Mod Menu", "Bypass", "Aimbot"],
    features: ["Panel flotante activable", "Aimbot & Tiro Fantasma", "Bypass Antiban Activado", "Actualización automática"],
    likes: 198,
    dislikes: 2,
    views: 3100,
    isFeatured: true,
  },
  {
    id: "p12",
    sellerId: "s4",
    sellerName: "DiamondGamer_LATAM",
    sellerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    title: "Pack de Texturas VIP - Armas Evolutivas y Ropa Veterana Sakura",
    description: "Consigue el aspecto de un jugador veterano sin riesgo de suspensión. Este pack modifica visualmente las armas y ropa estándar en tu pantalla. Podrás ver y disfrutar de todas las armas evolutivas al máximo (AK Dragón, MP40 Cobra, M1887), el set Sakura, Hip Hop y chaquetas veteranas. 100% seguro (los archivos modifican solo elementos visuales locales).",
    price: 5.99,
    previousPrice: 10.00,
    discountPercent: 40,
    type: "hack",
    category: "Texturas",
    server: "Sudamérica",
    stock: 250,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ],
    status: "active",
    createdAt: "2026-07-17T08:15:00Z",
    expiresAt: "2026-11-17T08:15:00Z",
    tags: ["Texturas", "Skins", "Evolutivas", "Criminal", "Sakura"],
    features: ["Todas las armas evolutivas", "Sets veteranos icónicos", "100% seguro contra ban (Visual local)", "Instalador automático"],
    likes: 87,
    dislikes: 0,
    views: 1100,
    isFeatured: false,
  }
];

// --- SELLER POINT PACKAGES ---
export const mockPointPackages: PointPackage[] = [
  { id: "pp1", points: 100, price: 4.99, discountPrice: 3.99 },
  { id: "pp2", points: 250, price: 9.99, isPopular: true },
  { id: "pp3", points: 500, price: 18.99, discountPrice: 15.99, bonusPoints: 50 },
  { id: "pp4", points: 1000, price: 34.99, bonusPoints: 120 },
  { id: "pp5", points: 2500, price: 79.99, bonusPoints: 400 },
  { id: "pp6", points: 5000, price: 149.99, bonusPoints: 1000 },
  { id: "pp7", points: 10000, price: 279.99, bonusPoints: 2500 }
];

// --- COUPONS ---
export const mockCoupons: Coupon[] = [
  { id: "c1", code: "FREEFIRE20", discountType: "percent", discountValue: 20, minPurchase: 10, expiresAt: "2026-08-31", maxUses: 100, usedCount: 42, isActive: true },
  { id: "c2", code: "DIAMANTE5", discountType: "fixed", discountValue: 5, minPurchase: 30, expiresAt: "2026-09-15", maxUses: 200, usedCount: 19, isActive: true },
  { id: "c3", code: "BIENVENIDO", discountType: "percent", discountValue: 10, expiresAt: "2026-12-31", maxUses: 1000, usedCount: 412, isActive: true },
  { id: "c4", code: "BLACKFRIDAY", discountType: "percent", discountValue: 50, minPurchase: 50, expiresAt: "2026-11-30", maxUses: 50, usedCount: 0, isActive: false }
];

// --- NOTIFICATIONS ---
export const mockNotifications: Notification[] = [
  { id: "n1", userId: "u1", title: "¡Puntos Recibidos!", message: "Has ganado 25 puntos de bonificación por registrarte hoy.", type: "points", isRead: false, createdAt: "2026-07-16T06:00:00Z" },
  { id: "n2", userId: "u1", title: "Nueva Compra Exitosa", message: "Tu compra de 'Paquete 1,060 Diamantes' ha sido aprobada. Los diamantes llegarán en breve.", type: "purchase", isRead: true, createdAt: "2026-07-15T18:30:00Z" },
  { id: "n3", userId: "u1", title: "Un usuario te dio Like", message: "Un comprador te calificó con 5 estrellas y recomendó tu perfil.", type: "like", isRead: false, createdAt: "2026-07-16T04:20:00Z" },
  { id: "n4", userId: "u1", title: "Anuncio por Expirar", message: "Tu publicación 'Cuenta Free Fire Rango Gran Maestro' expira en 3 días. Renuévala por 10 puntos.", type: "system", isRead: false, createdAt: "2026-07-15T10:00:00Z" }
];

// --- CONVERSATIONS & MESSAGES ---
export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantA: { id: "u1", name: "garena_king99", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80", role: "Usuario" },
    participantB: { id: "s2", name: "FF_MegaStore", avatar: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=150&auto=format&fit=crop&q=80", role: "Vendedor" },
    lastMessageText: "¡Listo amigo! Recarga realizada con éxito. Verifica tu juego.",
    lastMessageTime: "Hace 10 min",
    unreadCountA: 0,
    unreadCountB: 0
  },
  {
    id: "conv2",
    participantA: { id: "u1", name: "garena_king99", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80", role: "Usuario" },
    participantB: { id: "s3", name: "ChronoSales_ES", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", role: "Vendedor" },
    lastMessageText: "Hola, ¿el precio de la cuenta Sakura es negociable o es fijo?",
    lastMessageTime: "Ayer",
    unreadCountA: 1,
    unreadCountB: 0
  }
];

export const mockMessages: Message[] = [
  // Conversation 1
  { id: "m1", conversationId: "conv1", senderId: "u1", senderName: "garena_king99", senderRole: "Usuario", text: "Hola FF_MegaStore, acabo de pagar los 1060 diamantes. Mi ID de jugador es 482910492.", createdAt: "2026-07-16T07:20:00Z" },
  { id: "m2", conversationId: "conv1", senderId: "s2", senderName: "FF_MegaStore", senderRole: "Vendedor", text: "Hola garena_king99, gracias por tu compra. Ya estoy procesándola en Garena PagoStore.", createdAt: "2026-07-16T07:22:00Z" },
  { id: "m3", conversationId: "conv1", senderId: "s2", senderName: "FF_MegaStore", senderRole: "Vendedor", text: "¡Listo amigo! Recarga realizada con éxito. Verifica tu juego.", createdAt: "2026-07-16T07:25:00Z" },

  // Conversation 2
  { id: "m4", conversationId: "conv2", senderId: "u1", senderName: "garena_king99", senderRole: "Usuario", text: "Hola, ¿el precio de la cuenta Sakura es negociable o es fijo?", createdAt: "2026-07-15T15:30:00Z" }
];

// --- NEWS ARTICLES ---
export const mockNews: NewsArticle[] = [
  {
    id: "news1",
    title: "Nueva Ruleta de la Suerte: Set Criminal Rojo y Amarillo regresan a Free Fire",
    summary: "Descubre los detalles de la nueva agenda semanal de Garena. El codiciado aspecto Criminal regresa por tiempo limitado.",
    content: "Esta semana, Garena ha anunciado la esperada Ruleta de la Suerte de Free Fire, trayendo de vuelta los aspectos más icónicos del juego: el Criminal Rojo y el Criminal Amarillo. Estos sets, lanzados hace varios años como incubadoras especiales, son considerados de los más raros en los servidores de Sudamérica y EEUU. Los jugadores podrán usar diamantes para girar la ruleta y conseguir descuentos de hasta el 90%. Asegúrate de comprar tus diamantes con anticipación en FF MARKET PRO para obtener los mejores precios del mercado de forma instantánea.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    tag: "Actualización",
    publishedAt: "15 Jul 2026"
  },
  {
    id: "news2",
    title: "Cómo evitar estafas al comprar cuentas de Free Fire: Guía de Seguridad de FF MARKET PRO",
    summary: "Aprende los métodos clave para verificar la desvinculación de Facebook, Google o VK al adquirir tu cuenta de juego.",
    content: "La seguridad es nuestra máxima prioridad en FF MARKET PRO. Al adquirir una cuenta veterana de Free Fire, siempre debes verificar que el vendedor proporcione datos limpios de desvinculación. Un proceso seguro consta de: 1) Cambiar la contraseña del correo electrónico asociado de forma inmediata, 2) Activar la autenticación de dos factores en ese correo, 3) Desvincular todas las cuentas de terceros dentro de los ajustes de Free Fire, 4) No compartir el ID ni contraseñas fuera del chat oficial de FF MARKET PRO. Recuerda que todas tus compras en nuestra plataforma cuentan con retención de fondos para proteger tu dinero.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    tag: "Seguridad",
    publishedAt: "12 Jul 2026"
  },
  {
    id: "news3",
    title: "Torneo Continental Booyah 2026: Inscripciones abiertas para equipos de LATAM",
    summary: "Se ha anunciado el pozo de premios de $50,000 USD para el torneo más grande de la región. Te contamos cómo participar.",
    content: "El Torneo Continental Booyah de este año promete romper todos los récords de audiencia. Con una bolsa acumulada de cincuenta mil dólares, escuadras de toda Sudamérica y Norteamérica se enfrentarán en partidas clasificatorias en mapas Bermuda, Purgatorio y Kalahari. Las inscripciones oficiales abren mañana. Para competir al nivel profesional, muchos capitanes y jugadores están adquiriendo cuentas Gran Maestro y optimizando sus inventarios con pases Booyah comprados a través de las ofertas flash de nuestra web.",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
    tag: "eSports",
    publishedAt: "10 Jul 2026"
  }
];

// --- FAQS ---
export const mockFaq: FaqItem[] = [
  {
    id: "f1",
    question: "¿Es seguro comprar diamantes por ID en FF MARKET PRO?",
    answer: "Totalmente seguro. El vendedor utiliza PagoStore Oficial, el portal de recargas autorizado por Garena. Al realizarse únicamente con el ID de jugador, nunca tendrás que revelar la contraseña de tu cuenta, eliminando cualquier riesgo de robo o baneo por reembolso.",
    category: "Diamantes y Recargas"
  },
  {
    id: "f2",
    question: "¿Cómo funciona la entrega de las cuentas de Free Fire?",
    answer: "Una vez que realizas el pago, el monto queda retenido de forma segura en FF MARKET PRO. El vendedor se pondrá en contacto contigo a través de nuestro chat interno para entregarte las credenciales de la cuenta (correo, contraseña y código de respaldo). Tienes hasta 24 horas para revisar la cuenta y confirmar que coincide con la descripción del anuncio. Al aprobarlo, el vendedor recibe su dinero.",
    category: "Cuentas de Free Fire"
  },
  {
    id: "f3",
    question: "¿Qué pasa si un vendedor me estafa o no entrega el producto?",
    answer: "Nuestra plataforma posee un sistema de protección al comprador. Si el vendedor no entrega el producto o no coincide con lo ofrecido, puedes abrir una disputa en tu panel de compras. El equipo administrativo revisará los logs del chat y procederá al reembolso completo de tu saldo si se comprueba el incumplimiento del vendedor.",
    category: "Soporte y Reembolsos"
  },
  {
    id: "f4",
    question: "¿Cómo obtengo puntos de publicación si soy vendedor?",
    answer: "Los vendedores necesitan puntos para publicar anuncios, renovarlos o destacarlos. Puedes obtener puntos vendiendo productos (recibes un porcentaje en puntos de recompensa), completando misiones diarias, o comprando paquetes de puntos con dinero real en la tienda del vendedor. ¡El Administrador también suele regalar puntos por eventos especiales!",
    category: "Vendedores y Puntos"
  }
];

// --- DAILY MISSIONS ---
export const mockMissions: DailyMission[] = [
  { id: "m_d1", title: "Racha Diaria", description: "Inicia sesión hoy en la plataforma", pointsReward: 10, progress: 1, target: 1, completed: true, claimed: false },
  { id: "m_d2", title: "Cazador de Escaparates", description: "Verifica 3 publicaciones de cuentas veteranas", pointsReward: 5, progress: 3, target: 3, completed: true, claimed: false },
  { id: "m_d3", title: "Interacción Social", description: "Deja un me gusta en un vendedor profesional", pointsReward: 5, progress: 1, target: 1, completed: true, claimed: false },
  { id: "m_d4", title: "Negociante", description: "Envía un mensaje de consulta en el chat", pointsReward: 10, progress: 0, target: 1, completed: false, claimed: false }
];

// --- INITIAL REVIEWS ---
export const mockReviews = [
  { id: "rev1", userId: "u2", username: "GamerPro_9", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", rating: 5, comment: "Excelente recarga rápida de diamantes por ID, tardó menos de 2 minutos. Vendedor recomendado.", sellerId: "s2", createdAt: "2026-07-16T01:00:00Z" },
  { id: "rev2", userId: "u3", username: "SlayerFF", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", rating: 5, comment: "La cuenta de Gran Maestro está perfecta, desvinculada y legal. Muy amable el vendedor.", sellerId: "s_u1", createdAt: "2026-07-15T14:20:00Z" }
];

// --- INITIAL REPORTS ---
export const mockReports = [
  { id: "rep1", userId: "u3", username: "SlayerFF", sellerId: "s3", productId: "p1", type: "spam", reason: "Anuncio repetido tres veces en la lista de cuentas.", status: "pending", createdAt: "2026-07-16T02:00:00Z" } as const
];

// --- INITIAL AUDIT LOGS ---
export const mockAuditLogs: AuditLog[] = [
  { id: "al1", userId: "u1", username: "garena_king99", role: "Usuario", action: "Inicio de sesión", details: "Inicio de sesión exitoso desde IP 190.235.12.90", ipAddress: "190.235.12.90", timestamp: "2026-07-16T07:48:30Z" },
  { id: "al2", userId: "u1", username: "garena_king99", role: "Usuario", action: "Agregar al Carrito", details: "Producto 'Paquete 1,060 Diamantes' agregado", ipAddress: "190.235.12.90", timestamp: "2026-07-16T07:49:10Z" }
];
