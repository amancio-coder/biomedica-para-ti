"use client";
import { useState, useEffect } from "react";
import { 
  Building2, BedDouble, CheckCircle2, AlertTriangle, 
  ShieldCheck, ArrowLeft, Ambulance, MessageSquare, Send, X, UserCheck, Siren, HeartPulse, PhoneCall, Lock, Crown, SlidersHorizontal, Bell, BellRing, Volume2, VolumeX 
} from "lucide-react";

interface Bed {
  id: string;
  hospital: string;
  room: string;
  status: "disponible" | "ocupada" | "desocupando";
  patientDetails?: string;
  triage?: "Rojo" | "Naranja" | "Amarillo";
  responsibleStaff?: string;
}

interface CriticalAlert {
  id: string;
  originHospital: string;
  patientName: string;
  diagnosis: string;
  triage: "Rojo" | "Naranja";
  timeElapsed: string;
}

interface ChatMessage {
  id: string;
  fromHospital: string;
  toHospital: string;
  text: string;
  time: string;
}

const HOSPITAL_STAFF_LIST: Record<string, string[]> = {
  "Hospital Obrero No. 1": ["Enf. Cecilia Mamani (Guardia A)", "Dr. Rodrigo Rojas (Med. Reg.)", "Enf. Marco Flores (UCI)"],
  "Clínica MediSur": ["Enf. Andrea Soliz (Emergencia)", "Dr. Fernando Paz (Jefe Turno)"],
  "Hospital San Juan de Dios": ["Dr. Carlos Méndez (Guardia Central)", "Enf. Patricia Lima (Trauma)"],
  "Hospital Japonés": ["Dr. Javier Soto (UCI General)", "Enf. Sonia Vargas (Coord. Red)"],
  "Clínica Foianini": ["Dr. Marcelo Suárez (Guardia Privada)", "Enf. Lucía Prado (Qx)"]
};

const INITIAL_BEDS: Bed[] = [
  { id: "1", hospital: "Hospital Obrero No. 1", room: "UCI-101", status: "disponible" },
  { id: "2", hospital: "Hospital Obrero No. 1", room: "UCI-102", status: "disponible" },
  { id: "3", hospital: "Hospital Obrero No. 1", room: "Piso 2 - Cama 12", status: "ocupada", patientDetails: "🚑 Ambulancia: Accidente tránsito - ETA 15m", triage: "Rojo", responsibleStaff: "Enf. Cecilia Mamani (Guardia A)" },
  { id: "4", hospital: "Hospital Obrero No. 1", room: "Piso 2 - Cama 14", status: "desocupando" },
  { id: "5", hospital: "Hospital Obrero No. 1", room: "Piso 3 - Cama 05", status: "disponible" },

  { id: "6", hospital: "Clínica MediSur", room: "Emergencias-01", status: "disponible" },
  { id: "7", hospital: "Clínica MediSur", room: "UCI-02", status: "ocupada", patientDetails: "⚡ Escalamiento Interno (Piso ➔ UCI)", triage: "Naranja", responsibleStaff: "Enf. Andrea Soliz (Emergencia)" },
  { id: "8", hospital: "Clínica MediSur", room: "Piso 1 - Cama 08", status: "disponible" },
  { id: "9", hospital: "Clínica MediSur", room: "Piso 1 - Cama 09", status: "disponible" },

  { id: "10", hospital: "Hospital San Juan de Dios", room: "Trauma-01", status: "disponible" },
  { id: "11", hospital: "Hospital San Juan de Dios", room: "Trauma-02", status: "disponible" },
  { id: "12", hospital: "Hospital San Juan de Dios", room: "UCI-01", status: "disponible" },

  { id: "13", hospital: "Hospital Japonés", room: "UCI-05", status: "disponible" },
  { id: "14", hospital: "Hospital Japonés", room: "UCI-06", status: "disponible" },
  { id: "15", hospital: "Hospital Japonés", room: "Piso 4 - Cama 01", status: "desocupando" },

  { id: "16", hospital: "Clínica Foianini", room: "Suite-01", status: "disponible" },
  { id: "17", hospital: "Clínica Foianini", room: "Suite-02", status: "disponible" },
];

