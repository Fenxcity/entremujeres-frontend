import { useState, useRef, useEffect } from "react";

const API_URL = "/api/chat";

const C = {
  cream: "#F8F4EF", parchment: "#EDE8E0", gold: "#C09A5B",
  goldLight: "#D4B483", rose: "#B05C5C", roseDeep: "#8C3A3A",
  charcoal: "#2C2A27", slate: "#5A5652", mist: "#9A9590",
};

const PREGUNTAS = [
  "Mi esposo me pegó. ¿Qué puedo hacer legalmente?",
  "¿Cómo pido una orden de protección en México?",
  "Mi pareja me amenaza con quitarme a mis hijos.",
  "Publicaron fotos mías íntimas sin mi consentimiento.",
  "Sufro acoso sexual en mi trabajo. ¿Puedo denunciar?",
  "¿Qué es la Ley Olimpia y cómo me protege?",
  "¿Qué derechos tengo como víctima de violación?",
  "Mi pareja controla mi dinero y no me deja salir.",
];

const DELITOS = [
  { n: "Feminicidio",       d: "Tipificación, elementos del tipo y proceso penal." },
  { n: "Violación",         d: "Denuncia, pruebas, derechos de la víctima y proceso." },
  { n: "Violencia Familiar",d: "Órdenes de protección, denuncia y medidas cautelares." },
  { n: "Acoso Sexual",      d: "Hostigamiento laboral y digital. Cómo denunciar." },
  { n: "Ley Olimpia",       d: "Violencia digital, difusión sin consentimiento y sanciones." },
  { n: "Trata de Personas", d: "Identificación, asistencia a víctimas y proceso legal." },
];

/* ── Markdown mínimo ── */
function md(text) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

/* ── CHAT PANEL ── */
function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hola, bienvenida a **Entre Mujeres Legal**.\n\nSoy tu asesora jurídica virtual. Puedo orientarte sobre violencia familiar, acoso sexual, Ley Olimpia y más.\n\n¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (texto) => {
    const t = (texto ?? input).trim();
    if (!t || loading) return;

    const userMsg  = { role: "user", content: t };
    const history  = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res  = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply ?? "Ocurrió un error. Intenta de nuevo.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "No pude conectarme al servidor. Verifica tu conexión.",
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(44,42,39,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{
        background: C.cream, width: "100%", maxWidth: "560px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column", height: "88vh", maxHeight: "700px",
      }}>

        {/* Header */}
        <div style={{ background: C.charcoal, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: "13px", letterSpacing: "0.15em", color: C.gold, textTransform: "uppercase" }}>
              Entre Mujeres Legal · Asesora IA
            </div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: "12px", color: C.mist, marginTop: "3px", fontStyle: "italic" }}>
              Confidencial · Disponible 24 horas
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.mist, fontSize: "24px", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Emergencia */}
        <div style={{ background: C.roseDeep, padding: "8px 20px", textAlign: "center", fontFamily: "Georgia,serif", fontSize: "12px", color: "#fff", flexShrink: 0 }}>
          🆘 Peligro inmediato: <strong>911</strong> · Línea VIDA: <strong>800-911-2000</strong>
        </div>

        {/* Preguntas rápidas */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.parchment}`, flexShrink: 0 }}>
          <div style={{ fontFamily: "Georgia,serif", fontSize: "11px", letterSpacing: "0.12em", color: C.gold, textTransform: "uppercase", marginBottom: "8px" }}>
            Preguntas frecuentes
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {PREGUNTAS.slice(0, 4).map((p, i) => (
              <button
                key={i}
                onClick={() => send(p)}
                style={{
                  background: "#fff", border: `1px solid ${C.parchment}`,
                  borderLeft: `3px solid ${C.rose}`,
                  padding: "6px 10px", fontFamily: "Georgia,serif", fontSize: "11px",
                  color: C.slate, cursor: "pointer", textAlign: "left", lineHeight: "1.4",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Mensajes */}
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div
                dangerouslySetInnerHTML={{ __html: md(m.content) }}
                style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  fontFamily: "Georgia,serif",
                  fontSize: "13px",
                  lineHeight: "1.65",
                  background: m.role === "user" ? C.charcoal : "#fff",
                  color:      m.role === "user" ? C.cream    : C.charcoal,
                  border:     m.role === "user" ? "none" : `1px solid ${C.parchment}`,
                  borderLeft: m.role === "assistant" ? `3px solid ${C.gold}` : undefined,
                  borderRadius: "2px",
                }}
              />
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ padding: "10px 16px", background: "#fff", border: `1px solid ${C.parchment}`, borderLeft: `3px solid ${C.gold}`, display: "flex", gap: "6px", alignItems: "center" }}>
                {[0, 150, 300].map(d => (
                  <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, display: "inline-block", animation: `bounce 0.9s ${d}ms infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ borderTop: `1px solid ${C.parchment}`, padding: "12px 16px", display: "flex", gap: "10px", alignItems: "flex-end", background: "#fff", flexShrink: 0 }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(e); }}
            onKeyDown={handleKey}
            placeholder="Escribe tu consulta aquí…"
            rows={1}
            style={{
              flex: 1, border: `1.5px solid ${C.parchment}`, padding: "9px 14px",
              fontFamily: "Georgia,serif", fontSize: "13px", resize: "none",
              maxHeight: "100px", outline: "none", background: C.cream,
              lineHeight: "1.5", borderRadius: "2px",
            }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? C.mist : C.charcoal,
              color: "#fff", border: "none", padding: "10px 18px",
              fontFamily: "Georgia,serif", fontSize: "12px", letterSpacing: "0.08em",
              textTransform: "uppercase", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              flexShrink: 0,
            }}
          >
            Enviar
          </button>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "8px 16px", background: C.parchment, fontFamily: "Georgia,serif", fontSize: "11px", color: C.mist, textAlign: "center", fontStyle: "italic", flexShrink: 0 }}>
          Orientación general — no constituye patrocinio legal ni relación abogado-cliente
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

