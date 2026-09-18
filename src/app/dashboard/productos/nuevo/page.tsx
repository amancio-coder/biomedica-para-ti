"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { PackagePlus, AlertCircle } from "lucide-react";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [canPublish, setCanPublish] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function checkLimit() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan_type")
        .eq("id", user.id)
        .single();

      if (profile?.plan_type === "free") {
        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", user.id);

        if ((count || 0) >= 3) {
          setCanPublish(false);
        }
      }
      setCheckingLimit(false);
    }
    checkLimit();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("products").insert({
      provider_id: user.id,
      name,
      price: parseFloat(price),
      stock,
    });

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  if (checkingLimit) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Verificando límites del plan...</div>;
  }

  if (!canPublish) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h1 className="text-xl font-bold text-slate-800 mb-2">Límite alcanzado</h1>
          <p className="text-sm text-slate-600 mb-6">
            Has alcanzado el límite de 3 insumos en tu plan gratuito. Pasa al Plan Pro para publicar sin restricciones.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
        <div className="flex items-center gap-2 mb-6 text-sky-600">
          <PackagePlus size={28} />
          <h1 className="text-xl font-bold text-slate-800">Publicar Nuevo Insumo</h1>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Insumo / Medicamento</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              placeholder="Ej. Gasas esterilizadas x 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio (Bs.)</label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stock / Disponibilidad</label>
            <input
              type="text"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              placeholder="Ej. 50 unidades / Disponible"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}