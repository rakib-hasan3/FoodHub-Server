import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { prisma } from "../../lib/prisma";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export const AIService = {
  chat: async (messages: any[]): Promise<any> => {
    // Fetch live context with safety
    const [meals, providers, categories] = await Promise.all([
      prisma.meals.findMany({
        where: { isAvailable: true },
        include: {
          provider: { select: { restaurant_name: true } },
          category: { select: { name: true } },
        },
      }).catch(() => []),
      prisma.provider_Profile.findMany({
        where: { is_active: true },
        select: { restaurant_name: true, address: true, contact_number: true },
      }).catch(() => []),
      prisma.categories.findMany({ select: { name: true } }).catch(() => []),
    ]);

    const mealsContext = (meals || [])
      .map(m => `- ${m.name} (${m.category?.name}) at ${m.provider?.restaurant_name}: $${m.price}`)
      .join("\n");

    const restaurantsContext = (providers || [])
      .map(p => `- ${p.restaurant_name}: ${p.address} (Contact: ${p.contact_number})`)
      .join("\n");

    const categoriesContext = (categories || []).map(c => c.name).join(", ");

    const systemPrompt = `
You are "FoodHub Guide", the official AI assistant.
STRICT RULES:
- ONLY answer about FoodHub services, restaurants, and meals.
- If the query is unrelated, reply: "I am only here to help with FoodHub services."
- Be helpful, concise, and friendly.

AVAILABLE DATA:
Restaurants: ${restaurantsContext}
Categories: ${categoriesContext}
Meals: ${mealsContext}
`;

    return streamText({
      model: google("gemini-3-flash-preview"),
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });
  },
};