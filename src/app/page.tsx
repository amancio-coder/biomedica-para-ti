import Link from "next/link";
import { Store, BedDouble, ShoppingBag, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sky-900 to-sky-800 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-700/60 border border-sky-600 px-3 py-1 rounded-full text-xs text-sky-200">
            <span>🌐</span> Ecosistema de Salud unificado • Bolivia
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Plataforma Integral Biomédica y Regulación
          </h1>
          <p className="text-sm md:text-base text-sky-100 max-w-2xl mx-auto">
            Conectamos la regulación de camas críticas entre centros de salud y el abastecimiento B2B/B4C de farmacias autorizadas en una sola interfaz de alta velocidad.
          </p>
        </div>
      </section>

      {/* 3 Cards Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pb-16">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-red-50 text-red-600 p-2.5 rounded-xl"><BedDouble className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">Crítico / Urgencias</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Red Hospitalaria & Camas UCI/Pisos</h3>
            <p className="text-xs text-slate-500">Monitoreo en tiempo real, S.O.S. de pacientes críticos, ambulancias y chat interhospitalario.</p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400">Multi-hospital (La Paz / Santa Cruz)</span>
            <Link href="/hospitales" className="text-sky-600 font-semibold hover:underline flex items-center gap-1">
              Acceder <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl"><ShoppingBag className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">Público / Abastecimiento</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Marketplace de Insumos & Oxigeno</h3>
            <p className="text-xs text-slate-500">Vitrina pública de fármacos críticos, descartables, equipos biomédicos y oxígeno medicinal.</p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400">Búsqueda y cotización rápida</span>
            <Link href="/marketplace" className="text-sky-600 font-semibold hover:underline flex items-center gap-1">
              Acceder <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl"><Store className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">Freemium Plan Free</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Panel de Farmacias & Proveedores (B2B)</h3>
            <p className="text-xs text-slate-500">Carga de catálogo técnico con tope Freemium (3 SKUs activos). Estado de acreditación SEDES.</p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400">Límite actual: 3/3 insumos</span>
            <Link href="/dashboard/productos/nuevo" className="text-sky-600 font-semibold hover:underline flex items-center gap-1">
              Acceder <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h4 className="font-bold text-base md:text-lg">¿ERES PROVEEDOR FARMACÉUTICO?</h4>
            <p className="text-xs text-slate-300 mt-1">Sube tus 3 insumos gratuitos o verifica tu acreditación SEDES.</p>
          </div>
          <Link
            href="/registro"
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap"
          >
            Gestionar Insumos Free →
          </Link>
        </div>
      </section>
    </div>
  );
}