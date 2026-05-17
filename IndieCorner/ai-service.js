import fetch from "node-fetch";

export async function generateProductRecommendation(query) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY no configurada");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un asistente que recomienda palabras clave para buscar en un catálogo de productos indie. Responde solo con las palabras clave separadas por comas.",
        },
        {
          role: "user",
          content: `El usuario busca: "${query}". Genera 3-5 palabras clave separadas por comas que ayuden a encontrar productos relacionados.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Respuesta inválida de OpenAI");
  }
  
  return data.choices[0].message.content;
}
