/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order } from '../types';
import { 
  Receipt, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Phone, 
  ShieldCheck, 
  X,
  ExternalLink,
  ShoppingBag,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BoletaModalProps {
  order: Order | null;
  onClose: () => void;
}

const SUPPORT_WHATSAPP = "51906328464";
const SUPPORT_PHONE_DISPLAY = "+51 906328464";
const USD_TO_PEN = 3.70;

export const BoletaModal: React.FC<BoletaModalProps> = ({ order, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const totalPen = (order.total * USD_TO_PEN).toFixed(2);
  const boletaCode = order.boletaNumber || `BOL-${order.id.replace('ORD_', '')}`;
  const formattedDate = new Date(order.createdAt).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Construct structured WhatsApp Message for Boleta
  const whatsappText = `🧾 *BOLETA DIGITAL DE COMPRA #${boletaCode}*
----------------------------------------
👤 *Cliente:* ${order.userName}
📱 *WhatsApp Comprador:* ${order.userPhone || 'No especificado'}
📅 *Fecha:* ${formattedDate}
💳 *Método de Pago:* ${order.paymentMethod.toUpperCase()}
----------------------------------------
🛍️ *DETALLE DE PRODUCTOS:*
${order.items.map(item => `▪️ ${item.quantity}x ${item.productTitle} (${item.productType.toUpperCase()}) -> $${(item.price * item.quantity).toFixed(2)} USD`).join('\n')}

💰 *TOTAL A PAGAR:* $${order.total.toFixed(2)} USD (Aprox S/ ${totalPen} PEN)
🎁 *Puntos Ganados:* +${order.pointsEarned} pts
----------------------------------------
🔒 *Atención al Cliente:* ${SUPPORT_PHONE_DISPLAY}
¡Hola! Acabo de realizar esta compra en la web FF Market Pro y adjunto mi boleta para coordinar la entrega inmediata de mis ítems.`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${SUPPORT_WHATSAPP}&text=${encodeURIComponent(whatsappText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Boleta_Compra_${boletaCode}_FFMarketPro</title>
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
                body {
                  padding: 12px;
                  margin: 0;
                  background-color: #0b0f19 !important;
                  color: #ffffff !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .no-print { display: none !important; }
                .ticket-box {
                  background-color: #070b12 !important;
                  color: #ffffff !important;
                  border: 2px solid #00d2ff !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body class="bg-[#0b0f19] text-white">
            <div class="max-w-xl mx-auto border border-cyan-500/50 rounded-2xl p-6 bg-[#070b12] shadow-2xl ticket-box font-mono space-y-4">
              <div class="flex justify-between items-center border-b border-white/20 pb-4">
                <div class="flex items-center space-x-3">
                  <img src="https://github.com/luqueSmith/FreFire/blob/main/img/logo_ff.png?raw=true" alt="FF Market Pro" class="h-12 w-auto object-contain" />
                  <div>
                    <h1 class="text-xl font-black text-cyan-400 tracking-wider">🔥 FF MARKET PRO</h1>
                    <p class="text-[10px] text-gray-400 font-bold uppercase">COMPROBANTE OFICIAL DE GARANTÍA</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sm font-black text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">${boletaCode}</span>
                  <p class="text-[10px] text-gray-400 mt-1">${formattedDate}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs border-b border-white/10 pb-3">
                <div>
                  <span class="text-gray-400 block text-[9px] uppercase">Cliente:</span>
                  <span class="text-white font-bold">${order.userName}</span>
                </div>
                <div>
                  <span class="text-gray-400 block text-[9px] uppercase">WhatsApp Cliente:</span>
                  <span class="text-emerald-400 font-bold">${order.userPhone || SUPPORT_PHONE_DISPLAY}</span>
                </div>
              </div>

              <div class="space-y-2">
                <span class="text-gray-400 block text-[10px] uppercase font-bold">Detalle de Productos Adquiridos</span>
                ${order.items.map(item => `
                  <div class="flex justify-between items-center bg-white/5 p-2 rounded text-xs">
                    <div>
                      <p class="text-white font-bold">${item.productTitle}</p>
                      <p class="text-[10px] text-gray-400">${item.productType.toUpperCase()} x${item.quantity}</p>
                    </div>
                    <span class="text-cyan-400 font-bold">$${(item.price * item.quantity).toFixed(2)} USD</span>
                  </div>
                `).join('')}
              </div>

              <div class="pt-3 border-t border-white/20 space-y-1">
                <div class="flex justify-between text-xs text-gray-400">
                  <span>Método de Pago:</span>
                  <span class="text-white font-bold">${order.paymentMethod.toUpperCase()}</span>
                </div>
                <div class="flex justify-between text-xs text-gray-400">
                  <span>Vendedor / Central WhatsApp:</span>
                  <span class="text-emerald-400 font-bold">${SUPPORT_PHONE_DISPLAY}</span>
                </div>
                <div class="flex justify-between text-base font-black pt-2 border-t border-white/10 text-white">
                  <span>TOTAL PAGADO:</span>
                  <span class="text-cyan-400">$${order.total.toFixed(2)} USD (S/ ${totalPen} PEN)</span>
                </div>
              </div>

              <div class="text-center pt-3 border-t border-white/10 text-[10px] text-gray-400">
                <p>✅ Garantía Oficial de Seguridad FF Market Pro</p>
                <p>Atención al cliente 24/7 en WhatsApp ${SUPPORT_PHONE_DISPLAY}</p>
              </div>
            </div>

            <div class="no-print mt-6 text-center">
              <button onclick="window.print();" style="background:#10b981; color:black; font-weight:900; padding:12px 28px; border-radius:12px; border:none; cursor:pointer; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 15px rgba(16,185,129,0.4);">
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#0d131f] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.2)] overflow-hidden text-left my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black/20 rounded-xl border border-white/20">
                <Receipt className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-200 uppercase font-black block">Comprobante Oficial</span>
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white">Boleta de Compra Digital</h3>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5 text-xs">
            {/* Status notification */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl p-3 flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-300">¡Pago Generado con Éxito!</p>
                <p className="text-[11px] text-emerald-400/90 mt-0.5">
                  Haz clic en el botón de abajo para enviar tu boleta por WhatsApp al <strong>{SUPPORT_PHONE_DISPLAY}</strong> y recibir tus cuentas o diamantes en minutos.
                </p>
              </div>
            </div>

            {/* Receipt Inner Ticket Paper Style */}
            <div className="bg-[#070b12] border border-white/10 rounded-xl p-4 sm:p-5 font-mono space-y-4 shadow-inner">
              
              {/* Ticket Top Info */}
              <div className="flex justify-between items-start border-b border-dashed border-white/15 pb-3">
                <div>
                  <p className="text-cyan-400 font-bold text-sm tracking-wider">{boletaCode}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Orden: {order.id}</p>
                </div>
                <div className="text-right">
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-cyan-500/30">
                    {order.paymentMethod}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{formattedDate}</p>
                </div>
              </div>

              {/* Customer & Contact Info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-dashed border-white/15 pb-3">
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-sans font-bold">Comprador</span>
                  <span className="text-white font-bold block truncate">{order.userName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase font-sans font-bold">WhatsApp Cliente</span>
                  <span className="text-emerald-400 font-bold block truncate">{order.userPhone || SUPPORT_PHONE_DISPLAY}</span>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-2">
                <span className="text-gray-500 block text-[9px] uppercase font-sans font-bold">Detalle de Productos</span>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded text-[11px]">
                    <div className="pr-2 min-w-0">
                      <p className="text-white font-bold truncate">{item.productTitle}</p>
                      <p className="text-[9px] text-gray-400">{item.productType.toUpperCase()} x{item.quantity}</p>
                    </div>
                    <span className="text-cyan-400 font-bold whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)} USD
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="pt-2 border-t border-dashed border-white/15 space-y-1">
                <div className="flex justify-between text-gray-400 text-[11px]">
                  <span>Atención & Soporte WhatsApp:</span>
                  <span className="text-emerald-400 font-bold">{SUPPORT_PHONE_DISPLAY}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-[11px]">
                  <span>Puntos de Recompensa:</span>
                  <span className="text-yellow-400 font-bold flex items-center">
                    <Coins className="h-3 w-3 mr-1" /> +{order.pointsEarned} pts
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black pt-2 border-t border-white/10 text-white">
                  <span>TOTAL NETO:</span>
                  <div className="text-right">
                    <span className="text-cyan-400 text-glow-blue block">${order.total.toFixed(2)} USD</span>
                    <span className="text-[10px] text-gray-400 font-normal block">(Aprox. S/ {totalPen} PEN)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* DIRECT WHATSAPP ACTION BUTTON */}
            <div className="space-y-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center space-x-2 border border-emerald-300/40 cursor-pointer"
              >
                <Phone className="h-5 w-5 animate-pulse" />
                <span>Enviar Boleta por WhatsApp ({SUPPORT_PHONE_DISPLAY})</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleCopy}
                  className="py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 hover:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-cyan-400" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 hover:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Printer className="h-4 w-4 text-purple-400" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-500 pt-1 border-t border-white/5 flex items-center justify-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Garantía de Seguridad FF Market Pro | Teléfono Central {SUPPORT_PHONE_DISPLAY}</span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
