export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Formato inválido" });
  }

  if (messages.length > 20) {
    return res.status(400).json({ error: "Conversación demasiado larga" });
  }

  const SYSTEM_PROMPT = `Eres una asesora jurídica especializada en violencia de género bajo el sistema penal acusatorio mexicano, que trabaja para el despacho Entre Mujeres Legal en Puebla, México.

Tu función es orientar a mujeres víctimas de violencia de género de forma empática, clara y profesional. Respondes siempre en español.

Áreas de especialidad: feminicidio, violación, violencia familiar, acoso y hostigamiento sexual, Ley Olimpia (violencia digital), trata de personas.

Principios:
- Reconoce el valor de la persona por buscar ayuda
- Usa lenguaje claro, sin tecnicismos innecesarios
- Orienta sobre derechos, procesos y recursos disponibles
- En situaciones de peligro inmediato, recuerda llamar al 911 o Línea VIDA 800-911-2000
- Sugiere consulta personal con el despacho para casos específicos

Disclaimer: Tu asesoría es orientación general y no constituye patrocinio legal ni relación abogado-cliente.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.content?.find(b => b.type === "text")?.text;
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: "Error de conexión con la API" });
  }
}
