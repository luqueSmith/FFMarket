import React, { useState } from 'react';
import { useAppContext } from '../store';
import { motion } from 'motion/react';
import { Shield, Coins, User, Key, Mail, Gamepad2, ArrowRight, Star, Gem, CheckCircle, HelpCircle } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';

export const Login: React.FC = () => {
  const { loginAsUser, usersList, sellersList } = useAppContext();
  
  // Custom form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter specific test accounts from usersList
  const testUsers = [
    {
      id: 'admin1',
      role: 'Administrador',
      title: 'Panel de Control Supremo 👑',
      desc: 'Administra disputas, aprueba cupones, inspecciona logs de auditoría y ajusta comisiones globales del SaaS.',
      color: 'from-amber-500 to-yellow-600',
      shadowColor: 'rgba(245, 158, 11, 0.4)',
      icon: Shield,
    },
    {
      id: 'u2',
      role: 'Vendedor',
      title: 'Tienda Verificada (Socio) ⚡',
      desc: 'Sube cuentas sakura/evolutivas, consume Seller Credits para destacar anuncios y responde mensajes de compradores.',
      color: 'from-purple-500 to-indigo-600',
      shadowColor: 'rgba(168, 85, 247, 0.4)',
      icon: Coins,
    },
    {
      id: 'u1',
      role: 'Usuario',
      title: 'Cliente / Comprador FF 💎',
      desc: 'Explora cuentas, compra diamantes por ID en 5 minutos, equipa marcos animados de perfil y gana puntos de recompensa.',
      color: 'from-cyan-500 to-blue-600',
      shadowColor: 'rgba(6, 182, 212, 0.4)',
      icon: User,
    }
  ];

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setIsSubmitting(true);

    // Simulate database lookup
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Look up user by email or username
      const cleanEmail = email.toLowerCase().trim();
      const user = usersList.find(u => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanEmail);

      if (user) {
        setSuccessMsg(`¡Bienvenido de nuevo, ${user.username}! Redirigiendo...`);
        setTimeout(() => {
          loginAsUser(user.id);
        }, 1200);
      } else {
        // If not found, check if it matches a known role for testing, otherwise default to u1
        setErrorMsg('Credenciales no registradas. Utiliza uno de los accesos rápidos de simulación para probar el sistema sin restricciones.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg mb-8"
      >
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-[#00d2ff]/25 px-3 py-1 rounded-full mb-4">
          <Gamepad2 className="h-4 w-4 text-neon-blue animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-gray-200 uppercase">SaaS de Comercio de Free Fire</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Portal de <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-blue-500 to-neon-purple">Acceso Simulado</span>
        </h1>
        <p className="text-xs text-gray-400 mt-2">
          Inicia sesión con credenciales personalizadas o utiliza las tarjetas de acceso rápido de prueba para auditar el sistema como Administrador, Vendedor o Comprador.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl">
        
        {/* LEFT COLUMN: QUICK SWITCH CARDS FOR TESTERS */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-center">
          <div className="flex items-center justify-between border-l-2 border-neon-blue pl-3">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#00d2ff]">
                Cuentas de Simulación para Pruebas (Quick Login)
              </h2>
              <p className="text-[10px] text-gray-400">Toca cualquiera de estos perfiles para heredar instantáneamente sus permisos y datos.</p>
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase">Seguro</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {testUsers.map((test) => {
              // Find matching actual profile properties from usersList
              const actualProfile = usersList.find(u => u.id === test.id) || usersList[0];
              
              // Find reputation/additional info if Vendedor
              let extraMeta = '';
              if (test.role === 'Vendedor') {
                const sellerInfo = sellersList.find(s => s.userId === test.id);
                extraMeta = sellerInfo ? `Reputación: ${sellerInfo.reputation}% • ${sellerInfo.salesCount} ventas` : '';
              } else if (test.role === 'Administrador') {
                extraMeta = 'Nivel Master • Acceso a Logs de Sistema';
              } else {
                extraMeta = `Nivel ${actualProfile.level} • ${actualProfile.points} Puntos FF`;
              }

              return (
                <motion.div
                  key={test.id}
                  id={`tester_card_${test.id}`}
                  whileHover={{ scale: 1.02, x: 4, borderColor: 'rgba(0, 210, 255, 0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loginAsUser(test.id)}
                  className="glass-panel p-4 rounded-xl border border-white/5 bg-[#111111]/90 cursor-pointer text-left flex items-start gap-4 hover:bg-[#15151b] transition-all relative overflow-hidden group shadow-lg"
                >
                  {/* Decorative glowing gradient backdrop */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity rounded-full blur-2xl" style={{ backgroundColor: test.shadowColor }} />
                  
                  {/* Profile Avatar with Frame from core system */}
                  <div className="flex-shrink-0 mt-0.5 relative">
                    <ProfileAvatar 
                      url={actualProfile.avatar} 
                      frame={actualProfile.frame} 
                      size="md" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-black/80 rounded-full p-1 border border-white/10">
                      <test.icon className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider truncate">
                        {actualProfile.username}
                      </h3>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest border bg-gradient-to-r ${test.color} text-black`}>
                        {test.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-neon-blue font-bold tracking-tight">
                      {test.title}
                    </p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      {test.desc}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px] text-gray-500 font-mono">
                      <span>{extraMeta}</span>
                      <span className="text-[#00d2ff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-bold">
                        Entrar Simulación <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: MANUAL LOGIN FORM */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 bg-[#111111]/80 backdrop-blur-md relative glow-blue text-left"
          >
            <div className="space-y-1 border-b border-white/5 pb-4 mb-6">
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Formulario de Acceso</h2>
              <p className="text-[11px] text-gray-400">Inicia sesión con tu cuenta personalizada de Free Fire Market.</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[11px] text-red-400 font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Correo Electrónico o Usuario</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@ffmarket.com"
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue transition-all"
                  />
                </div>
                <p className="text-[9px] text-gray-500">Prueba con &apos;admin@ffmarketpro.com&apos; o &apos;megastore@ffmarket.com&apos;</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Contraseña Segura</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-neon-blue to-blue-600 hover:from-neon-purple hover:to-purple-600 text-black font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:text-white flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Acceder a la Cuenta</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-[9px] text-gray-500">
                ¿Primera vez probando la plataforma? Utiliza las cuentas rápidas a la izquierda para experimentar el flujo completo del sistema multi-rol.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
