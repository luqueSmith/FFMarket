import React from 'react';
import { ALL_PAYMENT_METHODS } from '../data/paymentMethods';
import { ShieldCheck } from 'lucide-react';

interface Props {
  methodId: string;
  size?: 'sm' | 'md' | 'lg';
  showFullName?: boolean;
}

export const PaymentMethodBadge: React.FC<Props> = ({ methodId, size = 'md', showFullName = true }) => {
  const method = ALL_PAYMENT_METHODS.find(m => m.id === methodId) || {
    id: methodId,
    name: methodId,
    shortName: methodId,
    category: 'local',
    badgeBg: 'bg-white/5',
    borderColor: 'border-white/10',
    textColor: 'text-gray-300',
    iconType: 'default'
  };

  const renderIcon = () => {
    switch (method.iconType) {
      case 'binance':
        return (
          <span className="font-black text-[10px] px-1.5 py-0.5 rounded bg-[#F0B90B] text-black leading-none flex items-center justify-center font-mono">
            BINANCE
          </span>
        );
      case 'paypal':
        return (
          <span className="font-black text-[10px] text-[#0070BA] italic tracking-tighter bg-white px-1.5 py-0.5 rounded shadow-sm">
            PayPal
          </span>
        );
      case 'bybit':
        return (
          <span className="font-black text-[10px] bg-[#F7A600] text-black px-1.5 py-0.5 rounded uppercase tracking-tight">
            BYBIT
          </span>
        );
      case 'wu':
        return (
          <span className="font-black text-[9px] bg-[#FFCC00] text-black px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
            WESTERN UNION
          </span>
        );
      case 'usdt':
        return (
          <span className="font-black text-[11px] text-[#26A17B] bg-[#26A17B]/20 px-1.5 py-0.5 rounded border border-[#26A17B]/40">
            ₮ USDT
          </span>
        );
      case 'yape':
        return (
          <span className="font-black text-[9px] bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-1.5 py-0.5 rounded shadow-sm">
            YAPE / PLIN
          </span>
        );
      case 'card':
        return (
          <span className="font-black text-[9px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-1.5 py-0.5 rounded flex items-center space-x-1">
            <svg className="h-3 w-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
              <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
            </svg>
            <span>TARJETAS</span>
          </span>
        );
      case 'mercadopago':
        return (
          <span className="font-black text-[9px] bg-[#009EE3] text-white px-1.5 py-0.5 rounded">
            MERCADO PAGO
          </span>
        );
      case 'airtm':
        return (
          <span className="font-black text-[9px] bg-[#0066FF] text-white px-1.5 py-0.5 rounded font-mono">
            AIRTM
          </span>
        );
      case 'zelle':
        return (
          <span className="font-black text-[9px] bg-[#7414CA] text-white px-1.5 py-0.5 rounded font-mono">
            ZELLE
          </span>
        );
      case 'bank':
        return (
          <span className="font-black text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded flex items-center space-x-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
            </svg>
            <span>BANCO</span>
          </span>
        );
      default:
        return <ShieldCheck className="h-3.5 w-3.5 text-gray-300" />;
    }
  };

  const pad = size === 'sm' ? 'py-1 px-2.5 text-[11px]' : size === 'lg' ? 'py-2 px-4 text-xs' : 'py-1.5 px-3 text-xs';

  return (
    <div className={`inline-flex items-center space-x-2 rounded-xl border font-black ${method.badgeBg} ${method.borderColor} ${method.textColor} ${pad} shadow-md transition-all hover:scale-105 cursor-default`}>
      {renderIcon()}
      {showFullName && (
        <span className="tracking-wide text-white/90 text-[11px] font-extrabold">{method.shortName}</span>
      )}
    </div>
  );
};
