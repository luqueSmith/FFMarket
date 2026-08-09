/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- ROLES & PERMISSIONS ---
export type UserRole = 'Usuario' | 'Vendedor' | 'Administrador';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

// --- USER LEVELS & BADGES ---
export interface UserLevel {
  level: number;
  minPoints: number;
  title: string;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  icon: string;
}

// --- PROFILES & USER DATA ---
export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  frame?: string;
  phone?: string;
  role: UserRole;
  level: number;
  purchaseCount: number;
  points: number; // User reward points
  badges: Badge[];
  achievements: Achievement[];
  createdAt: string;
  ratingAverage?: number;
  password?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface PaymentMethod {
  id: string;
  type: 'Tarjeta' | 'PayPal' | 'Crypto' | 'PagoEfectivo';
  last4?: string;
  provider: string;
  isDefault: boolean;
}

// --- SELLER DATA ---
export interface SellerLevel {
  level: number;
  minSales: number;
  title: string;
  maxActiveListings: number;
}

export interface SellerProfile {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  banner: string;
  frame?: string;
  description: string;
  salesCount: number;
  points: number; // Internal coin points used for publishing/promoting
  reputation: number; // Percentage, e.g. 98
  likesCount: number;
  dislikesCount: number;
  reportsCount: number;
  sellerLevel: number;
  createdAt: string;
  lastActive: string;
  ratingAverage: number;
  medals: string[];
  acceptedPaymentMethods?: string[];
  phone?: string;
}

export interface SellerPointsTransaction {
  id: string;
  sellerId: string;
  amount: number; // Positive or negative
  type: 'publish' | 'renew' | 'highlight' | 'top_feature' | 'buy_package' | 'bonus' | 'admin_adjust';
  description: string;
  timestamp: string;
}

export interface PointPackage {
  id: string;
  points: number;
  price: number;
  discountPrice?: number;
  isPopular?: boolean;
  bonusPoints?: number;
}

// --- PRODUCTS (CUENTAS, DIAMANTES, RECARGAS, OFERTAS) ---
export type ProductType = 'cuenta' | 'diamante' | 'recarga' | 'oferta' | 'hack';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  title: string;
  description: string;
  price: number;
  previousPrice?: number;
  discountPercent?: number;
  type: ProductType;
  category: string; // e.g. "Heroico", "Pase Elite", "Diamantes Directos"
  server: 'Sudamérica' | 'EEUU' | 'Europa' | 'Asia' | 'Cualquier Región' | 'Global';
  level?: number; // For accounts
  quantity?: number; // For diamond counts
  stock: number;
  images: string[];
  videoUrl?: string;
  status: 'active' | 'expired' | 'sold' | 'suspended';
  createdAt: string;
  expiresAt: string;
  tags: string[];
  features: string[];
  likes: number;
  dislikes: number;
  views: number;
  isFeatured?: boolean;
}

// --- CART & ORDERS ---
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productType: ProductType;
  price: number;
  quantity: number;
  sellerId?: string;
  sellerName?: string;
}

export interface Order {
  id: string;
  boletaNumber?: string;
  userId: string;
  userName: string;
  userPhone?: string;
  playerId?: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  items: OrderItem[];
  paymentMethod: string;
  pointsEarned: number;
  createdAt: string;
}

// --- USER REVIEWS, LIKES, DISLIKES & REPORTS ---
export interface Review {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  productId?: string;
  sellerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export type ReportType = 'fraud' | 'spam' | 'fake_account' | 'offensive_content' | 'scam' | 'other';

export interface Report {
  id: string;
  userId: string;
  username: string;
  sellerId?: string;
  productId?: string;
  type: ReportType;
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
}

// --- COUPON SYSTEM ---
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
}

// --- NOTIFICATIONS ---
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'sale' | 'purchase' | 'like' | 'report' | 'points' | 'message' | 'system';
  isRead: boolean;
  createdAt: string;
}

// --- SYSTEM CHAT & SUPPORT ---
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantA: { id: string; name: string; avatar: string; role: UserRole };
  participantB: { id: string; name: string; avatar: string; role: UserRole };
  lastMessageText: string;
  lastMessageTime: string;
  unreadCountA: number;
  unreadCountB: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

// --- REWARDS & QUESTS ---
export interface DailyStreak {
  streak: number;
  lastClaimed?: string;
  availableToday: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export interface Referral {
  id: string;
  userId: string;
  referredEmail: string;
  status: 'pending' | 'completed';
  rewardPoints: number;
  createdAt: string;
}

// --- SYSTEM LOGS & CONFIG ---
export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AppSettings {
  siteName: string;
  logoText: string;
  contactEmail: string;
  commissionPercent: number; // e.g. 5% on sales
  taxPercent: number; // e.g. 2%
  featuredSlotsCost: number; // Points
  isMaintenanceMode: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  tag: string;
  publishedAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
