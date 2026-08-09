/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store';
import {
  User,
  Heart,
  ShoppingBag,
  Gift,
  MessageSquare,
  LifeBuoy,
  Flame,
  Award,
  Coins,
  Send,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  Check,
  Receipt,
  Phone,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';
import { ProfileAvatar } from './ProfileAvatar';
import { BoletaModal } from './BoletaModal';
import { Order } from '../types';

const AVATAR_LIST = [
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-01.png?raw=true",
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-02.png?raw=true",
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-03.png?raw=true",
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-04.png?raw=true",
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-05.png?raw=true",
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-06.png?raw=true",
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-07.png?raw=true",
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-08.png?raw=true",
  "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-09.png?raw=true"
];

const FRAMES_LIST = [
  { id: 'none', label: 'Sin Marco', description: 'Borde básico de usuario' },
  { id: 'cyan', label: 'Neon Cyan ⚡', description: 'Fuerza Azul - Brillante' },
  { id: 'heroic', label: 'Heroico 🔥', description: 'Fuego Rojo - Rango FF' },
  { id: 'sakura', label: 'Sakura 🌸', description: 'Púrpura - Edición Especial' },
  { id: 'gold', label: 'Dorado Master 🏆', description: 'Oro de Garena - Campeón' },
  { id: 'evolutive', label: 'Evolutivo Cosmic ⭐', description: 'Arcoíris - Efecto Giro' }
];

export const UserDashboard: React.FC = () => {
  const {
    userProfile,
    adminUpdateUser,
    favorites,
    products,
    orders,
    dailyStreak,
    claimDailyReward,
    dailyMissions,
    claimMissionReward,
    addReferral,
    conversations,
    messages,
    sendMessage,
    supportTickets,
    addSupportTicket,
    activeChatConvId,
    setActiveChatConvId,
    setActiveView
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'perfil' | 'compras' | 'soporte'>('perfil');
  const [selectedBoletaOrder, setSelectedBoletaOrder] = useState<Order | null>(null);

  // Filter orders so user only sees purchases approved by seller with official boleta
  const approvedOrders = orders.filter(o => o.status === 'completed' || Boolean(o.boletaNumber));

  // Profile forms
  const [username, setUsername] = useState(userProfile.username);
  const [phone, setPhone] = useState(userProfile.phone || '+51 906328464');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatar || "https://github.com/luqueSmith/FreFire/blob/main/img/perfil/perfil-01.png?raw=true");
  const [frame, setFrame] = useState(userProfile.frame || 'none');
  const [password, setPassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Referral form
  const [refEmail, setRefEmail] = useState('');
  const [refMessage, setRefMessage] = useState('');

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Chat/Messages states
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');

  useEffect(() => {
    if (activeChatConvId) {
      setActiveTab('mensajes');
      setSelectedConvId(activeChatConvId);
      setActiveChatConvId(null);
    }
  }, [activeChatConvId, setActiveChatConvId]);
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateUser(userProfile.id, { username, phone, avatar: avatarUrl, frame });
    setProfileSuccess('¡Perfil actualizado con éxito!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleSendReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addReferral(refEmail);
    setRefMessage(res.message);
    if (res.success) setRefEmail('');
    setTimeout(() => setRefMessage(''), 4000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;
    addSupportTicket(ticketSubject, ticketMsg);
    setTicketSuccess('Ticket creado con éxito. Un administrador lo revisará.');
    setTicketSubject('');
    setTicketMsg('');
    setTimeout(() => setTicketSuccess(''), 4000);
  };

  // Favorites data filtering
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div id="user_panel" className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      
      {/* Side Tabs Navigation */}
      <div className="lg:col-span-1 flex flex-col space-y-3">
        
        {/* Profile Card (Horizontal row on mobile, vertical box on desktop) */}
        <div className="glass-panel rounded-lg p-3 border border-[#00d2ff]/15 bg-[#111111] flex flex-row items-center justify-between lg:flex-col lg:text-center gap-3">
          <div className="flex items-center space-x-3 lg:block lg:space-x-0 text-left lg:text-center">
            <div className="relative inline-block flex-shrink-0">
              <ProfileAvatar 
                url={userProfile.avatar} 
                frame={userProfile.frame} 
                size="lg"
                className="mx-auto"
              />
              <span className="absolute -bottom-1 -right-1 bg-neon-blue text-black font-extrabold text-[8px] lg:text-[9px] px-1 py-0.2 lg:px-1.5 lg:py-0.5 rounded-full z-10">
                Lv {userProfile.level}
              </span>
            </div>
            <div className="text-left lg:text-center mt-1 min-w-0">
              <h3 className="text-xs font-black uppercase tracking-wider text-white truncate max-w-[130px] lg:max-w-none">{userProfile.username}</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[130px] lg:max-w-none">{userProfile.email}</p>
            </div>
          </div>
          
          <a 
            href="https://api.whatsapp.com/send?phone=51906328464&text=Hola,%20quisiera%20consultar%20sobre%20mis%20compras%20o%20boletas%20en%20FF%20Market%20Pro."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded px-2.5 py-1.5 lg:py-1 text-[11px] font-bold flex-shrink-0 lg:w-full lg:justify-center hover:bg-emerald-500/20 transition-all"
            title="Atención Directa y Pagos Privados por WhatsApp +51 906328464"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="font-extrabold">Pagos Privados: +51 906328464</span>
          </a>
        </div>

        {/* Desktop Tabs list (visible only on desktop/laptop screens) */}
        <div className="hidden lg:flex glass-panel rounded-lg p-1.5 border border-white/5 bg-[#111111] flex-col">
          {[
            { id: 'perfil', label: 'Mi Perfil y Premios', icon: User },
            { id: 'compras', label: 'Mis Compras y Boletas', icon: ShoppingBag, count: approvedOrders.length },
            { id: 'soporte', label: 'Soporte y WhatsApp', icon: Phone, count: supportTickets.filter(t => t.status === 'open').length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-between px-3.5 py-2.5 my-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all text-left ${
                  isSel 
                    ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-[#111111] text-emerald-400 border border-emerald-500/30 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Tabs navigation (horizontal scrollbar visible on small viewports) */}
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto p-1 bg-[#111111] border border-white/5 rounded-lg scrollbar-none">
          {[
            { id: 'perfil', label: 'Mi Perfil y Premios', icon: User },
            { id: 'compras', label: 'Mis Compras y Boletas', icon: ShoppingBag, count: approvedOrders.length },
            { id: 'soporte', label: 'Soporte y WhatsApp', icon: Phone, count: supportTickets.filter(t => t.status === 'open').length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0 border ${
                  isSel 
                    ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/30 shadow-[0_0_8px_rgba(0,210,255,0.15)]' 
                    : 'bg-[#181818]/40 text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-[#111111] text-neon-blue border border-neon-blue/20 text-[9px] px-1 rounded-full font-bold ml-1">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Content Pane */}
      <div className="lg:col-span-3">
             {/* TAB 1: USER PROFILE & REWARDS */}
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-6 text-left">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center">
                  <User className="h-5 w-5 text-neon-blue mr-2" />
                  Detalles de mi Perfil
                </h3>
                <p className="text-xs text-gray-400 mt-1">Configura tu alias, avatar y contraseña de acceso al mercado.</p>
              </div>

              {profileSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg p-3 text-xs flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {userProfile.role === 'Vendedor' && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg p-3.5 text-xs flex items-start space-x-2.5 mb-4 text-left">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block font-bold">Modificaciones de Vendedor Protegidas</strong>
                    <span className="text-[11px] text-gray-400">Como usuario verificado con rango Vendedor, no puedes editar tu nombre de usuario ni tu avatar desde este panel para asegurar la veracidad de tu identidad ante tus clientes.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Nombre de usuario (Garena ID)</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={userProfile.role === 'Vendedor'}
                    className={`w-full border border-white/10 rounded px-3 py-2 text-xs focus:outline-none ${
                      userProfile.role === 'Vendedor' 
                        ? 'bg-[#181818]/50 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#181818] text-white focus:border-neon-blue'
                    }`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Correo electrónico</label>
                  <input 
                    type="email" 
                    value={userProfile.email}
                    disabled
                    className="w-full bg-[#181818]/50 border border-white/10 rounded px-3 py-2 text-xs text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Enlace URL del Avatar</label>
                  <input 
                    type="url" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    disabled={userProfile.role === 'Vendedor'}
                    className={`w-full border border-white/10 rounded px-3 py-2 text-xs focus:outline-none ${
                      userProfile.role === 'Vendedor' 
                        ? 'bg-[#181818]/50 text-gray-500 cursor-not-allowed' 
                        : 'bg-[#181818] text-white focus:border-neon-blue'
                    }`}
                    required
                  />
                </div>

                {/* SELECCIONAR AVATAR SECTION */}
                <div className="md:col-span-2 space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[11px] font-bold text-[#00d2ff] uppercase tracking-widest block">
                        Seleccionar Avatar de Perfil
                      </label>
                      <p className="text-[9px] text-gray-400">Escoge un aspecto exclusivo para representarte en la comunidad</p>
                    </div>
                    {userProfile.role === 'Vendedor' && (
                      <span className="text-[10px] text-neon-purple font-semibold bg-neon-purple/10 px-2 py-0.5 rounded border border-neon-purple/20">Solo compradores</span>
                    )}
                  </div>
                  <div id="avatar_selector_grid" className="grid grid-cols-3 sm:grid-cols-9 gap-2 bg-[#09090d]/90 p-3 rounded-xl border border-white/5 backdrop-blur-md shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
                    {AVATAR_LIST.map((url, idx) => {
                      const isSelected = avatarUrl === url;
                      const isDisabled = userProfile.role === 'Vendedor';
                      return (
                        <motion.div
                          key={idx}
                          id={`avatar_card_${idx}`}
                          whileHover={isDisabled ? {} : { scale: 1.12, zIndex: 10 }}
                          whileTap={isDisabled ? {} : { scale: 0.95 }}
                          animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                          onClick={() => {
                            if (!isDisabled) {
                              setAvatarUrl(url);
                            }
                          }}
                          className={`relative p-1 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-white/2 border aspect-square ${
                            isDisabled ? 'opacity-30 cursor-not-allowed' : ''
                          } ${
                            isSelected
                              ? 'border-[#00d2ff] bg-gradient-to-b from-[#00d2ff]/10 to-[#00d2ff]/5 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                              : 'border-white/5 hover:border-neon-blue/40 hover:bg-white/5'
                          }`}
                        >
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center">
                            <img
                              src={url}
                              alt={`FF-${idx + 1}`}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-full aspect-square"
                              style={{ borderRadius: "50%" }}
                            />
                          </div>
                          <span className={`text-[8px] mt-1 font-mono tracking-wider font-extrabold ${isSelected ? 'text-[#00d2ff]' : 'text-gray-500'}`}>
                            FF-0{idx + 1}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 bg-gradient-to-r from-[#00d2ff] to-blue-600 text-black rounded-full p-0.5 shadow-[0_0_6px_rgba(0,210,255,0.8)] flex items-center justify-center z-15"
                            >
                              <Check className="h-2 w-2 stroke-[4]" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* SELECCIONAR MARCO SECTION */}
                <div className="md:col-span-2 space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[11px] font-bold text-neon-purple uppercase tracking-widest block">
                        Equipar Marco Cosmético
                      </label>
                      <p className="text-[9px] text-gray-400">Añade un aura de rango brillante a tu avatar de perfil</p>
                    </div>
                    <span className="text-[9px] bg-[#00d2ff]/10 text-[#00d2ff] px-2 py-0.5 rounded border border-[#00d2ff]/20 font-bold tracking-widest uppercase">Garena Pass</span>
                  </div>
                  
                  <div id="frame_selector_grid" className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-[#09090d]/90 p-3 rounded-xl border border-white/5 backdrop-blur-md shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
                    {FRAMES_LIST.map((f) => {
                      const isSelected = frame === f.id;
                      
                      // Rarity level theme setup
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
                          themeBg = "border-pink-500 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.35)]";
                          labelColor = "text-pink-400";
                        } else {
                          themeBg = "border-white/20 bg-white/5";
                          labelColor = "text-white";
                        }
                      }

                      return (
                        <motion.div
                          key={f.id}
                          id={`frame_card_${f.id}`}
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFrame(f.id)}
                          className={`relative p-2 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border backdrop-blur-sm ${themeBg}`}
                        >
                          {/* Live Avatar Preview with this specific frame */}
                          <div className="my-1">
                            <ProfileAvatar
                              url={avatarUrl}
                              frame={f.id}
                              size="sm"
                            />
                          </div>
                          
                          <div className="text-center min-w-0 w-full mt-1">
                            <span className={`text-[8px] font-black tracking-wider uppercase block truncate ${labelColor}`}>
                              {f.label.split(' ')[0]}
                            </span>
                          </div>

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 bg-gradient-to-r from-neon-blue to-blue-600 text-black rounded-full p-0.5 shadow-[0_0_6px_rgba(0,210,255,0.8)] flex items-center justify-center z-15"
                            >
                              <Check className="h-2 w-2 stroke-[4]" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-400 uppercase flex items-center space-x-1">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>Número de WhatsApp</span>
                  </label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+51 906328464"
                    className="w-full bg-[#181818] border border-emerald-500/40 rounded px-3 py-2 text-xs text-white font-bold focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Nueva contraseña</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dejar vacío para no cambiar"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-blue focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button 
                    type="submit"
                    className="btn-neon-blue px-5 py-2.5 rounded text-xs"
                  >
                    Guardar Perfil
                  </button>
                </div>
              </form>

              {/* Badges / Insignias */}
              <div className="border-t border-white/5 pt-5">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center">
                  <Award className="h-4 w-4 text-yellow-500 mr-2" />
                  Mis Medallas de Logros ({userProfile.badges.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userProfile.badges.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 bg-white/2 p-2.5 rounded-lg border border-white/5">
                      <div className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10" style={{ color: badge.color }}>
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{badge.name}</p>
                        <p className="text-[10px] text-gray-400">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily claim card */}
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] grid grid-cols-1 md:grid-cols-3 gap-5 items-center text-left">
              <div className="md:col-span-2 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded">Racha Diaria</span>
                <h3 className="text-lg font-black text-white">Recompensa Diaria de Fidelidad</h3>
                <p className="text-xs text-gray-400">Reclama tus puntos cada día. Multiplica tus premios manteniendo una racha ininterrumpida.</p>
                <div className="flex items-center space-x-1 text-xs text-yellow-400 mt-2">
                  <Flame className="h-4 w-4 text-[#ff007f] animate-bounce" />
                  <span className="font-black">Racha Actual: {dailyStreak.streak} días</span>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={claimDailyReward}
                  disabled={!dailyStreak.availableToday}
                  className={`w-full py-3.5 px-4 rounded text-xs font-black uppercase tracking-wider shadow-lg transition-all ${
                    dailyStreak.availableToday
                      ? 'btn-neon-blue animate-pulse'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {dailyStreak.availableToday ? `Reclamar +${dailyStreak.streak * 10} pts` : 'Ya reclamado hoy'}
                </button>
              </div>
            </div>

            {/* Daily Quests Board */}
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-4 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Misiones Diarias Disponibles
              </h3>
              <div className="space-y-3">
                {dailyMissions.map((m) => (
                  <div key={m.id} className="flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded bg-white/2 border border-white/5 text-xs gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-white">{m.title}</span>
                        {m.completed && !m.claimed && (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase px-1 rounded">Listo</span>
                        )}
                        {m.claimed && (
                          <span className="bg-gray-800 text-gray-500 text-[8px] font-black uppercase px-1 rounded">Reclamado</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-[11px]">{m.description}</p>
                      
                      {/* Custom progress bar */}
                      <div className="flex items-center space-x-2 pt-1.5">
                        <div className="w-28 bg-[#181818] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-neon-blue h-full transition-all" 
                            style={{ width: `${(m.progress / m.target) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold">{m.progress}/{m.target}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => claimMissionReward(m.id)}
                        disabled={!m.completed || m.claimed}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                          m.claimed
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : m.completed
                              ? 'btn-neon-blue'
                              : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {m.claimed ? 'Reclamado' : 'Canjear'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referrals Invite Friends */}
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-4 text-left">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                  <Gift className="h-4 w-4 text-[#ff007f] mr-1.5" />
                  Invita y Gana +50 puntos de Recompensa
                </h3>
                <p className="text-xs text-gray-400">Envía un correo de invitación a tus amigos de escuadra o gremio Free Fire. Cuando se unan, ambos recibirán puntos extra.</p>
              </div>

              {refMessage && (
                <div className="bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded p-2.5 text-xs">
                  {refMessage}
                </div>
              )}

              <form onSubmit={handleSendReferral} className="flex space-x-2">
                <input 
                  type="email" 
                  value={refEmail}
                  onChange={(e) => setRefEmail(e.target.value)}
                  placeholder="compañero@gremio.com"
                  className="flex-1 bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-blue focus:outline-none"
                  required
                />
                <button type="submit" className="btn-neon-blue px-4 text-xs font-bold uppercase tracking-wider">
                  Enviar Invitación
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: COMPRAS & FAVORITES */}
        {activeTab === 'compras' && (
          <div className="space-y-6">
            
            {/* Mis Guardados / Favoritos */}
            <div className="space-y-4">
              <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] text-left">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center">
                  <Heart className="h-5 w-5 text-[#ff007f] mr-2" />
                  Mis Guardados / Favoritos ({favoriteProducts.length})
                </h3>
                <p className="text-xs text-gray-400 mt-1">Lista de productos que marcaste con un corazón para seguir de cerca.</p>
              </div>

              {favoriteProducts.length === 0 ? (
                <div className="glass-panel rounded-xl p-6 border border-white/5 bg-[#111111] text-center text-gray-500 text-xs">
                  No has agregado ningún producto a favoritos todavía. ¡Visita el marketplace!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>

            {/* Historial de Mis Compras */}
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-4 text-left">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center">
                  <ShoppingBag className="h-5 w-5 text-neon-blue mr-2" />
                  Historial de Mis Compras ({approvedOrders.length})
                </h3>
                <p className="text-xs text-gray-400 mt-1">Comprobantes y boletas digitales de compras aprobadas por el vendedor.</p>
              </div>

              {approvedOrders.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-xs">
                  Aún no tienes compras aprobadas con boleta. Cuando el vendedor verifique tu pago y emita la boleta oficial, aparecerá aquí al instante.
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedOrders.map((order) => (
                    <div key={order.id} className="border border-white/5 rounded-lg bg-white/2 p-4 text-xs space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between text-gray-400 border-b border-white/5 pb-2">
                        <span className="font-mono text-neon-blue font-bold">ORDEN ID: {order.id}</span>
                        <div className="flex space-x-3 mt-1.5 md:mt-0 text-[10px]">
                          <span>Pago: <strong className="text-white uppercase">{order.paymentMethod}</strong></span>
                          <span>Fecha: <strong className="text-white">{order.createdAt.substring(0, 10)}</strong></span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-black/40 p-2.5 rounded">
                            <div>
                              <p className="font-bold text-white text-[13px]">{item.productTitle}</p>
                              <p className="text-[10px] text-gray-500 uppercase mt-0.5">Categoría: {item.productType} | Cant: {item.quantity}</p>
                            </div>
                            <span className="font-black text-neon-blue text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                        <div className="flex items-center space-x-3">
                          {order.boletaNumber || order.status === 'completed' ? (
                            <button
                              onClick={() => setSelectedBoletaOrder(order)}
                              className="py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all"
                            >
                              <Receipt className="h-3.5 w-3.5" />
                              <span>Ver Boleta Digital ({order.boletaNumber})</span>
                            </button>
                          ) : (
                            <a
                              href={`https://api.whatsapp.com/send?phone=51906328464&text=${encodeURIComponent(`Hola, solicitó apoyo para mi orden ID ${order.id} por $${order.total.toFixed(2)} USD.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              <span>Enviar Solicitud al Vendedor por WhatsApp</span>
                            </a>
                          )}
                        </div>

                        <div className="flex items-center space-x-1.5 text-xs">
                          <span className="text-gray-400 font-medium">Total:</span>
                          <span className="text-base font-black text-white text-glow-blue">${order.total.toFixed(2)}</span>
                          {order.boletaNumber || order.status === 'completed' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">Boleta Emitida 🟢</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold uppercase">Esperando Vendedor ⏳</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: WHATSAPP DIRECT SUPPORT & TICKETS */}
        {activeTab === 'soporte' && (
          <div className="space-y-6 text-left">
            
            {/* Direct WhatsApp Central Hub Card */}
            <div className="glass-panel rounded-xl border border-emerald-500/30 bg-[#0d131f] p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Central de Soporte WhatsApp Directo</h3>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  Oficial 24/7
                </span>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Atención telefónica & WhatsApp</p>
                  <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider">+51 906328464</p>
                  <p className="text-[10px] text-gray-400">Atención rápida para entrega de cuentas, validación de boletas e intermediario.</p>
                </div>

                <a
                  href="https://api.whatsapp.com/send?phone=51906328464&text=Hola,%20solicito%20atención%20o%20soporte%20directo%20en%20FF%20Market%20Pro."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                  <span>Abrir Chat de WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Support and Ticket Disputation Section */}
            <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] space-y-6 text-left">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center">
                  <LifeBuoy className="h-5 w-5 text-neon-blue mr-2" />
                  Crear Ticket de Soporte Interno
                </h3>
                <p className="text-xs text-gray-400 mt-1">¿Tienes preguntas o deseas reportar alguna compra? También puedes abrir un ticket formal.</p>
              </div>

              {ticketSuccess && (
                <div className="bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded p-2.5 text-xs">
                  {ticketSuccess}
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Asunto / ID de la Orden afectada</label>
                  <input 
                    type="text" 
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Ej: Retraso en entrega diamantes ID - Orden #ORD_178492"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-blue focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Mensaje de explicación detallado</label>
                  <textarea 
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    placeholder="Detalla qué sucedió, cuál es tu ID de jugador o qué credenciales de cuenta fallaron..."
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-neon-blue focus:outline-none h-24 resize-none"
                    required
                  />
                </div>

                <button type="submit" className="btn-neon-blue px-5 py-2 rounded text-xs font-bold uppercase tracking-wider">
                  Abrir Ticket
                </button>
              </form>

              {/* List of active support tickets */}
              <div className="border-t border-white/5 pt-5 space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Mis Tickets Abiertos</h4>
                {supportTickets.length === 0 ? (
                  <p className="text-xs text-gray-500">No tienes tickets de reclamo pendientes.</p>
                ) : (
                  <div className="space-y-2">
                    {supportTickets.map((t) => (
                      <div key={t.id} className="p-3 bg-white/2 rounded border border-white/5 text-xs flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-bold text-white flex items-center">
                            <span className="font-mono text-neon-blue mr-2">#{t.id}</span>
                            {t.subject}
                          </p>
                          <p className="text-[10px] text-gray-500">Abierto el: {t.createdAt.substring(0, 10)}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          t.status === 'open' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {t.status === 'open' ? 'Abierto' : 'Resuelto'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* BOLETA MODAL RE-OPENER */}
      <BoletaModal order={selectedBoletaOrder} onClose={() => setSelectedBoletaOrder(null)} />
    </div>
  );
};
