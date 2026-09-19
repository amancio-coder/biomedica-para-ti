"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, Key, User } from "lucide-react";

export function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mostrarModalPwd, setMostrarModalPwd] = useState(false);
  const [nuevaPwd, setNuevaPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const manejarCambioPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdError("");
    const { error } = await supabase.auth.updateUser({ password: nuevaPwd });
    if (error) {
      setPwdError(error.message);
    } else {
      setPwdMsg("¡Contraseña actualizada!");
      setNuevaPwd("");
      setTimeout(() => {
        setMostrarModalPwd(false);
        setPwdMsg("");
      }, 2000);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-sky-600 text-white font-bold p-2 rounded-xl text-sm">RS</span>
            <span className="font-bold text-slate-900 text-base">RedSalud•BO</span>
          </Link>

          {/* Navigation Links Públicos + Protegidos Condicionales */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition">Inicio</Link>
            <Link href="/hospitales" className="hover:text-slate-900 transition">Red de Camas & S.O.S.</Link>
            <Link href="/marketplace" className="hover:text-slate-900 transition">Marketplace Insumos</Link>
            <Link href="/ayuda" className="hover:text-slate-900 transition">FAQ & Tutoriales</Link>
            
            {/* Solo visible si el usuario está autenticado */}
            {userEmail && (
              <Link 
                href="/dashboard/productos/nuevo" 
                className="text-teal-700 font-semibold hover:text-teal-900 transition bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200"
              >
                Panel Proveedor (Free 3/3)
              </Link>
            )}
          </nav>

          {/* Auth Area */}
          <div className="flex items-center gap-3">
            {userEmail ? (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <Link
                  href="/perfil"
                  className="font-semibold text-slate-700 hover:text-sky-600 transition truncate max-w-[130px] flex items-center gap-1"
                  title="Ir a Mi Perfil & Membresía"
                >
                  <User className="w-3 h-3 text-slate-400 inline" />
                  {userEmail}
                </Link>
                <button
                  type="button"
                  onClick={() => setMostrarModalPwd(true)}
                  title="Cambiar Contraseña"
                  className="text-slate-500 hover:text-sky-600 ml-1 p-1"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="text-slate-500 hover:text-red-600 p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-medium text-slate-700 hover:text-sky-600 transition px-3 py-1.5"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="text-xs font-semibold bg-teal-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-teal-700 transition shadow-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal flotante global para cambiar contraseña */}
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
    </>
  );
}