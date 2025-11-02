import { NextResponse } from 'next/server';
// 1. Importar el SDK correcto
import { GoogleGenAI } from '@google/genai';

// 2. Esquema de respuesta como JSON simple (el nuevo método)
const GEMINI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "El título de la receta.",
    },
    description: {
      type: "string",
      description: "Una breve descripción de la receta.",
    },
    preparationTime: {
      type: "number",
      description: "Tiempo total de preparación en minutos.",
    },
    ingredients: {
      type: "array",
      description: "Lista de ingredientes.",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          quantity: {
            type: "string",
            description: "Valor numérico (ej: '2', '150', '0.5'). Si no es numérico, dejar en blanco.",
          },
          unit_of_measure: {
            type: "string",
            description: "Descriptor textual (ej: 'gramos', 'tazas', 'al gusto').",
          },
        },
        required: ["name", "quantity", "unit_of_measure"],
      },
    },
    instructions: {
      type: "array",
      description: "Instrucciones paso a paso.",
      items: { type: "string" },
    },
  },
  required: ["name", "description", "ingredients", "instructions"],
};

// 3. Tu system prompt (se queda igual)
const systemPrompt = `
You are a professional multilingual culinary assistant.
Detect the user's language automatically and generate the recipe using that language for all text content.
Always keep JSON structure and field names in English, as defined in the schema.

Formatting rules for ingredients:
- "quantity" must contain only numeric values (e.g., "1", "200", "0.5").
- If the quantity is qualitative or not numeric (like "to taste", "a pinch", "a few"), 
  leave "quantity" empty ("") and write that description in "unit_of_measure".
- "unit_of_measure" should contain units or descriptive terms such as "grams", "cups", "to taste", "al gusto", etc.

Examples:
✅ Correct:
{
  "name": "Salt",
  "quantity": "",
  "unit_of_measure": "to taste"
}

❌ Incorrect:
{
  "name": "Salt",
  "quantity": "to taste",
  "unit_of_measure": ""
}

Return only valid JSON following the schema. No extra commentary or markdown.
`;

// 4. Define la función POST
export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ message: "GEMINI_API_KEY is not set." }, { status: 500 });
    }

    // 5. Instanciar el AI (Nuevo método)
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    // 6. Llamar al modelo (Nuevo método)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Modelo estable, puedes usar "gemini-2.0-flash" si lo prefieres
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: GEMINI_RESPONSE_SCHEMA,
        temperature: 0.6,
      },
    });

    // 7. Obtener la respuesta (Nuevo método)
    const recipe = JSON.parse(response.text); 

    // 8. Devolver la receta al cliente
    return NextResponse.json(recipe);

  } catch (error) {
    console.error("❌ Error generating recipe:", error);
    return NextResponse.json({ message: `Error generating recipe: ${error.message}` }, { status: 500 });
  }
}