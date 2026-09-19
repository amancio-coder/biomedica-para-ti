"use client";
import { useState } from "react";
import { Search, ShoppingBag, ShieldCheck, MapPin, Phone, Clock, AlertTriangle, CheckCircle2, QrCode, ArrowRight, User, HeartPulse, Building2, Ticket } from "lucide-react";

interface PublicProduct {
  id: string;
  providerName: string;
  zone: string;
  verified247: boolean;
  name: string;
  category: "Oxígeno" | "Fármacos UCI" | "Descartables" | "Equipamiento";
  stock: number;
  priceBs: number;
  urgent247: boolean;
}

interface FamilyReservation {
  id: string;
  productName: string;
  providerName: string;
  hospitalTarget: string;
  patientName: string;
  status: "Reservado (Listo para recojo)" | "Entregado";
  time: string;
  ticketCode: string;
}

const INITIAL_CATALOG: PublicProduct[] = [
  { id: "p1", providerName: "Farmacia Cruz Azul (4to Anillo)", zone: "Zona Norte / 4to Anillo", verified247: true, name: "Oxígeno Medicinal Cilindro 10m³ (Recarga)", category: "Oxígeno", stock: 15, priceBs: 350, urgent247: true },
  { id: "p2", providerName: "Farmacia Cruz Azul (4to Anillo)", zone: "Zona Norte / 4to Anillo", verified247: true, name: "Enoxaparina Sódica 40mg/0.4ml (Caja x 10)", category: "Fármacos UCI", stock: 8, priceBs: 480, urgent247: true },
  { id: "p3", providerName: "Farmacia Cruz Azul (4to Anillo)", zone: "Zona Norte / 4to Anillo", verified247: true, name: "Kit Intubación Difícil / Laringoscopio LED", category: "Equipamiento", stock: 3, priceBs: 1200, urgent247: false },
  { id: "p4", providerName: "Biomedical Santa Cruz 24/7", zone: "Equipetrol / 3er Anillo", verified247: true, name: "Albúmina Humana 20% 50ml IV", category: "Fármacos UCI", stock: 5, priceBs: 650, urgent247: true },
  { id: "p5", providerName: "OxigAS Bolivia", zone: "Av. Radial 19", verified247: true, name: "Cilindro Oxígeno Portátil 2m³ + Manómetro", category: "Oxígeno", stock: 12, priceBs: 850, urgent247: true },
  { id: "p6", providerName: "Farmacia San José", zone: "Radial 27 / Doble Vía La Guardia", verified247: true, name: "Midazolam 15ml / 5mg Ampolla UCI", category: "Fármacos UCI", stock: 20, priceBs: 45, urgent247: true },
];

const HOSPITALS_LIST = [
  "Hospital Obrero No. 1 (CNS)",
  "Clínica MediSur",
  "Hospital San Juan de Dios",
  "Hospital Japonés",
  "Clínica Foianini",
  "Atención Externa / Domicilio crítico"
];