/* ── APP PRINCIPAL ── */
export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: "Georgia,serif", background: C.cream, minHeight: "100vh" }}>

      {/* Banner emergencia */}
      <div style={{ background: C.roseDeep, color: "#fff", textAlign: "center", padding: "10px", fontSize: "13px", letterSpacing: "0.04em" }}>
        🆘 Peligro inmediato — llama al <strong>911</strong> · Línea VIDA: <strong>800-911-2000</strong>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid ${C.parchment}` }}>
        <div style={{ fontSize: "14px", letterSpacing: "0.25em", color: C.gold, textTransform: "uppercase" }}>
          Entre Mujeres Legal
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{ background: "transparent", border: `1px solid ${C.gold}`, color: C.gold, padding: "8px 22px", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia,serif" }}
        >
          Consulta Personal
        </button>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "86vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "60px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${C.goldLight}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ border: `1px solid ${C.mist}`, display: "inline-block", padding: "7px 22px", marginBottom: "40px", fontSize: "11px", letterSpacing: "0.2em", color: C.rose, textTransform: "uppercase" }}>
          Especialistas · Violencia de Género · Sistema Penal Acusatorio
        </div>
        <h1 style={{ fontSize: "clamp(38px,6vw,72px)", fontWeight: "400", color: C.charcoal, lineHeight: "1.15", maxWidth: "760px", margin: "0 auto 20px" }}>
          Justicia al alcance de <em>todas</em> las <span style={{ color: C.gold }}>mujeres</span>
        </h1>
        <p style={{ fontSize: "17px", color: C.slate, fontStyle: "italic", maxWidth: "500px", margin: "0 auto 48px", lineHeight: "1.7" }}>
          Asesoría jurídica especializada en violencia de género, disponible las 24 horas.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setOpen(true)} style={{ background: C.charcoal, color: C.cream, border: "none", padding: "15px 36px", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia,serif" }}>
            Iniciar Asesoría →
          </button>
          <button style={{ background: "transparent", color: C.charcoal, border: `1px solid ${C.charcoal}`, padding: "15px 36px", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia,serif" }}>
            Consulta con Abogada
          </button>
        </div>
        <div style={{ marginTop: "52px", background: "#fff", border: `1px solid ${C.parchment}`, borderLeft: `3px solid ${C.rose}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "18px" }}>🆘</span>
          <span style={{ fontSize: "13px", color: C.slate }}>
            Peligro inmediato — llama al <strong style={{ color: C.rose }}>911</strong> · Línea VIDA: <strong style={{ color: C.rose }}>800-911-2000</strong>
          </span>
        </div>
      </section>

      {/* CTA oscuro */}
      <section style={{ background: C.charcoal, padding: "56px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "clamp(18px,3vw,28px)", color: C.cream, lineHeight: "1.6", maxWidth: "660px", margin: "0 auto 28px" }}>
          ¿Fuiste víctima de violencia? <span style={{ color: C.goldLight }}>No estás sola.</span> Orientación <em>gratuita y confidencial.</em>
        </p>
        <button onClick={() => setOpen(true)} style={{ background: C.gold, color: "#fff", border: "none", padding: "13px 34px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia,serif" }}>
          Hablar Ahora →
        </button>
      </section>

      {/* Áreas */}
      <section style={{ background: C.parchment, padding: "72px 48px" }}>
        <h2 style={{ fontSize: "12px", letterSpacing: "0.2em", color: C.gold, textTransform: "uppercase", marginBottom: "40px" }}>Áreas de Especialidad</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1px", background: C.mist + "44" }}>
          {DELITOS.map(d => (
            <div key={d.n} style={{ background: C.cream, padding: "32px 28px" }}>
              <div style={{ fontSize: "16px", color: C.rose, marginBottom: "8px" }}>{d.n}</div>
              <div style={{ fontSize: "13px", color: C.slate, lineHeight: "1.6" }}>{d.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Nosotras */}
      <section style={{ background: C.cream, padding: "72px 48px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "580px" }}>
          <h2 style={{ fontSize: "12px", letterSpacing: "0.2em", color: C.gold, textTransform: "uppercase", marginBottom: "20px" }}>Entre Mujeres Legal</h2>
          <p style={{ fontSize: "17px", color: C.charcoal, lineHeight: "1.8", marginBottom: "14px" }}>
            Despacho especializado en derecho penal y violencia de género. Puebla, México.
          </p>
          <p style={{ fontSize: "14px", color: C.slate, lineHeight: "1.7", fontStyle: "italic" }}>
            Colectiva Entre Mujeres — comprometidas con la protección de los derechos de las mujeres y el acceso a la justicia.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.charcoal, color: C.mist, padding: "52px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <div>
          <div style={{ fontSize: "12px", letterSpacing: "0.2em", color: C.gold, textTransform: "uppercase", marginBottom: "20px" }}>Contacto</div>
          {["Puebla, Pue., México", "+52 (222) 000-0000", "contacto@entremujeres.mx", "Lun–Vie 9:00–18:00"].map(t => (
            <div key={t} style={{ fontSize: "13px", color: C.mist, marginBottom: "9px" }}>{t}</div>
          ))}
          <div style={{ marginTop: "14px", fontSize: "13px", color: C.rose }}>🆘 Línea VIDA: 800-911-2000</div>
        </div>
        <div>
          <div style={{ fontSize: "12px", letterSpacing: "0.2em", color: C.gold, textTransform: "uppercase", marginBottom: "20px" }}>Delitos</div>
          {DELITOS.map(d => (
            <div key={d.n} style={{ fontSize: "13px", color: C.mist, marginBottom: "9px" }}>{d.n}</div>
          ))}
        </div>
        <div style={{ gridColumn: "1/-1", borderTop: `1px solid #3a3835`, paddingTop: "20px", fontSize: "11px", color: "#5a5650", lineHeight: "1.7" }}>
          © 2026 Entre Mujeres Legal · Colectiva Entre Mujeres · Todos los derechos reservados.<br />
          <em>La asesoría automatizada es orientación general y no constituye patrocinio legal ni relación abogado-cliente.</em>
        </div>
      </footer>

      {open && <ChatPanel onClose={() => setOpen(false)} />}
    </div>
  );
}
