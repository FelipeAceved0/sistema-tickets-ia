const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.analyzeTicketWithAI = async (title, description) => {
    try {
        const prompt = `
Eres un asistente de soporte técnico informático experto.
Analiza el siguiente problema enviado por un cliente:

Título: "${title}"
Descripción: "${description}"

Clasifica el problema en una de estas 4 categorías:
1. Hardware
2. Software / Sistemas
3. Redes y Conectividad
4. Suministros e Insumos

Genera un objeto JSON con las siguientes claves exactas:
- "suggested_category": (Nombre exacto de una de las 4 categorías)
- "auto_reply": (Una recomendación técnica breve de 1 o 2 oraciones para el cliente)
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash', 
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const parsedData = JSON.parse(response.text);
        return parsedData;

    } catch (error) {
        console.error('⚠️ Error en la integración con Gemini:', error.message);
        return {
            suggested_category: 'Hardware',
            auto_reply: 'Gracias por enviar tu requerimiento. Un técnico revisará tu caso en breve.'
        };
    }
};