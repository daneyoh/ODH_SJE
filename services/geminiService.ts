
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInvitationMessage = async (params: {
  groom: string;
  bride: string;
  style: string;
}) => {
  const ai = getAI();
  const prompt = `Write a beautiful, emotional, and elegant wedding invitation welcome message in Korean for ${params.groom} and ${params.bride}. 
  The tone should be ${params.style}. Keep it around 3-4 sentences.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional wedding content writer specialized in Korean wedding invitations.",
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "서로를 아끼고 사랑하며 행복하게 살겠습니다. 저희의 첫 시작을 함께 축복해 주세요.";
  }
};

export const searchLocationOnMaps = async (locationName: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${locationName}의 정확한 위치와 지도를 찾고 싶어요.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps.title,
        uri: chunk.maps.uri
      }));

    return {
      text: response.text,
      links: links
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "위치 정보를 가져올 수 없습니다.", links: [] };
  }
};
