
// Make sure to use the environment variable if available, otherwise fallback to the hardcoded key
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
    
    // For better debugging, securely log a portion of the API key
    const apiKeyPreview = API_KEY ? `${API_KEY.substring(0, 8)}...` : "Not found";
    console.log("API Key preview:", apiKeyPreview);
    
    // Validate that we have an API key before making the request
    if (!API_KEY) {
      throw new Error("API key is missing. Please set the VITE_OPENROUTER_API_KEY environment variable.");
    }
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        // Add standard headers required by OpenRouter
        "HTTP-Referer": window.location.origin,
        "X-Title": "Bac Haïtien Quiz Generator"
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

    console.log("API Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error details:", errorData);
      
      // When in development, use mock data as fallback
      if (import.meta.env.DEV) {
        console.log("DEV mode: Falling back to mock data due to API error");
        return generateMockQuestions(count);
      }
      
      throw new Error(`API Error: ${errorData.error?.message || response.statusText || "Unknown error"}`);
    }

    const data = await response.json();
    console.log("API Response received, parsing content");
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error("No content in API response:", data);
      if (import.meta.env.DEV) {
        return generateMockQuestions(count);
      }
      throw new Error("No content returned from API");
    }

    // Extract JSON from content (in case there's any text before or after)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not parse JSON from content:", content);
      if (import.meta.env.DEV) {
        return generateMockQuestions(count);
      }
      throw new Error("Could not parse JSON response");
    }

    const parsedQuestions = JSON.parse(jsonMatch[0]);
    console.log(`Successfully parsed ${parsedQuestions.length} questions`);
    
    // Add IDs to each question
    return parsedQuestions.map((q: any, index: number) => ({
      ...q,
      id: `question-${index + 1}`
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    
    // In development mode, use mock data as fallback
    if (import.meta.env.DEV) {
      console.log("DEV mode: Falling back to mock data due to error");
      return generateMockQuestions(count);
    }
    
    throw error; // Re-throw the error in production
  }
};

// Generate mock questions for testing or development fallback
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
