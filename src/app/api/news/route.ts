import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';

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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("Groq API Key missing, falling back to mock news.");
      return NextResponse.json({
        news: addUrls(fallbackData.news),
        weather: fallbackData.weather,
        fashion: addUrls(fallbackData.fashion)
      });
    }

    console.log(`Fetching comprehensive data from Groq API for ${today}...`);

    let realTimeContext = "";
    try {
      const newsRes = await fetch('https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en');
      const newsXml = await newsRes.text();
      const titles = [...newsXml.matchAll(/<title>(.*?)<\/title>/g)].slice(1, 30).map(m => m[1]);
      
      const wRes = await fetch('https://wttr.in/Kolkata?format=j1');
      const wData = await wRes.json();
      const weather = wData.current_condition[0];
      
      realTimeContext = `
        CURRENT REAL-TIME HEADLINES (Use these!):
        ${titles.join('\n')}
        
        CURRENT WEATHER IN KOLKATA:
        Condition: ${weather.weatherDesc[0].value}
        Temperature: ${weather.temp_C}°C
        Wind: ${weather.windspeedKmph} km/h
        Humidity: ${weather.humidity}%
      `;
    } catch (e) {
      console.warn("Failed to fetch real-time context", e);
    }

    const dynamicPrompt = `
      ${prompt}
      
      IMPORTANT INSTRUCTIONS: 
      - You MUST use the following real-time data to generate your response. 
      - For news, strictly select and categorize from the provided CURRENT REAL-TIME HEADLINES. Do NOT use old or historical data.
      - For weather, strictly use the provided CURRENT WEATHER IN KOLKATA data.
      - If a news category doesn't have a perfect match, pick the closest headline.
      
      REAL-TIME DATA FOR TODAY (${today}):
      ${realTimeContext}
    `;

    const groq = new Groq({ apiKey });
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: dynamicPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";

    try {
      const parsedData = JSON.parse(content);

      // Ensure fallbacks for missing sections if Groq hallucinates the structure
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
      console.warn("Groq returned invalid JSON structure, using fallback.");
      return NextResponse.json({
        news: addUrls(fallbackData.news),
        weather: fallbackData.weather,
        fashion: addUrls(fallbackData.fashion)
      });
    }
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json({
      news: addUrls(fallbackData.news),
      weather: fallbackData.weather,
      fashion: addUrls(fallbackData.fashion)
    });
  }
}