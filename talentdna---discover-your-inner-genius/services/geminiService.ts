
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeTalentResults(answers: any[]): Promise<AnalysisResult> {
  const prompt = `
    Based on the following behavioral and psychological assessment responses, provide a detailed talent profile analysis.
    The assessment measures traits like Analytical Thinking, Practical Skills, Creativity, Interpersonal Skills, Adaptability, Inquisitiveness, Focus, and Leadership.
    
    User Answers (Question text and user's selected score/value):
    ${JSON.stringify(answers, null, 2)}
    
    Please provide a professional analysis in Chinese.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy title for the personality type (e.g., 'The Innovative Architect')" },
          description: { type: Type.STRING, description: "Detailed description of their core talent pattern" },
          traits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key personality traits" },
          careerPaths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ideal career paths" },
          radarData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING, description: "Dimension name (e.g., '逻辑', '创意')" },
                score: { type: Type.NUMBER, description: "Score out of 100" },
                fullMark: { type: Type.NUMBER }
              },
              required: ["subject", "score", "fullMark"]
            }
          },
          summary: { type: Type.STRING, description: "A concluding summary" },
          actionPlan: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 actionable steps to grow" }
        },
        required: ["title", "description", "traits", "careerPaths", "radarData", "summary", "actionPlan"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Could not analyze results.");
  }
}
