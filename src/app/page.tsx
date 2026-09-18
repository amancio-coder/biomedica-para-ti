"use client";

import { useState } from "react";
import { 
  HeartPulse, Stethoscope, Activity, Syringe, 
  ChevronDown, ChevronUp, PlayCircle, 
  Mail, Phone, MapPin 
} from "lucide-react";

export default function Home() {
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

  const videos = [
    { id: 1, titulo: "Técnicas de RCP Básico", youtubeId: "dQw4w9WgXcQ" },
    { id: 2, titulo: "Reconocimiento de Signos Vitales", youtubeId: "jNQXAC9IVRw" }
  ];

  const toggleFaq = (id: number) => {
    setPreguntaAbierta(preguntaAbierta === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Cabecera */}
      <header className="bg-sky-600 text-white p-6 shadow-md flex items-center justify-center gap-3">
        <HeartPulse size={32} />
        <h1 className="text-2xl font-bold tracking-wide">BIOMÉDICA PARA TI</h1>
      </header>

      {/* Contenido Principal (ocupa el espacio disponible para empujar el footer abajo) */}
      <div className="flex-grow max-w-5xl mx-auto p-6 mt-8 w-full">
        {/* Sección 1: Tarjetas */}
        <section>
          <h2 className="text-2xl font-semibold text-sky-800 mb-8 text-center">
            Módulos Informativos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modulos.map((mod) => (
              <div key={mod.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center">
                <div className="bg-sky-50 p-4 rounded-full mb-4">{mod.icono}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{mod.titulo}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección 2: Videotutoriales */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-sky-800 mb-8 text-center flex items-center justify-center gap-2">
            <PlayCircle className="text-sky-500" /> Galería de Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {videos.map((vid) => (
              <div key={vid.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${vid.youtubeId}`}
                    title={vid.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="border-0"
                  ></iframe>
                </div>
                <h3 className="mt-4 text-center font-semibold text-slate-700">{vid.titulo}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Sección 3: Acordeón FAQ */}
        <section className="mt-20 mb-20">
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

      {/* Pie de página (Footer) */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t-4 border-sky-600">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna 1: Info de marca */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <HeartPulse className="text-sky-500" size={24} /> BIOMÉDICA PARA TI
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Tu plataforma de aprendizaje interactivo para conocimientos médicos fundamentales y de primeros auxilios.
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Mail className="text-sky-500" size={18} /> info@biomedicaparati.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-sky-500" size={18} /> +591 123 456 78
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="text-sky-500" size={18} /> Santa Cruz de la Sierra, Bolivia
              </li>
            </ul>
          </div>

          {/* Columna 3: Enlaces Legales */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-sky-400 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Aviso Legal</a></li>
            </ul>
          </div>

        </div>

        {/* Derechos de autor */}
        <div className="max-w-5xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Biomédica Para Ti. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}