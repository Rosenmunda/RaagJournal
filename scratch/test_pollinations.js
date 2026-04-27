
const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const prompt = `
    You are a professional news aggregator. 
    Provide a concise summary of the top news stories for ${today}.
    If you don't have access to live news for this specific date, provide the most recent and significant representative news stories instead.
    
    You MUST provide exactly 2 stories for EACH of the following 4 categories (Total 8 stories):
    1. Indian Politics
    2. Geo-Politics
    3. Science and Tech
    4. Finance
    
    Format the response STRICTLY as a JSON array of 8 objects with these fields: 'category', 'title', 'source', 'summary', and 'url'.
    Example structure: [{"category": "Indian Politics", "title": "...", ...}, ...]
    
    Only return the JSON array. No preamble, no markdown formatting, no extra text.
  `;

async function testModel(modelName) {
    console.log(`\n--- Testing Model: ${modelName} ---`);
    const seed = Math.floor(Math.random() * 1000);
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?jsonMode=true&seed=${seed}${modelName ? `&model=${modelName}` : ''}`;
    
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        const text = await res.text();
        console.log("Raw output length:", text.length);
        
        if (text.includes('"error"')) {
            console.log("Error in response:", text.substring(0, 200));
            return;
        }

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            console.log("Found JSON array!");
            try {
                const json = JSON.parse(jsonMatch[0]);
                console.log("Success! Items count:", json.length);
                json.forEach((item, i) => {
                    console.log(`[${i}] Category: ${item.category} | Title: ${item.title}`);
                });
            } catch (e) {
                console.log("Parse error:", e.message);
            }
        } else {
            console.log("No JSON array found. Preview:", text.substring(0, 100));
        }
    } catch (err) {
        console.error("Fetch error:", err.message);
    }
}

async function runTests() {
    await testModel(""); // default
    await testModel("openai");
    await testModel("mistral");
    await testModel("p1");
    await testModel("gemini");
}

runTests();
