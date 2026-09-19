"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Familiar / Paciente");
  
  const [membershipPlan, setMembershipPlan] = useState("Free (3/3 SKUs)");
  const [paymentStatus, setPaymentStatus] = useState("Activo / Freemium");
  const [renewalDate, setRenewalDate] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.full_name || "");
          setPhone(profile.phone || "");
          setRole(profile.role || "Familiar / Paciente");
          setMembershipPlan(profile.membership_plan || "Free (3/3 SKUs)");
          setPaymentStatus(profile.payment_status || "Activo / Freemium");
          setRenewalDate(profile.renewal_date || "");
          setBankAccount(profile.bank_account || "");
        }
      }
      setLoading(false);
    }
    loadUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMensaje("");
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("No hay sesión activa.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        phone: phone,
        role: role,
        membership_plan: membershipPlan,
        payment_status: paymentStatus,
        renewal_date: renewalDate,
        bank_account: bankAccount,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMensaje("¡Perfil, datos de membresía y pagos actualizados!");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-sky-100 p-3 rounded-xl text-sky-700">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Mi Perfil & Membresía</h1>
          <p className="text-xs text-slate-500">Administra tus datos, plan B2B/B4C, fechas de renovación y pagos.</p>
        </div>
      </div>

      {mensaje && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {mensaje}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Nombre Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Dr. Carlos Mamani"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Teléfono / Celular / S.O.S.</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+591 70000000"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Tipo de Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Familiar / Paciente">Familiar / Paciente</option>
                <option value="Proveedor / Farmacia B2B">Proveedor / Farmacia B2B</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-600" /> Membresía, Pagos & Renovación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700">Plan de Membresía</label>
              <input
                type="text"
                value={membershipPlan}
                onChange={(e) => setMembershipPlan(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Estado de Pago</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Activo / Freemium">Activo / Freemium</option>
                <option value="Pagado (Pro)">Pagado (Pro)</option>
                <option value="Pendiente de Renovación">Pendiente de Renovación</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Fecha de Renovación</label>
              <input
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {role.includes("Proveedor") && (
            <div className="pt-2">
              <label className="text-xs font-medium text-slate-700">Datos de Pago / QR / NIT (Proveedor B2B)</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="NIT: 123456019 - QR Pagos BNB"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Cambios →"}
          </button>
        </div>
      </form>
    </div>
  );
}