export default function MarketplaceFamilyPage() {
  const [catalog, setCatalog] = useState<PublicProduct[]>(INITIAL_CATALOG);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [onlyUrgent247, setOnlyUrgent247] = useState(false);

  // Cuota familiar (Free: 5 solicitudes diarias)
  const maxDailyQuota = 5;
  const [dailyQuotaUsed, setDailyQuotaUsed] = useState(2); // Ejemplo de uso actual
  const quotaRemaining = maxDailyQuota - dailyQuotaUsed;

  // Estado del modal de rescate familiar
  const [bookingProduct, setBookingProduct] = useState<PublicProduct | null>(null);
  const [targetHospital, setTargetHospital] = useState(HOSPITALS_LIST[0]);
  const [patientFullName, setPatientFullName] = useState("");
  const [familyPhone, setFamilyPhone] = useState("+591 7");

  // Historial de tickets generados
  const [tickets, setTickets] = useState<FamilyReservation[]>([
    {
      id: "t-001",
      productName: "Oxígeno Medicinal Cilindro 10m³ (Recarga)",
      providerName: "Farmacia Cruz Azul (4to Anillo)",
      hospitalTarget: "Hospital Obrero No. 1 (CNS)",
      patientName: "Juan C. (Piso 2 - Cama 12)",
      status: "Reservado (Listo para recojo)",
      time: "19:40",
      ticketCode: "RSV-BO-8921"
    }
  ]);

  const [activeTab, setActiveTab] = useState<"vitrina" | "mis_tickets">("vitrina");

  // Filtrado de productos
  const filteredCatalog = catalog.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesUrgent = !onlyUrgent247 || p.urgent247;
    return matchesSearch && matchesCat && matchesUrgent;
  });

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingProduct || quotaRemaining <= 0 || !patientFullName.trim()) return;

    // Descontar stock simulado
    setCatalog(catalog.map(item => item.id === bookingProduct.id ? { ...item, stock: Math.max(0, item.stock - 1) } : item));
    
    // Incrementar cuota usada
    setDailyQuotaUsed(prev => prev + 1);

    const newTicket: FamilyReservation = {
      id: `t-${Date.now()}`,
      productName: bookingProduct.name,
      providerName: bookingProduct.providerName,
      hospitalTarget: targetHospital,
      patientName: patientFullName,
      status: "Reservado (Listo para recojo)",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ticketCode: `RSV-BO-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setTickets([newTicket, ...tickets]);
    setBookingProduct(null);
    setPatientFullName("");
    setActiveTab("mis_tickets");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Familiar / Rescate */}
        <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <HeartPulse size={13} /> Auxilio Familiar B2C • Red Santa Cruz
              </span>
              <span className="text-xs text-sky-200">SEDES Verificado 24/7</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Marketplace de Insumos Críticos & Recetas</h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Busca oxígeno, anticoagulantes o fármacos UCI en farmacias de guardia acreditadas. Bloquea stock exprés para tu paciente en red hospitalaria.
            </p>
          </div>

          {/* Cuota diaria del familiar (5 req/día) */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs space-y-2 min-w-[240px]">
            <div className="flex justify-between font-semibold">
              <span className="text-sky-200">Cuota Rescate Diario:</span>
              <strong className="text-white">{quotaRemaining} / {maxDailyQuota} disponibles</strong>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full transition-all" 
                style={{ width: `${(quotaRemaining / maxDailyQuota) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-sky-200/80 block">Reinicia en medianoche (Cero costo B2C)</span>
          </div>
        </div>

        {/* Pestañas de Navegación Rápida */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("vitrina")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "vitrina" 
                ? 'bg-sky-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag size={14} /> Vitrina 24/7 ({filteredCatalog.length})
          </button>
          <button
            onClick={() => setActiveTab("mis_tickets")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === "mis_tickets" 
                ? 'bg-sky-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Ticket size={14} /> Mis Tickets de Rescate ({tickets.length})
          </button>
        </div>

        {activeTab === "vitrina" ? (
          <>
            {/* Filtros de búsqueda */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar insumo, fármaco (ej. Enoxaparina, Oxígeno, Albúmina)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white font-medium outline-none"
                >
                  <option value="Todos">Todas las categorías</option>
                  <option value="Oxígeno">Oxígeno</option>
                  <option value="Fármacos UCI">Fármacos UCI</option>
                  <option value="Descartables">Descartables</option>
                  <option value="Equipamiento">Equipamiento</option>
                </select>

                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyUrgent247}
                    onChange={(e) => setOnlyUrgent247(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Solo Críticos 24/7</span>
                </label>
              </div>
            </div>

            {/* Grilla de productos en vitrina */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCatalog.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {prod.category}
                      </span>
                      {prod.urgent247 && (
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle size={11} /> Crítico 24/7
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 leading-snug">{prod.name}</h3>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <ShieldCheck size={14} className="text-emerald-600" /> {prod.providerName}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" /> {prod.zone}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Precio direct-to-patient</span>
                      <span className="text-base font-extrabold text-slate-900">Bs. {prod.priceBs}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
                        prod.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        Stock: {prod.stock} un.
                      </span>

                      {prod.stock > 0 && quotaRemaining > 0 ? (
                        <button
                          onClick={() => {
                            setBookingProduct(prod);
                            setTargetHospital(HOSPITALS_LIST[0]);
                          }}
                          className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                          Reservar <ArrowRight size={13} />
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-2 rounded-xl">
                          {prod.stock === 0 ? 'Agotado' : 'Sin cuota'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Pestaña: Mis Tickets de Rescate con QR / Código */
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                No tienes tickets de rescate activos.
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-md">
                        {t.ticketCode}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {t.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mt-1">{t.productName}</h3>
                    <p className="text-xs text-slate-600">
                      Farmacia: <strong className="text-slate-800">{t.providerName}</strong> • Paciente/Destino: <strong>{t.patientName} ({t.hospitalTarget})</strong>
                    </p>
                    <span className="text-[10px] text-slate-400 block">Generado a las {t.time}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-center">
                      <QrCode size={36} />
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700 block">Presentar en ventanilla</span>
                      o coordinar flete express
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* MODAL RESERVA / TICKET FAMILIAR */}
      {bookingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  Reserva Express B2C
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">{bookingProduct.name}</h3>
                <p className="text-xs text-slate-500">{bookingProduct.providerName} • Bs. {bookingProduct.priceBs}</p>
              </div>
              <button
                onClick={() => setBookingProduct(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-3 text-xs pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Centro de Salud / Destino del Paciente</label>
                <select
                  value={targetHospital}
                  onChange={(e) => setTargetHospital(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white font-medium outline-none"
                >
                  {HOSPITALS_LIST.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre y Cama / Referencia del Paciente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan C. (Piso 2 - Cama 12) o N.N. Emergencia"
                  value={patientFullName}
                  onChange={(e) => setPatientFullName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Celular del Familiar a cargo (Notificación QR)</label>
                <input
                  type="text"
                  value={familyPhone}
                  onChange={(e) => setFamilyPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-[11px] text-sky-900">
                ℹ️ Al confirmar, bloqueas 1 unidad de stock y generas un <strong>Ticket QR</strong> con validez de 2 horas para recojo físico o despacho de moto-flete. Cuota restante hoy: <strong>{quotaRemaining - 1}</strong>.
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setBookingProduct(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs"
                >
                  Generar Ticket QR Rescate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}