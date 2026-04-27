import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `
    You are a professional news aggregator. 
    Provide a concise summary of the top recent news stories, weather, and fashion updates for ${today}.
    
    Format the response STRICTLY as a JSON object with the following structure:
    {
      "news": [
        // Exactly 8 objects (2 for EACH category: "Indian Politics", "Geo-Politics", "Science and Tech", "Finance")
        // Fields: "category", "title", "source", "summary"
      ],
      "weather": {
        // IMPORTANT: Provide the actual current weather forecast for Kolkata,India.
        "condition": "e.g. Sunny, Overcast, Thunderstorms",
        "temp": "e.g. 32°C",
        "summary": "A brief 2-sentence meteorological summary for Kolkata,India.",
        "wind": "e.g. SE 12 KM/H",
        "humidity": "e.g. 45%"
      },
      "fashion": [
        // Exactly 2 objects representing current global society and style trends
        // Fields: "title", "summary"
      ]
    }
    
    Only return the JSON object. No preamble, no markdown formatting. Do not try to generate URLs.
  `;

  const fallbackData = {
    news: [
      { category: "Indian Politics", title: "Parliament Session Concludes with Major Policy Shifts", source: "The Statesman", summary: "Significant legislative changes were discussed as the current session reached its climax today." },
      { category: "Indian Politics", title: "State Elections: New Alliances Reshape Regional Dynamics", source: "The Economic Times", summary: "Emerging political coalitions are signaling a significant shift in upcoming state-level governance." },
      { category: "Geo-Politics", title: "Global Summit Addresses Emerging Security Protocols", source: "Economic Times", summary: "World leaders converged to establish a unified framework for cross-border digital security." },
      { category: "Geo-Politics", title: "Maritime Trade Routes: New Infrastructure Projects Announced", source: "The Statesman", summary: "A multi-national initiative aims to revitalize historic trade corridors with modern deep-sea ports." },
      { category: "Science and Tech", title: "Neural Computing Breakthrough Reported in Deep Labs", source: "Tech-Pulse", summary: "A new architecture for silicon-based neural networks promises 10x efficiency for next-gen AI." },
      { category: "Science and Tech", title: "Quantum Encryption Becomes Reality for Consumer Devices", source: "Tech Journal", summary: "The first commercial quantum-resistant security chips are beginning to ship in high-end smartphones." },
      { category: "Finance", title: "Market Resilience Noted Despite Shift in Global Indices", source: "Economic Times", summary: "Domestic markets showed surprising stability as investors pivoted toward long-term tech assets." },
      { category: "Finance", title: "Venture Capital Flows Toward Sustainable Energy Tech", source: "Financial Post", summary: "Record investments are being channeled into next-generation battery storage and hydrogen power startups." }
    ],
    weather: {
      condition: "Clear skies",
      temp: "High",
      summary: "Expect clear conditions in the neural pathways. Visibility is optimal for reading.",
      wind: "SE 12 KM/H",
      humidity: "45%"
    },
    fashion: [
      { title: "The Return of Structured Tailoring", summary: "As digital nomadism wanes, urban centers report a sharp resurgence in heavy wool overcoats and double-breasted silhouettes." },
      { title: "Neo-Brutalism in Haute Couture", summary: "Paris runways featured raw seams, exposed stitching, and monochromatic palettes, echoing mid-century architecture." }
    ]
  };

  const addUrls = (items: any[]) => items.map(item => ({
    ...item,
    url: `https://news.google.com/search?q=${encodeURIComponent(item.title)}`
  }));

  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API Key missing, falling back to mock news.");
      return NextResponse.json({
        news: addUrls(fallbackData.news),
        weather: fallbackData.weather,
        fashion: addUrls(fallbackData.fashion)
      });
    }

    console.log(`Fetching comprehensive data from Gemini AI for ${today}...`);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    try {
      const parsedData = JSON.parse(content);

      // Ensure fallbacks for missing sections if Gemini hallucinates the structure
      const finalNews = parsedData.news && Array.isArray(parsedData.news) && parsedData.news.length > 0
        ? addUrls(parsedData.news)
        : addUrls(fallbackData.news);

      const finalWeather = parsedData.weather || fallbackData.weather;

      const finalFashion = parsedData.fashion && Array.isArray(parsedData.fashion) && parsedData.fashion.length > 0
        ? addUrls(parsedData.fashion)
        : addUrls(fallbackData.fashion);

      return NextResponse.json({
        news: finalNews,
        weather: finalWeather,
        fashion: finalFashion
      });

    } catch (parseError) {
      console.warn("Gemini returned invalid JSON structure, using fallback.");
      return NextResponse.json({
        news: addUrls(fallbackData.news),
        weather: fallbackData.weather,
        fashion: addUrls(fallbackData.fashion)
      });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({
      news: addUrls(fallbackData.news),
      weather: fallbackData.weather,
      fashion: addUrls(fallbackData.fashion)
    });
  }
}