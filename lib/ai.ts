import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface Insight {
  type: "alert" | "recommendation" | "insight";
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  affectedArea: "sales" | "inventory" | "customers" | "profitability";
  suggestedAction?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export interface Briefing {
  title: string;
  metrics: {
    revenue: number;
    revenueChange: number;
    orders: number;
    newCustomers: number;
  };
  highlights: string[];
  attention: string[];
  opportunities: string[];
  recommendations: string[];
}

export class AIService {
  async generateInsights(businessData: Record<string, any>): Promise<Insight[]> {
    const prompt = `
You are an AI business analyst for a small business management system called PULSE.
Analyze the following business data and generate 2-3 actionable insights or alerts.

Business Data:
${JSON.stringify(businessData, null, 2)}

Return a JSON array of insights. Each insight should have:
- type: "alert", "recommendation", or "insight"
- severity: "low", "medium", or "high"
- title: Brief title (max 60 chars)
- description: Detailed explanation
- affectedArea: "sales", "inventory", "customers", or "profitability"
- suggestedAction: Optional recommended action
- cta: Optional { label, href } for UI button

Focus on anomalies, trends, and actionable opportunities.
Return only valid JSON, no markdown.
    `;

    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    try {
      const content =
        message.content[0].type === "text" ? message.content[0].text : "[]";
      return JSON.parse(content) as Insight[];
    } catch (error) {
      console.error("Failed to parse AI insights:", error);
      return [];
    }
  }

  async generateBriefing(businessData: Record<string, any>): Promise<Briefing> {
    const prompt = `
You are an AI business analyst for PULSE.
Generate a concise morning business briefing based on this data:

${JSON.stringify(businessData, null, 2)}

Return JSON with this structure:
{
  "title": "Good morning, [business name]",
  "metrics": {
    "revenue": 12000,
    "revenueChange": 8.5,
    "orders": 42,
    "newCustomers": 3
  },
  "highlights": ["key achievement 1", "key achievement 2"],
  "attention": ["issue needing attention 1", "issue 2"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "recommendations": ["action 1", "action 2"]
}

Return only valid JSON.
    `;

    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    try {
      const content =
        message.content[0].type === "text" ? message.content[0].text : "{}";
      return JSON.parse(content) as Briefing;
    } catch (error) {
      console.error("Failed to parse AI briefing:", error);
      return {
        title: "Good morning",
        metrics: { revenue: 0, revenueChange: 0, orders: 0, newCustomers: 0 },
        highlights: [],
        attention: [],
        opportunities: [],
        recommendations: [],
      };
    }
  }

  async generateRecommendations(
    businessData: Record<string, any>
  ): Promise<string[]> {
    const prompt = `
You are an AI business advisor.
Based on this business data, provide 3-5 specific, actionable recommendations:

${JSON.stringify(businessData, null, 2)}

Return a JSON array of strings. Each recommendation should be:
- Specific and actionable
- Based on the data provided
- Focused on growth, efficiency, or risk reduction

Example: ["Run a 15% discount for inactive customers", "Restock Cold Brew - stock will run out in 2 days"]

Return only the JSON array, no markdown.
    `;

    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    try {
      const content =
        message.content[0].type === "text" ? message.content[0].text : "[]";
      return JSON.parse(content) as string[];
    } catch (error) {
      console.error("Failed to parse recommendations:", error);
      return [];
    }
  }

  async generateCampaignCopy(
    audience: string,
    offer: string,
    tone: string = "friendly"
  ): Promise<string> {
    const prompt = `
Generate a compelling marketing message for a campaign.

Audience: ${audience}
Offer: ${offer}
Tone: ${tone}

Return a concise, engaging message (max 2 sentences) that would appeal to this audience.
Focus on the benefit and create urgency where appropriate.
    `;

    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return message.content[0].type === "text"
      ? message.content[0].text
      : "Check out our latest offer!";
  }

  async answerBusinessQuestion(
    question: string,
    businessData: Record<string, any>
  ): Promise<string> {
    const prompt = `
You are a business intelligence assistant for a small business owner.
Answer this question based on their business data:

Question: ${question}

Business Data:
${JSON.stringify(businessData, null, 2)}

Provide a clear, concise answer with supporting details from the data.
Focus on what the owner should know and what action they might take.
    `;

    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return message.content[0].type === "text"
      ? message.content[0].text
      : "I couldn't find information to answer that question.";
  }
}

export const ai = new AIService();