const INITIAL_CRITICAL_ALERTS: CriticalAlert[] = [
  { id: "c1", originHospital: "Hospital de Clínicas", patientName: "Juan C. (Politrauma severo)", diagnosis: "TEC grave / Hemorragia", triage: "Rojo", timeElapsed: "25 min en espera" },
  { id: "c2", originHospital: "Red Pública Sur", patientName: "Carmen V. (Sepsis / Fallo orgánico)", diagnosis: "Requiere aislamiento UCI", triage: "Naranja", timeElapsed: "40 min en espera" }
];

export default function HospitalsDashboardPage() {
  const [isStaff, setIsStaff] = useState(true);
  const [userRole, setUserRole] = useState<"operativo" | "supervisor">("supervisor");
  const [currentUserHospital, setCurrentUserHospital] = useState("Hospital Obrero No. 1");
  const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
  const [criticalQueue, setCriticalQueue] = useState<CriticalAlert[]>(INITIAL_CRITICAL_ALERTS);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  
  // Alarma acústica S.O.S.
  const [isAlarmMuted, setIsAlarmMuted] = useState(false);

  // Efecto de sirena desesperada con Web Audio API cuando criticalQueue > 0
  useEffect(() => {
    if (criticalQueue.length === 0 || isAlarmMuted) return;

    const playUrgentBeep = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        // Tono 1 alto agudo
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(980, now);
        osc1.frequency.setValueAtTime(520, now + 0.12);
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.25);

        // Segundo beat rápido de urgencia
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(980, now + 0.3);
        osc2.frequency.setValueAtTime(520, now + 0.42);
        gain2.gain.setValueAtTime(0.18, now + 0.3);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.3);
        osc2.stop(now + 0.55);
      } catch (e) {
        // Ignorar restricciones de audio del navegador antes de interacción del usuario
      }
    };

    playUrgentBeep();
    const interval = setInterval(playUrgentBeep, 2000); // Repetir cada 2 segundos sirena corta
    return () => clearInterval(interval);
  }, [criticalQueue.length, isAlarmMuted]);

  // Admin Maestro Camas
  const [showSupervisorAdminModal, setShowSupervisorAdminModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomHospital, setNewRoomHospital] = useState(currentUserHospital);

  // Modal reserva
  const [emergencyModalBed, setEmergencyModalBed] = useState<Bed | null>(null);
  const [reservationType, setReservationType] = useState<string>("ambulancia");
  const [referenceDetail, setReferenceDetail] = useState("");
  const [selectedTriage, setSelectedTriage] = useState<Bed["triage"]>("Rojo");
  const [selectedStaff, setSelectedStaff] = useState(HOSPITAL_STAFF_LIST[currentUserHospital]?.[0] || "");

  // Modal Auxilio crítico
  const [showEmergencyCallModal, setShowEmergencyCallModal] = useState(false);
  const [newAlertPatient, setNewAlertPatient] = useState("");
  const [newAlertDiag, setNewAlertDiag] = useState("");

  // Chat Red
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [targetChatHospital, setTargetChatHospital] = useState("Clínica MediSur");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", fromHospital: "Clínica MediSur", toHospital: "Hospital Obrero No. 1", text: "Hola, ¿tienen espacio UCI para derivación politrauma?", time: "20:10" }
  ]);
  const [newMessageText, setNewMessageText] = useState("");

  const hospitalsList = Array.from(new Set(beds.map(b => b.hospital)));
  const getStats = (hospitalName: string) => {
    const hBeds = beds.filter(b => b.hospital === hospitalName);
    return {
      total: hBeds.length,
      disponible: hBeds.filter(b => b.status === "disponible").length,
      ocupada: hBeds.filter(b => b.status === "ocupada").length,
      desocupando: hBeds.filter(b => b.status === "desocupando").length,
    };
  };

  const updateStatus = (id: string, newStatus: Bed["status"]) => {
    setBeds(beds.map(b => b.id === id ? { ...b, status: newStatus, patientDetails: undefined, triage: undefined, responsibleStaff: undefined } : b));
  };

  const handleCreateRoomBySupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const newBed: Bed = {
      id: Date.now().toString(),
      hospital: newRoomHospital,
      room: newRoomName.trim(),
      status: "disponible"
    };
    setBeds([...beds, newBed]);
    setNewRoomName("");
    setShowSupervisorAdminModal(false);
  };

  const handleSmartReservation = () => {
    if (!emergencyModalBed || !referenceDetail.trim()) return;
    let prefix = "🚑 Ambulancia";
    if (reservationType === "derivacion") prefix = "🔄 Derivación Red";
    if (reservationType === "uci_interno") prefix = "⚡ Interno UCI";
    if (reservationType === "post_alta") prefix = "🕒 Post-Alta";

    setBeds(beds.map(b => b.id === emergencyModalBed.id ? { 
      ...b, 
      status: "ocupada", 
      patientDetails: `${prefix}: ${referenceDetail}`,
      triage: selectedTriage,
      responsibleStaff: selectedStaff
    } : b));

    setEmergencyModalBed(null);
    setReferenceDetail("");
  };

  const handlePatientDirectReservation = (bedId: string) => {
    setBeds(beds.map(b => b.id === bedId ? { 
      ...b, 
      status: 'ocupada', 
      patientDetails: '👤 Reserva Paciente (Programada / Solicitud Directa)',
      triage: 'Amarillo',
      responsibleStaff: 'Admisión / Paciente Web'
    } : b));
  };

  const handlePublishCriticalAlert = () => {
    if (!newAlertPatient.trim() || !newAlertDiag.trim()) return;
    const newAlert: CriticalAlert = {
      id: Date.now().toString(),
      originHospital: currentUserHospital,
      patientName: newAlertPatient,
      diagnosis: newAlertDiag,
      triage: "Rojo",
      timeElapsed: "0 min (Nuevo S.O.S.)"
    };
    setCriticalQueue([newAlert, ...criticalQueue]);
    setShowEmergencyCallModal(false);
    setNewAlertPatient("");
    setNewAlertDiag("");
  };

  const acceptAndAssignSOS = (alert: CriticalAlert, freeBedId: string) => {
    const targetBed = beds.find(b => b.id === freeBedId);
    if (!targetBed) return;

    setBeds(prev => prev.map(b => b.id === freeBedId ? {
      ...b,
      status: "ocupada",
      patientDetails: `🚨 DERIVACIÓN ACEPTADA: ${alert.patientName} (${alert.diagnosis}) [Origen: ${alert.originHospital}]`,
      triage: alert.triage,
      responsibleStaff: selectedStaff || "Guardia Regulación"
    } : b));

    setCriticalQueue(prev => prev.filter(a => a.id !== alert.id));

    const matchedChatTarget = hospitalsList.find(h => alert.originHospital.includes(h.split(' ')[0])) || targetChatHospital;
    setTargetChatHospital(matchedChatTarget);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      fromHospital: currentUserHospital,
      toHospital: matchedChatTarget,
      text: `✅ [ACUERDO CONFIRMADO] ${currentUserHospital} acepta derivación de ${alert.patientName}. Asignada cama ${targetBed.room}. Personal responsable notificado.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setIsChatOpen(true);
  };

  const sendMessage = () => {
    if (!newMessageText.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      fromHospital: currentUserHospital,
      toHospital: targetChatHospital,
      text: newMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessageText("");
  };

  const myFreeBeds = beds.filter(b => b.hospital === currentUserHospital && b.status === 'disponible');

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header con indicador sonoro de alarma SOS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">Red Hospitalaria - Bolivia</h1>
              {criticalQueue.length > 0 && (
                <button
                  onClick={() => setIsAlarmMuted(!isAlarmMuted)}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all animate-bounce ${
                    isAlarmMuted 
                      ? 'bg-slate-200 text-slate-700' 
                      : 'bg-rose-600 text-white shadow-md'
                  }`}
                  title="Activar/Silenciar Alarma S.O.S."
                >
                  {isAlarmMuted ? <VolumeX size={13} /> : <BellRing size={13} />}
                  <span>{isAlarmMuted ? 'Alarma S.O.S. Silenciada' : 'Alarma S.O.S. Activa'}</span>
                </button>
              )}
            </div>
            <p className="text-sm text-slate-500">Regulación crítica y alta disponibilidad de pruebas multi-hospital.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isStaff && userRole === "supervisor" && (
              <button
                onClick={() => {
                  setNewRoomHospital(currentUserHospital);
                  setShowSupervisorAdminModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <SlidersHorizontal size={14} /> Admin Maestro Camas
              </button>
            )}
            <button
              onClick={() => setShowEmergencyCallModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm animate-pulse"
            >
              <Siren size={14} /> Pedir Auxilio SOS Crítico
            </button>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="relative bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-100"
            >
              <MessageSquare size={14} className="text-sky-600" />
              Chat Red ({hospitalsList.length - 1} centros)
            </button>
            <button
              onClick={() => setIsStaff(!isStaff)}
              className="text-xs bg-sky-100 text-sky-800 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck size={14} /> Modo: {isStaff ? "Personal Acreditado" : "Paciente"}
            </button>
          </div>
        </div>

        {/* Simulador de sesión hospitalaria activa y alternador de rol */}
        {isStaff && (
          <div className="mb-6 bg-sky-50 border border-sky-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-900">Hospital activo de sesión:</span>
              <select
                value={currentUserHospital}
                onChange={(e) => {
                  const h = e.target.value;
                  setCurrentUserHospital(h);
                  setSelectedStaff(HOSPITAL_STAFF_LIST[h]?.[0] || "");
                }}
                className="bg-white border border-sky-300 rounded-lg px-2.5 py-1 font-bold text-sky-900 outline-none"
              >
                {hospitalsList.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white border border-sky-200 px-2.5 py-1 rounded-lg">
                <Crown size={13} className="text-amber-500" />
                <span className="font-semibold text-slate-700">Rol:</span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as "operativo" | "supervisor")}
                  className="font-bold text-sky-800 outline-none bg-transparent"
                >
                  <option value="supervisor">Jefe de Turno / Supervisor</option>
                  <option value="operativo">Personal Operativo / Guardia</option>
                </select>
              </div>
              <span className="text-sky-700 font-medium hidden sm:inline flex items-center gap-1">
                <PhoneCall size={13} /> Libres centro: {myFreeBeds.length}
              </span>
            </div>
          </div>
        )}

        {/* DASHBOARD DE AUXILIO / PACIENTES CRÍTICOS EN ESPERA (S.O.S. con Campanita visual parpadeante) */}
        <div className={`mb-8 border rounded-2xl p-5 shadow-sm transition-colors ${
          criticalQueue.length > 0 ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200/50' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${criticalQueue.length > 0 ? 'bg-rose-600 text-white animate-bounce' : 'bg-slate-200 text-slate-600'}`}>
                {criticalQueue.length > 0 ? <BellRing size={18} /> : <Bell size={18} />}
              </div>
              <h2 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                <HeartPulse className="text-rose-600" size={18} /> 
                Dashboard de Auxilio: Pacientes Críticos en Espera ({criticalQueue.length})
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
              Visibilidad de Red • Asigna solo tu centro activo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {criticalQueue.length === 0 ? (
              <p className="text-xs text-rose-600/70 italic">No hay alertas de auxilio crítico pendientes en la red.</p>
            ) : (
              criticalQueue.map(alert => (
                <div key={alert.id} className="bg-white border border-rose-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-800">{alert.patientName}</span>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">Triage {alert.triage}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Diagnóstico: {alert.diagnosis}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Origen: {alert.originHospital} • {alert.timeElapsed}</p>
                  </div>

                  {isStaff && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-700">
                        Aceptar acuerdo y asignar desde <strong>{currentUserHospital}</strong>:
                      </span>
                      {myFreeBeds.length === 0 ? (
                        <span className="text-[10px] text-rose-600 font-semibold italic">Sin camas libres en tu centro para absorber este SOS.</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {myFreeBeds.map(freeB => (
                            <button
                              key={freeB.id}
                              onClick={() => acceptAndAssignSOS(alert, freeB.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs transition-colors"
                            >
                              Aceptar en {freeB.room}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* VISTA 1: Resumen por Hospital */}
        {!selectedHospital ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitalsList.map(hName => {
              const stats = getStats(hName);
              const isMyHospital = hName === currentUserHospital;
              return (
                <div 
                  key={hName}
                  onClick={() => setSelectedHospital(hName)}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between relative"
                >
                  {isStaff && isMyHospital && (
                    <span className="absolute top-4 right-4 bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Tu Centro
                    </span>
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-sky-700 mb-2">
                      <Building2 size={20} />
                      <h2 className="text-xl font-bold text-slate-800">{hName}</h2>
                    </div>
                    <p className="text-xs text-slate-400 mb-6">Haz clic para ver camas, personal de guardia y flujos ({stats.total} total)</p>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                        <span className="text-xs text-emerald-600 font-semibold block">Libres</span>
                        <span className="text-xl font-bold text-emerald-800">{stats.disponible}</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <span className="text-xs text-amber-600 font-semibold block">Limpieza</span>
                        <span className="text-xl font-bold text-amber-800">{stats.desocupando}</span>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
                        <span className="text-xs text-rose-600 font-semibold block">Ocupadas</span>
                        <span className="text-xl font-bold text-rose-800">{stats.ocupada}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VISTA 2: Detalle de Camas del Hospital seleccionado */
          <div>
            <button
              onClick={() => setSelectedHospital(null)}
              className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft size={16} /> Volver a red de hospitales
            </button>

            <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedHospital}</h2>
                <p className="text-sm text-slate-500">
                  {selectedHospital === currentUserHospital 
                    ? `Administración activa (${userRole === 'supervisor' ? 'Modo Jefe de Turno / Maestro' : 'Personal Operativo'}).` 
                    : `Monitoreo en solo lectura (Sesión activa en ${currentUserHospital}).`}
                </p>
              </div>
              {selectedHospital !== currentUserHospital && (
                <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Lock size={13} /> Solo Lectura
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {beds.filter(b => b.hospital === selectedHospital).map((bed) => {
                const canManageThisBed = isStaff && selectedHospital === currentUserHospital;

                return (
                  <div key={bed.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-slate-800">{bed.room}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          bed.status === 'disponible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          bed.status === 'ocupada' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {bed.status}
                        </span>
                      </div>

                      {bed.patientDetails && (
                        <div className="mt-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                          <p className="text-xs font-medium text-slate-700">{bed.patientDetails}</p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                            {bed.triage && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                bed.triage === 'Rojo' ? 'bg-rose-100 text-rose-800' :
                                bed.triage === 'Naranja' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                Triage: {bed.triage}
                              </span>
                            )}
                            {bed.responsibleStaff && (
                              <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                                Resp: {bed.responsibleStaff}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* VISTA PACIENTE */}
                    {!isStaff && bed.status === 'disponible' && (
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handlePatientDirectReservation(bed.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                        >
                          <UserCheck size={14} /> Solicitar / Reservar Cama
                        </button>
                      </div>
                    )}

                    {/* VISTA PERSONAL ACREDITADO */}
                    {canManageThisBed ? (
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex gap-1.5 mb-2">
                          <button onClick={() => updateStatus(bed.id, "disponible")} className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs py-1.5 rounded-lg font-medium">Libre</button>
                          <button onClick={() => updateStatus(bed.id, "desocupando")} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs py-1.5 rounded-lg font-medium">Limpieza</button>
                          <button onClick={() => updateStatus(bed.id, "ocupada")} className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs py-1.5 rounded-lg font-medium">Ocupada</button>
                        </div>
                        
                        {bed.status === 'disponible' && (
                          <button
                            onClick={() => {
                              setEmergencyModalBed(bed);
                              setReservationType("ambulancia");
                              setSelectedTriage("Rojo");
                              setSelectedStaff(HOSPITAL_STAFF_LIST[currentUserHospital]?.[0] || "");
                            }}
                            className="w-full mt-1 bg-sky-600 hover:bg-sky-700 text-white text-xs py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Ambulance size={14} /> Gestión de Ingreso / Tránsito
                          </button>
                        )}
                      </div>
                    ) : isStaff && (
                      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                        <span className="text-[11px] text-slate-400 font-medium italic flex items-center justify-center gap-1">
                          <Lock size={11} /> Solo lectura (No asignado a este centro)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL ADMIN MAESTRO DE CAMAS */}
      {showSupervisorAdminModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-indigo-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <SlidersHorizontal className="text-indigo-600" /> Administración Maestra de Camas
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Alta/baja de unidades, salas y auditoría de inventario físico por centro de salud (Acceso exclusivo Supervisor / Jefe de Turno).
            </p>

            <form onSubmit={handleCreateRoomBySupervisor} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Centro de Salud Destino</label>
                <select
                  value={newRoomHospital}
                  onChange={(e) => setNewRoomHospital(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                >
                  {hospitalsList.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre / Identificador de Cama / Sala</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Ej. UCI-105 o Piso 4 - Cama 15"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-1">Estado actual del inventario en {newRoomHospital}:</span>
                <p>Total de camas: <strong>{getStats(newRoomHospital).total}</strong> (Libres: {getStats(newRoomHospital).disponible})</p>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowSupervisorAdminModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
                >
                  Registrar Nueva Cama
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RESERVA / TRÁNSITO */}
      {emergencyModalBed && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Ambulance className="text-sky-600" /> Reserva / Movimiento de Cama
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configurando <strong className="text-slate-700">{emergencyModalBed.room}</strong> ({emergencyModalBed.hospital})
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Responsable / Guardián Asignado</label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
                >
                  {(HOSPITAL_STAFF_LIST[currentUserHospital] || ["Personal de Guardia"]).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Ingreso / Movimiento</label>
                <select 
                  value={reservationType}
                  onChange={(e) => setReservationType(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
                >
                  <option value="ambulancia">🚑 Ambulancia / Accidente Externo (ETA)</option>
                  <option value="derivacion">🔄 Derivación Red Interhospitalaria</option>
                  <option value="uci_interno">⚡ Escalamiento Interno (Piso ➔ UCI)</option>
                  <option value="post_alta">🕒 Reserva Post-Alta / Camilla en tránsito</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nivel de Triage (Gravedad)</label>
                <div className="flex gap-2">
                  {(["Rojo", "Naranja", "Amarillo"] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTriage(t)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        selectedTriage === t 
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detalle o Referencia (ETA / Médico / Origen)</label>
                <input
                  type="text"
                  value={referenceDetail}
                  onChange={(e) => setReferenceDetail(e.target.value)}
                  placeholder="Ej. Poli-trauma colisión - ETA 15 min / Dr. Soto"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={() => setEmergencyModalBed(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSmartReservation}
                className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-sm"
              >
                Confirmar Bloqueo de Cama
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PEDIR AUXILIO SOS CRÍTICO */}
      {showEmergencyCallModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-rose-200">
            <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2">
              <Siren className="text-rose-600" /> S.O.S. / Auxilio Crítico en Red
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Publicar paciente crítico sin cama asignada desde <strong className="text-slate-700">{currentUserHospital}</strong> para que la red responda tras acuerdo telefónico/chat.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre / Identificación del Paciente</label>
                <input
                  type="text"
                  value={newAlertPatient}
                  onChange={(e) => setNewAlertPatient(e.target.value)}
                  placeholder="Ej. N.N. / Roberto M. - 54 años"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diagnóstico Crítico / Requerimiento</label>
                <input
                  type="text"
                  value={newAlertDiag}
                  onChange={(e) => setNewAlertDiag(e.target.value)}
                  placeholder="Ej. IAM con elevación ST - Necesita UCI inmediata"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button
                onClick={() => setShowEmergencyCallModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublishCriticalAlert}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm"
              >
                Difundir SOS a la Red
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANEL LATERAL DE CHAT INTERHOSPITALARIO */}
      {isChatOpen && (
        <div className="fixed right-6 bottom-6 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col h-96 z-50 overflow-hidden">
          <div className="bg-sky-600 text-white px-4 py-3 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <MessageSquare size={16} /> Chat Red Hospitalaria
              </h3>
              <p className="text-[10px] text-sky-100">Coordinación de traslados y log de acuerdos</p>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Canal con:</span>
            <select
              value={targetChatHospital}
              onChange={(e) => setTargetChatHospital(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold outline-none"
            >
              {hospitalsList.filter(h => h !== currentUserHospital).map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.filter(m => 
              (m.fromHospital === currentUserHospital && m.toHospital === targetChatHospital) ||
              (m.fromHospital === targetChatHospital && m.toHospital === currentUserHospital)
            ).map(msg => {
              const isMine = msg.fromHospital === currentUserHospital;
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 mb-0.5">{msg.fromHospital} • {msg.time}</span>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                    isMine ? 'bg-sky-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe acuerdo de derivación..."
              className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={sendMessage}
              className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-xl flex items-center justify-center shadow-sm"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}