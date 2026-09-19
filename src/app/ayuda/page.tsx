export default function AyudaPage() {
  const faqs = [
    {
      pregunta: "¿Cómo funciona el rescate exprés de insumos o oxígeno (Cuota Diaria 3/5)?",
      respuesta: "Cuentas con un cupo de rescate exprés diario para bloquear fármacos críticos o oxígeno medicinal en farmacias de guardia SEDES acreditadas antes de acudir por ventanilla hospitalaria."
    },
    {
      pregunta: "¿Necesito estar registrado para consultar la red de camas o el marketplace?",
      respuesta: "No, las vitrinas de abastecimiento y la red de camas UCI/pisos son de consulta libre para emergencias públicas."
    },
    {
      pregunta: "¿Cuál es el tope del Plan Freemium para proveedores farmacéuticos?",
      respuesta: "Puedes registrar y mantener activos hasta 3 SKUs simultáneos de forma gratuita bajo validación de estado SEDES."
    }
  ];

  const tutorials = [
    {
      titulo: "Cómo bloquear oxígeno y fármacos UCI en 3 pasos",
      duracion: "2:15 min"
    },
    {
      titulo: "Guía de S.O.S. interhospitalario y red de camas críticas",
      duracion: "3:40 min"
    },
    {
      titulo: "Carga de catálogo técnico (3 SKUs Freemium B2B)",
      duracion: "4:00 min"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">Centro de Ayuda, FAQ y Tutoriales</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Soporte y guías audiovisuales para pacientes, familiares B2C y operadores de farmacia B2B en RedSalud•BO.
        </p>
      </div>

      {/* Video Tutorials Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🎥</span> Video Tutoriales para Pacientes Free & Operadores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutorials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="bg-slate-900 aspect-video flex items-center justify-center text-white text-xs font-medium relative group cursor-pointer">
                <span className="w-12 h-12 bg-teal-600/90 rounded-full flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition">
                  ▶
                </span>
                <span className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px]">
                  {t.duracion}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">{t.titulo}</h3>
                <p className="text-xs text-slate-500">Tutorial optimizado para acceso rápido en dispositivos móviles.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>❓</span> Preguntas Frecuentes (FAQ)
        </h2>
        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">{f.pregunta}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.respuesta}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}