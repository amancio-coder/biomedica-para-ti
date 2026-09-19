"use client";

import { useState, useEffect } from "react";
import { Store, Plus, Package } from "lucide-react";
// Ajusta la ruta de importación de Supabase según tu estructura (aquí asume 4 niveles arriba hacia src/lib/supabase)
import { supabase } from "../../../../lib/supabase"; 

interface Product {
  id: string;
  name: string;
  category: "Oxígeno" | "Fármacos UCI" | "Descartables" | "Equipamiento";
  stock: number;
  priceBs: number;
  urgent247: boolean;
}

interface B2BOrder {
  id: string;
  hospital: string;
}

export default function ProviderDashboardPage() {
  // Estados para usuario y modal de contraseña
  const [userEmail, setUserEmail] = useState("");
  const [mostrarModalPwd, setMostrarModalPwd] = useState(false);
  const [nuevaPwd, setNuevaPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  // Estados del panel de productos
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Oxígeno");
  const [stock, setStock] = useState<number>(0);
  const [priceBs, setPriceBs] = useState<number>(0);
  const [urgent247, setUrgent247] = useState(false);

  // Obtener sesión activa del usuario
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  // Manejar actualización de contraseña
  const manejarCambioPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdError("");
    const { error } = await supabase.auth.updateUser({ password: nuevaPwd });
    if (error) {
      setPwdError(error.message);
    } else {
      setPwdMsg("¡Contraseña actualizada con éxito!");
      setNuevaPwd("");
      setTimeout(() => {
        setMostrarModalPwd(false);
        setPwdMsg("");
      }, 2000);
    }
  };

  // Agregar producto local/ejemplo al estado
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: Date.now().toString(),
      name,
      category,
      stock,
      priceBs,
      urgent247,
    };
    setProducts([...products, newProd]);
    setName("");
    setStock(0);
    setPriceBs(0);
    setUrgent247(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Barra superior con usuario a un costado y opción de cambiar contraseña */}
      <div className="flex justify-end items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold">{userEmail || "Cargando usuario..."}</span>
        </div>
        <button
          type="button"
          onClick={() => setMostrarModalPwd(true)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1.5"
        >
          <span>🔑</span> Cambiar Pwd
        </button>
      </div>

      {/* Encabezado principal del panel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2.5 rounded-xl text-teal-700">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel Proveedor B2B</h1>
            <p className="text-sm text-slate-500">Gestión de SKUs y disponibilidad 24/7</p>
          </div>
        </div>
      </div>

      {/* Grilla principal: Formulario + Inventario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulario de registro de SKU */}
        <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 lg:col-span-1">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-600" /> Registrar Nuevo SKU
          </h2>
          <div>
            <label className="text-xs font-medium text-slate-700">Nombre del Producto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej. Balón de Oxígeno 6m3"
              className="w-full mt-1 px-3 py-2 border rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Product["category"])}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-xs"
            >
              <option value="Oxígeno">Oxígeno</option>
              <option value="Fármacos UCI">Fármacos UCI</option>
              <option value="Descartables">Descartables</option>
              <option value="Equipamiento">Equipamiento</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Precio (Bs)</label>
              <input
                type="number"
                value={priceBs}
                onChange={(e) => setPriceBs(Number(e.target.value))}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg text-xs"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              checked={urgent247}
              onChange={(e) => setUrgent247(e.target.checked)}
              id="urgent"
            />
            <label htmlFor="urgent" className="text-xs font-medium text-slate-700">Urgencias 24/7 disponible</label>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg text-xs transition"
          >
            Agregar Producto
          </button>
        </form>

        {/* Tabla de Inventario */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 overflow-x-auto">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-teal-600" /> Inventario Registrado ({products.length})
          </h2>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 px-3">Producto</th>
                <th className="py-2 px-3">Categoría</th>
                <th className="py-2 px-3">Stock</th>
                <th className="py-2 px-3">Precio (Bs)</th>
                <th className="py-2 px-3">24/7</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No hay productos registrados aún.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-800">{p.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.category}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.stock}</td>
                    <td className="py-2.5 px-3 text-slate-600">Bs. {p.priceBs}</td>
                    <td className="py-2.5 px-3">
                      {p.urgent247 ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Activo</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">No</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal flotante para cambiar contraseña */}
      {mostrarModalPwd && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Actualizar Contraseña</h3>
              <button
                type="button"
                onClick={() => setMostrarModalPwd(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {pwdError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{pwdError}</div>}
            {pwdMsg && <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded">{pwdMsg}</div>}

            <form onSubmit={manejarCambioPwd} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700">Nueva contraseña</label>
                <input
                  type="password"
                  value={nuevaPwd}
                  onChange={(e) => setNuevaPwd(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full mt-1 px-3 py-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrarModalPwd(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}