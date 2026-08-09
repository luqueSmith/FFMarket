import React from 'react';

export interface PaymentMethodItem {
  id: string;
  name: string;
  shortName: string;
  category: 'international' | 'crypto' | 'local' | 'card';
  badgeBg: string;
  borderColor: string;
  textColor: string;
  iconType: string; // Used for rendering custom SVG or Lucide
}

export const ALL_PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'binance',
    name: 'Binance Pay',
    shortName: 'Binance',
    category: 'crypto',
    badgeBg: 'bg-[#181204] hover:bg-[#261d06]',
    borderColor: 'border-[#F0B90B]/50',
    textColor: 'text-[#F0B90B]',
    iconType: 'binance'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    shortName: 'PayPal',
    category: 'international',
    badgeBg: 'bg-[#001c3d]/90 hover:bg-[#002857]',
    borderColor: 'border-[#0070BA]/50',
    textColor: 'text-[#3b82f6]',
    iconType: 'paypal'
  },
  {
    id: 'bybit',
    name: 'ByBit Pay',
    shortName: 'ByBit',
    category: 'crypto',
    badgeBg: 'bg-[#1a1300]/90 hover:bg-[#2a2000]',
    borderColor: 'border-[#F7A600]/50',
    textColor: 'text-[#F7A600]',
    iconType: 'bybit'
  },
  {
    id: 'western_union',
    name: 'Western Union',
    shortName: 'Western Union',
    category: 'international',
    badgeBg: 'bg-[#121212] hover:bg-[#1f1f1f]',
    borderColor: 'border-[#FFCC00]/50',
    textColor: 'text-[#FFCC00]',
    iconType: 'wu'
  },
  {
    id: 'usdt',
    name: 'Crypto USDT (TRC20)',
    shortName: 'USDT Crypto',
    category: 'crypto',
    badgeBg: 'bg-[#021f17]/90 hover:bg-[#043326]',
    borderColor: 'border-[#26A17B]/50',
    textColor: 'text-[#26A17B]',
    iconType: 'usdt'
  },
  {
    id: 'yape_plin',
    name: 'Yape / Plin',
    shortName: 'Yape & Plin',
    category: 'local',
    badgeBg: 'bg-[#19022b]/90 hover:bg-[#2b044a]',
    borderColor: 'border-[#a855f7]/50',
    textColor: 'text-[#c084fc]',
    iconType: 'yape'
  },
  {
    id: 'cards',
    name: 'Tarjeta Crédito / Débito',
    shortName: 'Tarjeta / Visa',
    category: 'card',
    badgeBg: 'bg-[#0c1938]/90 hover:bg-[#132654]',
    borderColor: 'border-[#38bdf8]/50',
    textColor: 'text-[#38bdf8]',
    iconType: 'card'
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    shortName: 'Mercado Pago',
    category: 'local',
    badgeBg: 'bg-[#001d33]/90 hover:bg-[#002e52]',
    borderColor: 'border-[#009EE3]/50',
    textColor: 'text-[#009EE3]',
    iconType: 'mercadopago'
  },
  {
    id: 'airtm',
    name: 'Airtm',
    shortName: 'Airtm',
    category: 'international',
    badgeBg: 'bg-[#001833]/90 hover:bg-[#002854]',
    borderColor: 'border-[#0066FF]/50',
    textColor: 'text-[#60a5fa]',
    iconType: 'airtm'
  },
  {
    id: 'zelle',
    name: 'Zelle',
    shortName: 'Zelle',
    category: 'international',
    badgeBg: 'bg-[#1b0033]/90 hover:bg-[#2d0054]',
    borderColor: 'border-[#a855f7]/50',
    textColor: 'text-[#d8b4fe]',
    iconType: 'zelle'
  },
  {
    id: 'bank_transfer',
    name: 'Transferencia Bancaria',
    shortName: 'Bancos / Transf.',
    category: 'local',
    badgeBg: 'bg-[#022416]/90 hover:bg-[#043d26]',
    borderColor: 'border-[#10b981]/50',
    textColor: 'text-[#34d399]',
    iconType: 'bank'
  }
];

export const DEFAULT_SELLER_PAYMENT_METHODS = ['binance', 'paypal', 'bybit', 'western_union', 'usdt', 'yape_plin', 'cards', 'mercadopago'];
