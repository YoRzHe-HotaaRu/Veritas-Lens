import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isAiGenerated: {
      type: Type.BOOLEAN,
      description: "True if the image is likely AI generated, false otherwise.",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating confidence in the verdict. 100 is absolute certainty.",
    },
    verdict: {
      type: Type.STRING,
      enum: ["LIKELY_REAL", "LIKELY_AI", "UNCERTAIN"],
      description: "The final categorical verdict.",
    },
    forensicDetails: {
      type: Type.OBJECT,
      properties: {
        lighting: { type: Type.STRING, description: "Analysis of light sources, shadows, and reflections." },
        anatomy: { type: Type.STRING, description: "Analysis of human anatomy (hands, eyes, teeth) or object structure." },
        textures: { type: Type.STRING, description: "Analysis of skin texture, fabric details, and surface noise." },
        background: { type: Type.STRING, description: "Analysis of depth of field, background logic, and coherence." },
      },
      required: ["lighting", "anatomy", "textures", "background"],
    },
    keyIndicators: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific visual artifacts or lack thereof found in the image.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A summary paragraph explaining the logic behind the score.",
    },
  },
  required: ["isAiGenerated", "confidenceScore", "verdict", "forensicDetails", "keyIndicators", "reasoning"],
};

export const analyzeImageForensics = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    // We use gemini-3-pro-preview for its superior visual reasoning capabilities
    const modelId = "gemini-3-pro-preview";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Act as a forensic image analyst expert in detecting generative adversarial networks (GANs) and diffusion model artifacts. 
            
            Analyze the attached image meticulously. Look for the following common AI generation indicators:
            1. Inconsistent lighting or shadows that don't match the light source.
            2. Anatomical errors (extra fingers, asymmetrical eyes, weird teeth, blending limbs).
            3. "Plastic" or over-smoothed skin textures.
            4. Incoherent background details or impossible geometry.
            5. Text or glyphs that are gibberish.
            6. Earrings or accessories that don't match or blend into skin.

            If the image looks perfectly natural with film grain, consistent noise, and logical physics, classify it as Real.
            
            Provide your output in strict JSON format based on the schema.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for more analytical/deterministic output
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Forensic analysis failed:", error);
    throw error;
  }
};
