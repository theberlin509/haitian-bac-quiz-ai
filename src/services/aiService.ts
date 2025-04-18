
// It's better to use environment variables for API keys
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = import.meta.env.PROD ? '/api/openrouter' : "https://openrouter.ai/api/v1/chat/completions";
const PROXY_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'HTTP-Referer': `${window.location.origin}/`,
    'X-Title': 'Bacfasil Haitian BAC Prep'
  }
};

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const generateQuizQuestions = async (
  subject: string,
  difficulty: string,
  count: number
): Promise<QuizQuestion[]> => {
  try {
    const prompt = `Génère ${count} questions à choix multiples pour un examen du baccalauréat haïtien en ${subject} de niveau ${difficulty}.
    
    Pour chaque question, inclus:
    1. Une question claire et précise basée sur le programme du bac haïtien
    2. 4 options de réponse (A, B, C, D)
    3. L'indice de la réponse correcte (0 pour A, 1 pour B, etc.)
    4. Une explication détaillée de la réponse correcte
    
    Réponds en utilisant UNIQUEMENT le format JSON suivant sans aucun texte supplémentaire:
    [
      {
        "question": "texte de la question",
        "options": ["option A", "option B", "option C", "option D"],
        "correctOptionIndex": 0,
        "explanation": "explication de la réponse"
      }
    ]`;

    console.log("Sending request to OpenRouter API");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-pro",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: response.url
      });
      throw new Error(`Erreur du serveur (${response.status}): ${errorData.error?.message || "Problème de communication avec le service AI"}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content returned from API");
    }

    // Extract JSON from content (in case there's any text before or after)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON response");
    }

    const parsedQuestions = JSON.parse(jsonMatch[0]);
    
    // Add IDs to each question
    return parsedQuestions.map((q: any, index: number) => ({
      ...q,
      id: `question-${index + 1}`
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};
