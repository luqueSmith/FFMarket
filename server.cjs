var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_supabase_js = require("@supabase/supabase-js");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var supabaseAdminInstance = null;
function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
}
function getPublishableKey() {
  return process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
}
function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    const url = getSupabaseUrl();
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required");
    }
    supabaseAdminInstance = (0, import_supabase_js.createClient)(url, key, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
    });
  }
  return supabaseAdminInstance;
}
async function loadSellerDirectory(includePrivate) {
  const admin = getSupabaseAdmin();
  const publicCols = "id,user_id,username,avatar_url,banner_url,frame,description,sales_count,reputation,likes_count,dislikes_count,seller_level,rating_average,medals,last_active_at,is_active,created_at";
  const privateCols = "id,user_id,username,avatar_url,banner_url,frame,description,sales_count,credit_balance,reputation,likes_count,dislikes_count,reports_count,seller_level,rating_average,medals,last_active_at,is_active,created_at";
  const { data: sellers, error } = await admin.from("seller_profiles").select(includePrivate ? privateCols : publicCols).order("created_at", { ascending: false });
  if (error) throw error;
  const userIds = (sellers || []).map((row) => row.user_id).filter(Boolean);
  if (!userIds.length) return [];
  const [
    { data: profiles, error: profileError },
    { data: paymentRows, error: paymentError }
  ] = await Promise.all([
    admin.from("profiles").select("id,username,avatar_url,frame").in("id", userIds),
    admin.from("seller_payment_methods").select("seller_id,payment_method_id,is_enabled").eq("is_enabled", true)
  ]);
  if (profileError) throw profileError;
  if (paymentError) throw paymentError;
  const byUser = new Map((profiles || []).map((row) => [row.id, row]));
  const paymentsBySeller = /* @__PURE__ */ new Map();
  for (const row of paymentRows || []) {
    const list = paymentsBySeller.get(row.seller_id) || [];
    list.push(row.payment_method_id);
    paymentsBySeller.set(row.seller_id, list);
  }
  return (sellers || []).map((row) => {
    const identity = byUser.get(row.user_id) || {};
    return {
      ...row,
      username: identity.username || row.username,
      avatar_url: identity.avatar_url || row.avatar_url,
      frame: identity.frame || row.frame,
      accepted_payment_methods: paymentsBySeller.get(row.id) || []
    };
  });
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = Number(process.env.PORT || 3e3);
  app.use(import_express.default.json({ limit: "1mb" }));
  const requireAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: "Sesi\xF3n requerida." });
    const token = match[1];
    try {
      const adminClient = getSupabaseAdmin();
      const { data: authData, error: authError } = await adminClient.auth.getUser(token);
      if (authError || !authData.user) {
        return res.status(401).json({ error: "Sesi\xF3n inv\xE1lida o vencida." });
      }
      const url = getSupabaseUrl();
      const publishableKey = getPublishableKey();
      if (!url || !publishableKey) {
        return res.status(500).json({ error: "Falta configuraci\xF3n p\xFAblica de Supabase en el servidor." });
      }
      const userClient = (0, import_supabase_js.createClient)(url, publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
        global: { headers: { Authorization: `Bearer ${token}` } }
      });
      const { data: isAdmin, error: rpcError } = await userClient.rpc("is_admin");
      if (rpcError || isAdmin !== true) {
        return res.status(403).json({ error: "Requiere Administrador con MFA (AAL2)." });
      }
      req.authUser = authData.user;
      next();
    } catch (err) {
      return res.status(500).json({ error: err?.message || "No se pudo validar la sesi\xF3n administrativa." });
    }
  };
  app.post("/api/admin/create-user", requireAdmin, async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const username = String(req.body?.username || "").trim();
    const role = String(req.body?.role || "");
    if (!username || username.length < 3) return res.status(400).json({ error: "El nombre de usuario debe tener al menos 3 caracteres." });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Correo electr\xF3nico inv\xE1lido." });
    if (password.length < 8) return res.status(400).json({ error: "La contrase\xF1a debe tener al menos 8 caracteres." });
    if (!["Usuario", "Vendedor"].includes(role)) return res.status(400).json({ error: "Solo se pueden crear usuarios o vendedores." });
    try {
      const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username, role }
      });
      if (error) throw error;
      if (!data.user) throw new Error("Supabase no devolvi\xF3 el usuario creado.");
      let profile = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const result = await getSupabaseAdmin().from("profiles").select("id,username,role").eq("id", data.user.id).maybeSingle();
        if (result.data) {
          profile = result.data;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      if (!profile) throw new Error("El usuario se cre\xF3 en Auth, pero el perfil autom\xE1tico no apareci\xF3. Revisa el trigger on_auth_user_created.");
      return res.json({
        success: true,
        user: { id: data.user.id, email: data.user.email, username: profile.username, role: profile.role }
      });
    } catch (err) {
      return res.status(400).json({ error: err?.message || "No se pudo crear el usuario." });
    }
  });
  app.get("/api/public/sellers", async (_req, res) => {
    try {
      const rows = (await loadSellerDirectory(false)).filter((row) => row.is_active === true);
      return res.json(rows);
    } catch (err) {
      return res.status(500).json({ error: err?.message || "No se pudieron cargar vendedores." });
    }
  });
  app.get("/api/admin/sellers", requireAdmin, async (_req, res) => {
    try {
      const rows = await loadSellerDirectory(true);
      return res.json({ sellers: rows });
    } catch (err) {
      return res.status(400).json({ error: err?.message || "No se pudieron cargar vendedores." });
    }
  });
  app.get("/api/admin/list-users", requireAdmin, async (_req, res) => {
    try {
      const adminClient = getSupabaseAdmin();
      const [{ data: authData, error: authErr }, { data: profiles, error: profErr }, { data: accounts, error: accErr }] = await Promise.all([
        adminClient.auth.admin.listUsers({ page: 1, perPage: 1e3 }),
        adminClient.from("profiles").select("id,username,avatar_url,frame,role,level,created_at"),
        adminClient.from("user_accounts").select("user_id,phone,purchase_count,reward_points")
      ]);
      if (authErr) throw authErr;
      if (profErr) throw profErr;
      if (accErr) throw accErr;
      const profileById = new Map((profiles || []).map((p) => [p.id, p]));
      const accountById = new Map((accounts || []).map((a) => [a.user_id, a]));
      const users = (authData.users || []).map((u) => {
        const profile = profileById.get(u.id) || {};
        const account = accountById.get(u.id) || {};
        return {
          id: u.id,
          email: u.email || "",
          username: profile.username || "Sin perfil",
          avatar: profile.avatar_url || "",
          frame: profile.frame || "none",
          role: profile.role || "Usuario",
          level: profile.level || 1,
          purchaseCount: account.purchase_count || 0,
          points: account.reward_points || 0,
          phone: account.phone || "",
          badges: [],
          achievements: [],
          createdAt: profile.created_at || u.created_at,
          bannedUntil: u.banned_until || null
        };
      });
      return res.json({ users });
    } catch (err) {
      return res.status(400).json({ error: err?.message || "No se pudieron cargar usuarios." });
    }
  });
  app.post("/api/admin/update-user", requireAdmin, async (req, res) => {
    const userId = String(req.body?.userId || "");
    const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : void 0;
    const password = req.body?.password ? String(req.body.password) : void 0;
    if (!userId) return res.status(400).json({ error: "userId es obligatorio." });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Correo inv\xE1lido." });
    if (password && password.length < 8) return res.status(400).json({ error: "La nueva contrase\xF1a debe tener al menos 8 caracteres." });
    try {
      const updates = {};
      if (email) updates.email = email;
      if (password) updates.password = password;
      if (Object.keys(updates).length === 0) return res.json({ success: true });
      const { data, error } = await getSupabaseAdmin().auth.admin.updateUserById(userId, updates);
      if (error) throw error;
      return res.json({ success: true, user: { id: data.user.id, email: data.user.email } });
    } catch (err) {
      return res.status(400).json({ error: err?.message || "No se pudo actualizar Auth." });
    }
  });
  app.post("/api/admin/ban-user", requireAdmin, async (req, res) => {
    const userId = String(req.body?.userId || "");
    const banDuration = String(req.body?.banDuration || "876000h");
    const actor = req.authUser;
    if (!userId) return res.status(400).json({ error: "userId es obligatorio." });
    if (actor?.id === userId) return res.status(400).json({ error: "El administrador principal no puede banearse a s\xED mismo." });
    try {
      const { data: profile } = await getSupabaseAdmin().from("profiles").select("role").eq("id", userId).maybeSingle();
      if (profile?.role === "Administrador") return res.status(400).json({ error: "No se puede banear una cuenta Administrador." });
      const { data, error } = await getSupabaseAdmin().auth.admin.updateUserById(userId, { ban_duration: banDuration });
      if (error) throw error;
      return res.json({ success: true, user: { id: data.user.id, bannedUntil: data.user.banned_until } });
    } catch (err) {
      return res.status(400).json({ error: err?.message || "No se pudo banear el usuario." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => res.sendFile(import_path.default.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
}
startServer().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
