/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../store';
import { UserRole } from '../types';
import { ProfileAvatar } from './ProfileAvatar';
import {
  Flame,
  ShoppingCart,
  User,
  Shield,
  Coins,
  Gem,
  LogOut,
  ChevronDown,
  Trash,
  CheckCircle,
  Gamepad2,
  Globe,
  Star,
  Phone
} from 'lucide-react';

interface NavbarProps {
  onOpenCartModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCartModal }) => {
  const {
    isLoggedIn,
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    userProfile,
    sellerProfile,
    cart,
    removeFromCart,
    checkout,
    pointPackages,
    logout
  } = useAppContext();

  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (showCartDropdown && cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCartDropdown(false);
      }
      if (showUserDropdown && userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showCartDropdown, showUserDropdown]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Divide nav items for pristine desktop layout density
  const primaryNavItems = [
    { label: 'Cuentas', view: 'marketplace' },
    { label: 'Diamantes', view: 'diamantes' },
    { label: 'Evolutivas', view: 'recargas' },
    { label: 'Ofertas', view: 'ofertas' },
    { label: 'Hacks', view: 'hacks' },
    { label: 'Vendedores', view: 'sellers' },
  ];

  const handleCheckout = () => {
    setShowCartDropdown(false);
    if (onOpenCartModal) {
      onOpenCartModal();
    }
  };

  return (
    <header id="main_navbar" className="sticky top-0 z-50 w-full border-b border-neon-blue/15 bg-[#111111]/95 backdrop-blur-md">
      <div className="mx-auto flex py-2 sm:py-3 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <div 
          onClick={() => setActiveView('home')}
          className="flex cursor-pointer items-center space-x-3 group flex-shrink-0"
        >
          <img 
            src="https://github.com/luqueSmith/FreFire/blob/main/img/logo_ff.png?raw=true" 
            alt="Logo FF" 
            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <span className="text-sm sm:text-base md:text-lg font-black tracking-wider text-white">
            FF<span className="text-neon-blue text-glow-blue font-black"> MARKET</span><span className="text-neon-purple font-black text-[9px] ml-1 bg-neon-purple/10 px-1.5 py-0.5 rounded border border-neon-purple/20">PRO</span>
          </span>
        </div>

        {/* DESKTOP NAVIGATION LINKS */}
        {activeView === 'seller_storefront' ? (
          /* Clean Mini-Web mode - no extra options, only FF Market logo & essential controls */
          <div className="hidden lg:flex items-center space-x-2">
            <span className="bg-neon-purple/20 border border-neon-purple/40 text-neon-purple px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Tienda Oficial</span>
            </span>
          </div>
        ) : (
          <nav className="hidden lg:flex items-center space-x-1">
            {primaryNavItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    setActiveView(item.view);
                  }}
                  className={`relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all rounded-md border ${
                    isActive 
                      ? 'text-neon-blue bg-neon-blue/10 border-neon-blue/20 shadow-[0_0_10px_rgba(0,210,255,0.05)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* RIGHT ACTIONS */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          
          {!isLoggedIn ? (
            <button
              onClick={() => setActiveView('login')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-[10px] sm:text-xs font-bold hover:bg-neon-blue/20 transition-all uppercase tracking-wider"
            >
              <Gamepad2 className="h-3.5 w-3.5 text-neon-blue mr-1 animate-pulse" />
              <span>Acceder</span>
            </button>
          ) : (
            <>
              {/* Hide Seller & Account Balance Chips when customer is browsing in Mini-Web Storefront view */}
              {activeView !== 'seller_storefront' && (
                <>
                  {/* PURPLE SELLER CREDITS CHIP (Cr) - ONLY VISIBLE TO VENDEDORES */}
                  {currentRole === 'Vendedor' && (
                    <div 
                      onClick={() => {
                        setActiveView('dashboard_seller');
                        window.location.hash = 'buy-seller-credits';
                        setTimeout(() => {
                          const el = document.getElementById('buy-seller-credits-section');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 200);
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181224] border border-neon-purple/40 text-xs text-neon-purple font-extrabold cursor-pointer hover:bg-neon-purple/20 hover:border-neon-purple transition-all shadow-[0_0_12px_rgba(168,85,247,0.25)] animate-neon-pulse"
                      title="Tus Créditos de Vendedor (Cr) - Haz clic para Comprar Créditos"
                    >
                      <Gem className="h-4 w-4 text-neon-purple" />
                      <span>Créditos: {sellerProfile.points} Cr</span>
                    </div>
                  )}
                </>
              )}

          {/* SHOPPING CART ICON & DROPDOWN */}
          <div ref={cartRef} className="relative">
            <button
              onClick={() => {
                if (onOpenCartModal) {
                  onOpenCartModal();
                  setShowCartDropdown(false);
                } else {
                  setShowCartDropdown(!showCartDropdown);
                }
              }}
              className="p-2 rounded-md hover:bg-white/5 text-gray-400 hover:text-white transition-colors relative"
              title="Ver Carrito y Enviar Pedido"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#00d2ff] text-[9px] font-bold text-[#090909] glow-blue">
                  {cart.length}
                </span>
              )}
            </button>
            {showCartDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#111111] shadow-2xl z-50 p-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                  <span className="text-sm font-bold text-white flex items-center space-x-1">
                    <ShoppingCart className="h-4 w-4 text-neon-blue" />
                    <span>Carrito de Compras</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{cart.length} artículo(s)</span>
                    <button 
                      onClick={() => setShowCartDropdown(false)} 
                      className="text-gray-400 hover:text-white font-black text-sm px-1.5 py-0.5 hover:bg-white/5 rounded transition-all"
                      title="Cerrar"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-500">
                    Tu carrito está vacío. ¡Explora el marketplace!
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs bg-white/2 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <img src={item.product.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                            <div className="max-w-[130px] overflow-hidden">
                              <p className="font-semibold text-white truncate">{item.product.title}</p>
                              <p className="text-[10px] text-gray-400">Servidor: {item.product.server}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-neon-blue">${(item.product.price * item.quantity).toFixed(2)}</span>
                            <div className="flex items-center space-x-1.5 mt-1">
                              <span className="text-[9px] text-gray-500">Cant: {item.quantity}</span>
                              <button 
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-gray-500 hover:text-red-400 transition-colors"
                              >
                                <Trash className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">Subtotal:</span>
                      <span className="text-sm font-black text-white">${cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full text-center py-2 text-xs font-bold rounded bg-gradient-to-r from-neon-blue to-blue-600 hover:from-neon-purple hover:to-purple-600 text-white transition-all shadow-md glow-blue hover:glow-purple uppercase tracking-wider"
                    >
                      Verificar Carrito
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* USER AVATAR WITH DROPDOWN ACCESS */}
          <div ref={userRef} className="relative flex-shrink-0">
            <div 
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowCartDropdown(false);
                setShowMoreDropdown(false);
              }}
              className="flex items-center pl-3 border-l border-white/10 cursor-pointer group flex-shrink-0 hover:scale-105 transition-transform duration-200"
              title="Menú de Usuario"
            >
              <ProfileAvatar
                url={userProfile.avatar}
                frame={userProfile.frame}
                size="md"
              />
            </div>
            
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-white/10 bg-[#111111] p-1 shadow-2xl glow-blue animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1 text-left flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-white truncate">{userProfile.username}</p>
                    <p className="text-[8px] text-gray-500 font-mono">ID: {userProfile.id}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-[8px] px-1.5 py-0.2 rounded font-extrabold uppercase bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                        {currentRole}
                      </span>
                      <span className="text-[8px] text-yellow-400 font-bold">Lv {userProfile.level}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowUserDropdown(false)} 
                    className="text-gray-400 hover:text-white font-black text-sm px-1.5 py-0.5 hover:bg-white/5 rounded transition-all ml-2"
                    title="Cerrar"
                  >
                    ✕
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setActiveView(currentRole === 'Vendedor' ? 'dashboard_seller' : currentRole === 'Administrador' ? 'dashboard_admin' : 'dashboard_user');
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-neon-blue" />
                  <span>Ir a mi Panel</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('login');
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Gamepad2 className="h-3.5 w-3.5 text-[#00d2ff]" />
                  <span>Cambiar Cuenta</span>
                </button>

                <div className="border-t border-white/5 my-1" />

                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
          </>
          )}

        </div>
      </div>

      {/* MOBILE NAV (SCROLLABLE ON SMALL SCREENS) */}
      {activeView !== 'seller_storefront' && (
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto px-4 py-2 border-t border-[#00d2ff]/10 bg-[#111111] scrollbar-none">
          {primaryNavItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`whitespace-nowrap px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all rounded-md flex-shrink-0 ${
                  isActive 
                    ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/30 shadow-[0_0_8px_rgba(0,210,255,0.15)]' 
                    : 'text-gray-400 hover:text-white bg-[#181818]/50 border border-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
