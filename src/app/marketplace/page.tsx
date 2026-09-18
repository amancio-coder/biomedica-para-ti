"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Package, MessageCircle, Search } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: string;
  provider_id: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Vitrina de Insumos Médicos</h1>
            <p className="text-sm text-slate-500">Encuentra insumos de farmacias locales en Bolivia.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar insumo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Cargando vitrina...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No hay insumos disponibles que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sky-600 mb-2">
                    <Package size={20} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Dispensación Local</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">Stock: {item.stock}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">Bs. {Number(item.price).toFixed(2)}</span>
                  <Link
                    href={`/dashboard`}
                    className="bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle size={14} /> Consultar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}