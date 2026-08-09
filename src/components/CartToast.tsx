/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useAppContext } from '../store';
import { ShoppingCart, Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartToast: React.FC = () => {
  const { cartToast, dismissCartToast, setIsCartOverlayOpen, cart } = useAppContext();

  useEffect(() => {
    if (cartToast?.show) {
      const timer = setTimeout(() => {
        dismissCartToast();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [cartToast, dismissCartToast]);

  if (!cartToast?.show) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={cartToast.timestamp || cartToast.title}
        initial={{ opacity: 0, y: 60, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0a1222]/95 border-2 border-cyan-400/60 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,210,255,0.4)] text-left backdrop-blur-xl ring-2 ring-cyan-500/20"
      >
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-center space-x-3">
            {cartToast.image ? (
              <div className="relative h-12 w-12 rounded-xl overflow-hidden border-2 border-cyan-400/60 flex-shrink-0 bg-black">
                <img src={cartToast.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 shadow-md">
                  <Check className="h-2.5 w-2.5 text-black stroke-[3]" />
                </div>
              </div>
            ) : (
              <div className="h-12 w-12 rounded-xl bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                <ShoppingCart className="h-6 w-6 text-cyan-300 animate-bounce" />
              </div>
            )}
            
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center space-x-1 shadow-sm">
                  <Sparkles className="h-3 w-3 text-emerald-300 animate-spin" />
                  <span>¡AGREGADO AL CARRITO!</span>
                </span>
                <span className="text-[10px] text-cyan-300 font-bold">({cart.length} en total)</span>
              </div>
              <p className="text-xs font-black text-white mt-1.5 line-clamp-1 tracking-tight">
                {cartToast.title}
              </p>
            </div>
          </div>

          <button
            onClick={dismissCartToast}
            className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2 mt-3 pt-2.5 border-t border-white/10">
          <button
            onClick={() => {
              dismissCartToast();
              setIsCartOverlayOpen(true);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(0,210,255,0.3)] transition-all"
          >
            <span>Ver Carrito ({cart.length})</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
          
          <button
            onClick={dismissCartToast}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-all border border-white/10"
          >
            Seguir
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
