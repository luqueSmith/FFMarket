/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppContext } from '../store';
import {
  Shield,
  Users,
  ShoppingBag,
  Flag,
  Percent,
  Settings,
  UserCheck,
  AlertOctagon,
  Trash2,
  CheckCircle,
  XCircle,
  Coins,
  Key,
  Eye,
  Plus,
  DollarSign
} from 'lucide-react';
import { InteractiveChart } from './InteractiveChart';

export const AdminDashboard: React.FC = () => {
  const {
    appSettings,
    usersList,
    sellersList,
    products,
    reportsList,
    coupons,
    adminCreateUser,
    adminUpdateUser,
    adminUpdateSeller,
    adminDeleteProduct,
    adminResolveReport,
    adminAddCoupon,
    adminUpdateSettings,
    adminGivePoints,
    auditLogs
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'coupons' | 'settings'>('overview');

  // User Creation State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Usuario' | 'Vendedor' | 'Administrador'>('Usuario');
  const [newPassword, setNewPassword] = useState('');
  const [createUserError, setCreateUserError] = useState('');
  const [createUserSuccess, setCreateUserSuccess] = useState('');

  // User Editing State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'Usuario' | 'Vendedor' | 'Administrador'>('Usuario');
  const [editLevel, setEditLevel] = useState(1);
  const [editPoints, setEditPoints] = useState(0);
  const [editPassword, setEditPassword] = useState('');
  const [editUserSuccess, setEditUserSuccess] = useState('');

  // New coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState(10);
  const [maxUses, setMaxUses] = useState(100);
  const [couponSuccess, setCouponSuccess] = useState('');

  // Settings states
  const [siteName, setSiteName] = useState(appSettings.siteName);
  const [comPercent, setComPercent] = useState(appSettings.commissionPercent);
  const [taxPercent, setTaxPercent] = useState(appSettings.taxPercent);
  const [maintenance, setMaintenance] = useState(appSettings.isMaintenanceMode);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Seller Points grant state
  const [pointsAmount, setPointsAmount] = useState(100);
  const [selectedSellerForPoints, setSelectedSellerForPoints] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserError('');
    setCreateUserSuccess('');

    if (!newUsername.trim() || !newEmail.trim()) {
      setCreateUserError('Por favor complete todos los campos.');
      return;
    }

    const res = adminCreateUser({
      username: newUsername.trim(),
      email: newEmail.trim(),
      role: newRole,
      password: newPassword.trim() || undefined
    });

    if (res.success) {
      setCreateUserSuccess(res.message);
      setNewUsername('');
      setNewEmail('');
      setNewRole('Usuario');
      setNewPassword('');
      setTimeout(() => {
        setCreateUserSuccess('');
        setShowCreateForm(false);
      }, 2000);
    } else {
      setCreateUserError(res.message);
    }
  };

  const handleStartEdit = (user: any) => {
    setEditingUserId(user.id);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditLevel(user.level || 1);
    setEditPoints(user.points || 0);
    setEditPassword(user.password || '123456');
    setEditUserSuccess('');
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUsername.trim() || !editEmail.trim()) {
      alert('El usuario y el correo no pueden estar vacíos.');
      return;
    }

    adminUpdateUser(editingUserId!, {
      username: editUsername.trim(),
      email: editEmail.trim(),
      role: editRole,
      level: Number(editLevel),
      points: Number(editPoints),
      password: editPassword.trim()
    });

    setEditUserSuccess('¡Usuario actualizado con éxito!');
    setTimeout(() => {
      setEditUserSuccess('');
      setEditingUserId(null);
    }, 2000);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    adminAddCoupon({
      id: "c_" + Date.now(),
      code: couponCode.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      maxUses: Number(maxUses),
      usedCount: 0,
      isActive: true,
      expiresAt: "2026-12-31"
    });

    setCouponSuccess(`¡Cupón ${couponCode.toUpperCase()} creado con éxito!`);
    setCouponCode('');
    setDiscountValue(10);
    setTimeout(() => setCouponSuccess(''), 3000);
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateSettings({
      siteName,
      commissionPercent: Number(comPercent),
      taxPercent: Number(taxPercent),
      isMaintenanceMode: maintenance
    });
    setSettingsSuccess('¡Configuraciones actualizadas de forma global!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  const grantPoints = (sellerId: string) => {
    adminGivePoints(sellerId, pointsAmount);
    alert(`Se han acreditado +${pointsAmount} puntos de regalo al vendedor.`);
  };

  const pendingReports = reportsList.filter(r => r.status === 'pending');

  return (
    <div id="admin_panel" className="space-y-6">
      
      {/* Admin Title Area */}
      <div className="glass-panel rounded-xl p-5 border border-yellow-500/10 bg-[#111111] flex items-center justify-between">
        <div className="flex items-center space-x-3 text-left">
          <div className="h-10 w-10 bg-yellow-500/15 text-yellow-500 rounded-lg flex items-center justify-center border border-yellow-500/20">
            <Shield className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wider">Panel de Administración de FF MARKET PRO</h2>
            <p className="text-xs text-gray-400 mt-0.5">Control global de compras, catálogos, auditoría, disputas y roles de usuario.</p>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border border-white/5 bg-[#111111] p-1.5 rounded-lg overflow-x-auto space-x-1.5 scrollbar-none">
        {[
          { id: 'overview', label: 'Resumen', icon: Shield },
          { id: 'users', label: 'Usuarios & Vendedores', icon: Users },
          { id: 'reports', label: 'Denuncias (' + pendingReports.length + ')', icon: Flag },
          { id: 'coupons', label: 'Cupones', icon: Percent },
          { id: 'settings', label: 'Ajustes', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all rounded-md flex-shrink-0 border ${
                isSel 
                  ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_8px_rgba(234,179,8,0.15)]' 
                  : 'text-gray-400 hover:text-white bg-[#181818]/40 border-transparent hover:bg-white/5'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Usuarios Registrados</span>
                <p className="text-xl font-black text-white">{usersList.length}</p>
              </div>
              <div className="h-10 w-10 bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center justify-center border border-yellow-500/20">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Productos en Catálogo</span>
                <p className="text-xl font-black text-white">{products.length}</p>
              </div>
              <div className="h-10 w-10 bg-neon-blue/10 text-neon-blue rounded-lg flex items-center justify-center border border-neon-blue/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Comisiones Acumuladas</span>
                <p className="text-xl font-black text-emerald-400">$348.50 USD</p>
              </div>
              <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Denuncias Activas</span>
                <p className="text-xl font-black text-red-500">{pendingReports.length}</p>
              </div>
              <div className="h-10 w-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center border border-red-500/20">
                <Flag className="h-5 w-5 animate-bounce" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <InteractiveChart title="Volumen General Transaccionado ($)" data={[450, 1200, 890, 1500, 2400, 3100, 4200]} labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']} type="revenue" />
            <InteractiveChart title="Ingresos Netos Comisiones" data={[22, 60, 44, 75, 120, 155, 210]} labels={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']} type="sales" />
          </div>

          {/* Audit Trail Logs */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111]">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3">Registro de Actividad Reciente del Sistema</h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2 bg-white/2 rounded border border-white/5 text-[11px] flex justify-between items-center text-left">
                  <div>
                    <span className="font-bold text-gray-200">[{log.action}]</span>
                    <span className="text-gray-400 ml-2">{log.details}</span>
                  </div>
                  <div className="flex space-x-2 text-[9px] text-gray-500">
                    <span>{log.username} ({log.role})</span>
                    <span>{log.timestamp.substring(11, 19)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: USER & SELLER TABLES */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in text-xs">
          
          {/* Sellers points gift control panel */}
          <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1 text-left col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Regalar Puntos (Cr) a Vendedor</label>
              <select 
                value={selectedSellerForPoints} 
                onChange={(e) => setSelectedSellerForPoints(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded p-1.5 text-white"
              >
                <option value="">-- Seleccionar Vendedor --</option>
                {sellersList.map(s => (
                  <option key={s.id} value={s.id}>{s.username} ({s.points} Cr)</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 text-left col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Cantidad de Créditos</label>
              <input 
                type="number" 
                value={pointsAmount}
                onChange={(e) => setPointsAmount(Number(e.target.value))}
                className="w-full bg-[#181818] border border-white/10 rounded p-1.5 text-white"
              />
            </div>
            <button
              onClick={() => {
                if (!selectedSellerForPoints) return alert("Selecciona un vendedor.");
                grantPoints(selectedSellerForPoints);
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase tracking-wider py-2 rounded transition-colors"
            >
              Acreditar Créditos Regalo
            </button>
          </div>

          {/* Users database Table */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Base de Datos de Cuentas de Usuario</h3>
                <p className="text-[10px] text-gray-400">Total de usuarios en la plataforma: {usersList.length}</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateForm(!showCreateForm);
                  setEditingUserId(null);
                }}
                className="flex items-center justify-center space-x-1.5 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider py-1.5 px-4 rounded text-[10px] shadow-lg shadow-yellow-500/10 self-start sm:self-center transition-all"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                <span>Crear Cuenta de Usuario</span>
              </button>
            </div>

            {/* CREATE USER FORM */}
            {showCreateForm && (
              <form onSubmit={handleCreateUser} className="mb-6 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 space-y-4 text-left animate-fade-in">
                <div className="flex items-center justify-between border-b border-yellow-500/10 pb-2">
                  <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    Registrar Nueva Cuenta de Usuario (Acceso Admin)
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                {createUserError && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-[11px] font-semibold">
                    ⚠️ {createUserError}
                  </div>
                )}
                {createUserSuccess && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[11px] font-semibold">
                    ✓ {createUserSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre de Usuario</label>
                    <input 
                      type="text" 
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Ej: Sakura_Master"
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="ejemplo@ffmarket.com"
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Rango / Rol</label>
                    <select 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500 text-xs"
                    >
                      <option value="Usuario">Usuario (Comprador)</option>
                      <option value="Vendedor">Vendedor (Socio)</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Contraseña Secreta</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button 
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider py-2 px-5 rounded text-[10px] transition-colors"
                  >
                    Crear Cuenta Ahora
                  </button>
                </div>
              </form>
            )}

            {/* EDIT USER FORM */}
            {editingUserId && (
              <form onSubmit={handleUpdateUser} className="mb-6 p-4 rounded-xl border border-[#00d2ff]/20 bg-[#00d2ff]/5 space-y-4 text-left animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#00d2ff]/10 pb-2">
                  <h4 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4" />
                    Editar Datos, Rango y Contraseña de: {editUsername}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => setEditingUserId(null)}
                    className="text-gray-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    ✕ Cancelar
                  </button>
                </div>

                {editUserSuccess && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[11px] font-semibold">
                    ✓ {editUserSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre de Usuario</label>
                    <input 
                      type="text" 
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#00d2ff] text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#00d2ff] text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Rol de Cuenta</label>
                    <select 
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as any)}
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#00d2ff] text-xs"
                    >
                      <option value="Usuario">Usuario (Comprador)</option>
                      <option value="Vendedor">Vendedor (Socio)</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nivel / Rango</label>
                    <input 
                      type="number" 
                      value={editLevel}
                      onChange={(e) => setEditLevel(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#00d2ff] text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Puntos Recompensa</label>
                    <input 
                      type="number" 
                      value={editPoints}
                      onChange={(e) => setEditPoints(Number(e.target.value))}
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#00d2ff] text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Contraseña Secreta</label>
                    <input 
                      type="text" 
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-[#00d2ff] text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="text-right space-x-2 pt-1">
                  <button 
                    type="button"
                    onClick={() => setEditingUserId(null)}
                    className="bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider py-1.5 px-4 rounded text-[10px] transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#00d2ff] hover:bg-[#00b2df] text-black font-black uppercase tracking-wider py-1.5 px-5 rounded text-[10px] transition-all"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 uppercase text-[10px] tracking-widest pb-2">
                    <th className="py-2">Usuario</th>
                    <th>Rol / Rango</th>
                    <th>Nivel</th>
                    <th>Puntos</th>
                    <th>Contraseña Sim.</th>
                    <th className="text-right">Acciones de Control</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="py-3 flex items-center space-x-2">
                        <img src={user.avatar} alt="" className="h-6 w-6 rounded-full object-cover border border-white/10" />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-[150px]">{user.username}</p>
                          <p className="text-[9px] text-gray-500 truncate max-w-[150px]">{user.email}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${
                          user.role === 'Administrador' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          user.role === 'Vendedor' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="font-bold text-gray-300 font-mono">Lvl {user.level || 1}</td>
                      <td className="font-bold text-yellow-500 font-mono">{user.points} pts</td>
                      <td className="font-mono text-[10px] text-gray-400">{user.password || "123456"}</td>
                      <td className="text-right space-x-1">
                        <button 
                          onClick={() => handleStartEdit(user)}
                          className="bg-[#00d2ff]/10 text-[#00d2ff] hover:bg-[#00d2ff] hover:text-black text-[9px] font-black uppercase px-2 py-1 rounded transition-all border border-[#00d2ff]/20"
                        >
                          Editar / Rango
                        </button>
                        <button 
                          onClick={() => {
                            adminUpdateUser(user.id, { username: user.username + "_BANNED", level: 0 });
                            alert(`Sancionado con éxito.`);
                          }}
                          className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white text-[9px] font-bold uppercase px-2 py-1 rounded transition-all border border-red-500/20"
                        >
                          Banear
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: DISPUTES & REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-fade-in text-xs">
          
          <div className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gestión de Denuncias y Disputas</h3>
            <p className="text-xs text-gray-400 mt-1">Revisa fraudes reportados de cuentas falsas, estafas de pago, reembolsos o spam de catálogo.</p>
          </div>

          {reportsList.length === 0 ? (
            <div className="glass-panel rounded-xl p-8 border border-white/5 bg-[#111111] text-center text-gray-500">
              No hay denuncias de fraude activas.
            </div>
          ) : (
            <div className="space-y-3">
              {reportsList.map((rep) => (
                <div key={rep.id} className="glass-panel rounded-xl p-4 border border-white/5 bg-[#111111] space-y-3 text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-2">
                    <div>
                      <span className="font-mono text-yellow-500 font-bold mr-2">REPORTE ID: {rep.id}</span>
                      <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.2 rounded uppercase text-[9px] font-bold">
                        Tipo: {rep.type}
                      </span>
                    </div>
                    <span className="text-gray-500 text-[10px] mt-1 md:mt-0">Enviado por: <strong>{rep.username}</strong></span>
                  </div>

                  <p className="text-gray-300">
                    <strong>Motivo del Reporte:</strong> "{rep.reason}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-gray-500">Estado: <strong className="uppercase text-gray-300">{rep.status}</strong></span>
                    {rep.status === 'pending' ? (
                      <div className="space-x-1.5">
                        <button 
                          onClick={() => adminResolveReport(rep.id, 'reject')}
                          className="bg-white/5 text-gray-400 hover:text-white px-3 py-1 rounded font-bold uppercase text-[9px]"
                        >
                          Rechazar
                        </button>
                        <button 
                          onClick={() => adminResolveReport(rep.id, 'resolve')}
                          className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1 rounded font-bold uppercase text-[9px]"
                        >
                          Resolver
                        </button>
                        <button 
                          onClick={() => adminResolveReport(rep.id, 'ban_seller')}
                          className="bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded font-bold uppercase text-[9px]"
                        >
                          Banear Vendedor Sancionado
                        </button>
                      </div>
                    ) : (
                      <span className="text-emerald-400 font-bold uppercase text-[10px]">Procesado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 4: COUPONS PANEL */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in text-xs">
          
          {/* Create coupon form */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] md:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">Crear Código Promocional</h3>
            
            {couponSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded p-2.5">
                {couponSuccess}
              </div>
            )}

            <form onSubmit={handleAddCoupon} className="space-y-3">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Código del Cupón</label>
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ej: SAKURA50"
                  className="w-full bg-[#181818] border border-white/10 rounded p-1.5 text-white uppercase"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tipo de Descuento</label>
                <select 
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-[#181818] border border-white/10 rounded p-1.5 text-white"
                >
                  <option value="percent">Porcentaje (%)</option>
                  <option value="fixed">Monto Fijo (USD $)</option>
                </select>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Valor de Descuento</label>
                <input 
                  type="number" 
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full bg-[#181818] border border-white/10 rounded p-1.5 text-white"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Límite de Usos Máximos</label>
                <input 
                  type="number" 
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  className="w-full bg-[#181818] border border-white/10 rounded p-1.5 text-white"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase tracking-wider py-2 rounded">
                Añadir Cupón
              </button>
            </form>
          </div>

          {/* Coupons Database list */}
          <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">Cupones Existentes</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {coupons.map((c) => (
                <div key={c.id} className="p-3 bg-white/2 rounded border border-white/5 flex justify-between items-center text-left">
                  <div className="space-y-1">
                    <p className="font-black text-white text-sm tracking-wide">{c.code}</p>
                    <p className="text-[10px] text-gray-400">
                      Descuento: <strong className="text-yellow-500">{c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue} USD`}</strong> | Usados: {c.usedCount}/{c.maxUses}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    c.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {c.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel rounded-xl p-5 border border-white/5 bg-[#111111] animate-fade-in text-xs space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Ajustes Generales del Mercado SaaS</h3>
            <p className="text-xs text-gray-400 mt-1">Configura parámetros monetarios, impuestos y estado de mantención global.</p>
          </div>

          {settingsSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded">
              {settingsSuccess}
            </div>
          )}

          <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre Comercial del Sitio</label>
              <input 
                type="text" 
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white"
                required
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Comisión por Venta exitosa (%)</label>
              <input 
                type="number" 
                value={comPercent}
                onChange={(e) => setComPercent(Number(e.target.value))}
                className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white"
                required
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Tasa de Impuesto Local (%)</label>
              <input 
                type="number" 
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white"
                required
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Modo Mantenimiento Global</label>
              <select 
                value={maintenance ? 'yes' : 'no'}
                onChange={(e) => setMaintenance(e.target.value === 'yes')}
                className="w-full bg-[#181818] border border-white/10 rounded p-2 text-white"
              >
                <option value="no">🟢 Operativo y Online (Recomendado)</option>
                <option value="yes">🔴 Modo Mantenimiento Activado</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-2 text-right">
              <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase tracking-wider py-2.5 px-6 rounded transition-colors">
                Actualizar Configuración Global
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
