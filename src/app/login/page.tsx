"use client";

import { useState } from "react";
// Asegúrate de que esta ruta coincida con la que usas en registro
import { supabase } from "../../lib/supabase"; 

export default function LoginPage() {
  // 1. Estados necesarios para el Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  
  // 2. Estado para el ojito de la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // 3. Función de Autenticación (Login)
  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (supabaseError) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } else {
      // Si el login es exitoso, redirigimos al dashboard o inicio
      window.location.href = "/dashboard/productos/nuevo";
    }
    
    setCargando(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        
        {/* Cabecera del Login */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <span className="bg-sky-100 text-sky-600 p-3 rounded-full">
              {/* Ícono de Usuario/Login */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Iniciar Sesión</h1>
          <p className="text-sm text-gray-500">Bienvenido de nuevo a RedSalud•BO</p>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={manejarLogin} className="space-y-4">
          
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
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
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
                className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
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

          {/* Botón de Ingresar */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-sky-600 text-white font-medium py-2 rounded-md hover:bg-sky-700 transition flex justify-center items-center mt-2"
          >
            {cargando ? "Iniciando Sesión..." : "Ingresar →"}
          </button>
          
          {/* Enlace para ir al registro */}
          <div className="text-center pt-4 border-t border-slate-100 mt-4">
            <p className="text-xs text-slate-500">
              ¿No tienes cuenta?{" "}
              <a href="/registro" className="text-green-600 font-bold hover:underline">Regístrate aquí</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}