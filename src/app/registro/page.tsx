"use client";

import { useState } from "react";
// Asegúrate de que la ruta a tu archivo supabase.ts sea correcta. 
// Si da error, cámbiala por "../lib/supabase" o "@/lib/supabase"
import { supabase } from "../../lib/supabase"; 

export default function RegisterPage() {
  // 1. Todos los estados necesarios
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState("Proveedor / Farmacia B2B (Freemium 3/3 SKUs)");
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  
  // Estado para el ojito de la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // 2. Función de Registro (La que arreglamos con la base de datos)
  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMensajeExito(null);
    setCargando(true);

    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setMensajeExito("Registro exitoso. Revisa tu correo o inicia sesión.");
    }
    
    setCargando(false);
  };

  // 3. Renderizado de la Interfaz
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        
        {/* Cabecera del Formulario */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <span className="bg-green-100 text-green-600 p-3 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Alta de Perfil RedSalud•BO</h1>
          <p className="text-sm text-gray-500">Proveedores B2B (3 SKUs Free) o Red B2C Familiar</p>
        </div>

        {/* Alertas de Éxito o Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {error}
          </div>
        )}
        {mensajeExito && (
          <div className="mb-4 p-3 bg-gray-800 text-white text-sm rounded-md flex justify-between items-center shadow-lg">
            <span>{mensajeExito}</span>
            <button className="bg-teal-400 text-gray-900 px-3 py-1 rounded-md font-medium text-xs">
              Aceptar
            </button>
          </div>
        )}

        <form onSubmit={manejarRegistro} className="space-y-4">
          {/* Campo: Tipo de Perfil */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Tipo de Perfil</label>
            <select 
              value={tipoPerfil}
              onChange={(e) => setTipoPerfil(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option>Proveedor / Farmacia B2B (Freemium 3/3 SKUs)</option>
              <option>Familiar / Paciente</option>
            </select>
          </div>

          {/* Campo: Correo Electrónico */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                ✉️
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos@ejemplo.com"
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          {/* Campo: Contraseña (AQUÍ ESTÁ EL OJITO) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                🔒
              </span>
              <input
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {mostrarPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-teal-600 text-white font-medium py-2 rounded-md hover:bg-teal-700 transition flex justify-center items-center mt-2"
          >
            {cargando ? "Registrando..." : "Registrar Cuenta Gratis →"}
          </button>
          
          {/* Las últimas líneas exactas de tu captura */}
          <div className="text-center pt-4 border-t border-slate-100 mt-4">
            <p className="text-xs text-slate-500">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-sky-600 font-bold hover:underline">Inicia sesión</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}