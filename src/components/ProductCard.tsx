/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useAppContext } from '../store';
import { ProfileAvatar } from './ProfileAvatar';
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  ShoppingCart,
  User,
  ShieldCheck,
  Server,
  Sparkles,
  Layers,
  Flame,
  Tv,
  Check,
  Gamepad2,
  Gem,
  Zap,
  Key
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    isLoggedIn,
    favorites,
    toggleFavorite,
    likeProduct,
    dislikeProduct,
    addToCart,
    setActiveView,
    reportSellerOrProduct,
    cart,
    sellersList
  } = useAppContext();

  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [reportType, setReportType] = useState<'scam' | 'fake_account' | 'spam' | 'other'>('scam');
  const [reportReason, setReportReason] = useState('');

  const isFavorited = favorites.includes(product.id);
  const isInCart = cart.some(item => item.id === product.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión con tu cuenta para dar 'Me Gusta'.");
      setActiveView('login');
      return;
    }
    if (hasLiked) {
      likeProduct(product.id, true);
      setHasLiked(false);
    } else {
      if (hasDisliked) {
        dislikeProduct(product.id, true);
        setHasDisliked(false);
      }
      likeProduct(product.id, false);
      setHasLiked(true);
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión con tu cuenta para calificar.");
      setActiveView('login');
      return;
    }
    if (hasDisliked) {
      dislikeProduct(product.id, true);
      setHasDisliked(false);
    } else {
      if (hasLiked) {
        likeProduct(product.id, true);
        setHasLiked(false);
      }
      dislikeProduct(product.id, false);
      setHasDisliked(true);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión para guardar productos en Favoritos.");
      setActiveView('login');
      return;
    }
    toggleFavorite(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión para realizar compras o agregar al carrito.");
      setActiveView('login');
      return;
    }
    addToCart(product);
  };

  const submitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("🔒 Debes iniciar sesión para enviar un reporte.");
      setActiveView('login');
      return;
    }
    if (!reportReason.trim()) return;
    reportSellerOrProduct(reportType, reportReason, product.sellerId, product.id);
    setShowReportConfirm(false);
    setReportReason('');
  };

  return (
    <div 
      id={`prod_card_${product.id}`}
      className="group relative flex flex-col rounded-lg overflow-hidden bg-[#111111] border border-[#00d2ff]/10 hover:border-neon-blue/35 transition-all duration-300 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.8)]"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.tried) {
                target.dataset.tried = 'true';
                target.src = product.type === 'diamante' 
                  ? "https://raw.githubusercontent.com/luqueSmith/FreFire/main/img/venta-diamantes.png"
                  : "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80";
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0a192f] to-[#001122] flex flex-col items-center justify-center p-4 border-b border-[#00d2ff]/25">
            <Gem className="h-10 w-10 text-neon-blue animate-pulse mb-1 text-glow-blue" />
            <span className="text-[10px] font-black tracking-widest text-neon-blue uppercase text-glow-blue">OFERTA DE DIAMANTES</span>
            <span className="text-[9px] text-gray-400 mt-0.5 uppercase font-bold text-center">RECARGA SOLO CON ID</span>
          </div>
        )}

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Favorite absolute button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all ${
            isFavorited 
              ? 'bg-[#ff007f] text-white' 
              : 'bg-black/40 text-gray-400 hover:text-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Type Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1">
          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded flex items-center gap-1 ${
            product.type === 'cuenta' ? 'bg-[#9d50bb] text-white' :
            product.type === 'diamante' ? 'bg-[#00d2ff] text-black font-black' :
            product.type === 'recarga' ? 'bg-[#ff007f] text-white' : 
            product.type === 'hack' ? 'bg-emerald-500 text-black font-black' : 'bg-yellow-500 text-black'
          }`}>
            {product.type === 'cuenta' ? (
              <>
                <Gamepad2 className="h-3 w-3" />
                <span>Cuenta</span>
              </>
            ) : product.type === 'diamante' ? (
              <>
                <Gem className="h-3 w-3" />
                <span>Diamantes</span>
              </>
            ) : product.type === 'recarga' ? (
              <>
                <Zap className="h-3 w-3" />
                <span>Recarga</span>
              </>
            ) : product.type === 'hack' ? (
              <>
                <Key className="h-3 w-3" />
                <span>Hack</span>
              </>
            ) : (
              <>
                <Flame className="h-3 w-3" />
                <span>Combo Oferta</span>
              </>
            )}
          </span>
          {product.isFeatured && (
            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex items-center">
              <Sparkles className="h-2.5 w-2.5 mr-0.5 animate-spin" />
              DESTACADO
            </span>
          )}
        </div>

        {/* Specs absolute footer overlays (Level, Server) */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 text-[10px]">
          {product.level && (
            <span className="bg-black/60 backdrop-blur-sm text-gray-200 px-2 py-0.5 rounded border border-white/5 font-bold flex items-center">
              <Layers className="h-3 w-3 text-neon-purple mr-1" />
              Nivel {product.level}
            </span>
          )}
          <span className="bg-black/60 backdrop-blur-sm text-gray-200 px-2 py-0.5 rounded border border-white/5 font-bold flex items-center">
            <Server className="h-3 w-3 text-neon-blue mr-1" />
            {product.server}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-3.5">
        
        {/* Seller Info */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
          {(() => {
            const matchedSeller = sellersList.find(s => s.id === product.sellerId);
            const sellerFrame = matchedSeller?.frame || 'none';
            return (
              <button 
                onClick={() => setActiveView('public_seller', product.sellerId)}
                className="flex items-center space-x-2 hover:text-neon-blue transition-colors text-left"
              >
                <ProfileAvatar url={product.sellerAvatar} frame={sellerFrame} size="xs" />
                <span className="font-bold truncate max-w-[100px]">{product.sellerName}</span>
              </button>
            );
          })()}
          <div className="flex items-center text-yellow-400">
            <Sparkles className="h-3 w-3 mr-0.5 fill-current" />
            <span className="font-bold">4.9</span>
          </div>
        </div>

        {/* Title & Tags */}
        <h4 className="text-sm font-bold text-gray-100 hover:text-neon-blue cursor-pointer transition-colors line-clamp-1 mb-1" onClick={() => setActiveView('marketplace', null, product.id)}>
          {product.title}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px] mb-2.5">
          {product.description}
        </p>

        {/* Category Features / Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="bg-[#181818] text-gray-400 text-[9px] px-1.5 py-0.5 rounded border border-white/5">
              #{tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 my-2" />

        {/* Reactions & Stock Bar */}
        <div className="flex items-center justify-between text-[10px] mb-2">
          <span className="text-gray-400 font-medium">Stock: {product.stock} un.</span>
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleLike}
              className={`px-2 py-0.5 rounded text-[10px] transition-all flex items-center space-x-1 ${
                hasLiked 
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
              title={hasLiked ? "Quitar Me Gusta" : "Dar Me Gusta"}
            >
              <ThumbsUp className="h-2.5 w-2.5" />
              <span>{product.likes}</span>
            </button>

            <button 
              onClick={handleDislike}
              className={`px-2 py-0.5 rounded text-[10px] transition-all flex items-center space-x-1 ${
                hasDisliked 
                  ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
              title={hasDisliked ? "Quitar No Me Gusta" : "Dar No Me Gusta"}
            >
              <ThumbsDown className="h-2.5 w-2.5" />
              <span>{product.dislikes || 0}</span>
            </button>
          </div>
        </div>

        {/* Price & Primary Purchase Action */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            {product.previousPrice && (
              <span className="text-[10px] text-gray-500 line-through">
                ${product.previousPrice.toFixed(2)}
              </span>
            )}
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-black text-white text-glow-blue">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercent && (
                <span className="text-[9px] font-bold bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/20 px-1 rounded">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isInCart}
            className={`px-3.5 py-1.5 text-xs font-black rounded-lg flex items-center space-x-1.5 uppercase tracking-wider transition-all whitespace-nowrap shadow-md ${
              isInCart 
                ? 'bg-emerald-600 text-white shadow-md cursor-default'
                : product.stock <= 0
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'btn-neon-blue'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="h-3.5 w-3.5 mr-0.5" />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Comprar</span>
              </>
            )}
          </button>
        </div>

        {/* Report icon trigger */}
        <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2.5">
          <span>Publicado: hace 2 días</span>
          <button 
            onClick={() => setShowReportConfirm(!showReportConfirm)}
            className="text-gray-500 hover:text-red-400 transition-colors flex items-center space-x-0.5"
            title="Reportar Publicación"
          >
            <Flag className="h-2.5 w-2.5" />
            <span>Reportar</span>
          </button>
        </div>

        {/* Report Modal Popover */}
        {showReportConfirm && (
          <div className="absolute inset-x-0 bottom-0 bg-[#0c0c0c] border-t border-white/10 p-3.5 z-20 rounded-b-xl animate-slide-up shadow-2xl">
            <h5 className="text-xs font-bold text-red-400 mb-2">Reportar Publicación</h5>
            <form onSubmit={submitReport} className="space-y-2">
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full bg-[#111111] text-xs text-white rounded border border-white/10 p-1"
              >
                <option value="scam">Estafa o Fraude</option>
                <option value="fake_account">Cuenta o Datos Falsos</option>
                <option value="spam">Contenido Spam / Repetitivo</option>
                <option value="other">Otro Motivo</option>
              </select>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Explica brevemente el motivo..."
                className="w-full bg-[#111111] text-xs text-white rounded border border-white/10 p-1 h-12 resize-none"
                required
              />
              <div className="flex justify-end space-x-1.5">
                <button 
                  type="button" 
                  onClick={() => setShowReportConfirm(false)}
                  className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded text-[10px]"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                >
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
