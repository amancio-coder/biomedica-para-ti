"use client"; // Esta línea es obligatoria para usar interactividad (clics) en Next.js

import { useState } from "react";
import { HeartPulse, Stethoscope, Activity, Syringe, ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  // Estado para controlar qué pregunta del acordeón está abierta
  const [preguntaAbierta, setPreguntaAbierta] = useState<number | null>(null);

  const modulos = [
    { id: 1, titulo: "Primeros Auxilios", desc: "Aprende los protocolos básicos para actuar frente a emergencias médicas.", icono: <Activity className="text-sky-500" size={32} /> },
    { id: 2, titulo: "Anatomía Básica", desc: "Explora los sistemas principales y el funcionamiento del cuerpo humano.", icono: <Stethoscope className="text-sky-500" size={32} /> },
    { id: 3, titulo: "Farmacología", desc: "Guía informativa sobre el uso adecuado de medicamentos comunes.", icono: <Syringe className="text-sky-500" size={32} /> },
  ];

  const faqs = [
    { id: 1, preg: "¿A quién va dirigido este curso?", resp: "A estudiantes, profesionales de la salud y cualquier persona interesada en adquirir conocimientos básicos de biomédica." },
    { id: 2, preg: "¿Necesito conocimientos previos?", resp: "No, los módulos están diseñados para que puedas aprender desde cero y a tu propio ritmo." },
    { id: 3, preg: "¿Se entrega algún certificado?", resp: "Sí, al completar todos los módulos y evaluaciones, recibirás un certificado digital de participación." }
  ];

  const toggleFaq = (id: number) => {
    setPreguntaAbierta(preguntaAbierta === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Cabecera */}
      <header className="bg-sky-600 text-white p-6 shadow-md flex items-center justify-center gap-3">
        <HeartPulse size={32} />
        <h1 className="text-2xl font-bold tracking-wide">BIOMÉDICA PARA TI</h1>
      </header>

      <div className="max-w-5xl mx-auto p-6 mt-8">
        {/* Sección 1: Tarjetas de Módulos */}
        <section>
          <h2 className="text-2xl font-semibold text-sky-800 mb-8 text-center">
            Módulos Informativos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modulos.map((mod) => (
              <div key={mod.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center">
                <div className="bg-sky-50 p-4 rounded-full mb-4">
                  {mod.icono}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{mod.titulo}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección 2: Acordeón FAQ */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-sky-800 mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span className="font-semibold text-slate-700">{faq.preg}</span>
                  {preguntaAbierta === faq.id ? (
                    <ChevronUp className="text-sky-500 min-w-6" />
                  ) : (
                    <ChevronDown className="text-slate-400 min-w-6" />
                  )}
                </button>
                
                {/* Contenido de la respuesta (solo se muestra si está abierta) */}
                {preguntaAbierta === faq.id && (
                  <div className="p-5 pt-0 text-slate-600 border-t border-slate-100 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {faq.resp}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}