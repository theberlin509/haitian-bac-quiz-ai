

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
    console.log("API Key present:", !!API_KEY);
    
    // For mock data during development if no API key is provided
    if (!API_KEY) {
      console.log("Using mock data because no API key is provided");
      return generateMockQuestions(count);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
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
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API Error: ${errorData.error?.message || "Unknown error"}`);
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
    // If the API fails, use mock data as fallback
    console.log("Falling back to mock data due to API error");
    return generateMockQuestions(count);
  }
};

// Helper function to generate mock questions when API is not available
const generateMockQuestions = (count: number): QuizQuestion[] => {
  const mockQuestions: QuizQuestion[] = [
    {
      id: "question-1",
      question: "Quelle est la formule chimique de l'eau?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correctOptionIndex: 0,
      explanation: "L'eau est composée de deux atomes d'hydrogène et un atome d'oxygène, ce qui donne la formule H2O."
    },
    {
      id: "question-2",
      question: "Quelle est la capitale d'Haïti?",
      options: ["Cap-Haïtien", "Port-au-Prince", "Jacmel", "Les Cayes"],
      correctOptionIndex: 1,
      explanation: "Port-au-Prince est la capitale et la plus grande ville d'Haïti."
    },
    {
      id: "question-3",
      question: "Quel est le résultat de 3x + 5 = 14?",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctOptionIndex: 0,
      explanation: "Pour résoudre 3x + 5 = 14, soustrayez 5 des deux côtés: 3x = 9, puis divisez par 3: x = 3."
    },
    {
      id: "question-4",
      question: "Qui a écrit 'Gouverneurs de la rosée'?",
      options: ["Jacques Roumain", "Dany Laferrière", "René Depestre", "Jean Price-Mars"],
      correctOptionIndex: 0,
      explanation: "\"Gouverneurs de la rosée\" est un roman de l'écrivain haïtien Jacques Roumain, publié en 1944."
    },
    {
      id: "question-5",
      question: "Quelle est la loi fondamentale de la dynamique (deuxième loi de Newton)?",
      options: ["F = ma", "E = mc²", "F = k·x", "P = m·g"],
      correctOptionIndex: 0,
      explanation: "La deuxième loi de Newton énonce que la force F est égale à la masse m multipliée par l'accélération a."
    }
  ];
  
  // Return only the requested number of questions
  return mockQuestions.slice(0, count);
};

