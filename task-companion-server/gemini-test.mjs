const GEMINI_API_KEY = 'AIzaSyDhJWovTMwszG4un1Uce98B_wv-7EeUF0c';

async function parseTaskWithGemini(taskText) {
  const endpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=' + GEMINI_API_KEY;


  const prompt = `
    Extract structured task details from this text:
    "${taskText}"

    Return JSON with fields:
    {
      "title": "...",
      "date": "YYYY-MM-DD",
      "time": "HH:mm",
      "priority": "low" | "medium" | "high"
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    console.log('Gemini Full Response:', JSON.stringify(data, null, 2));

    const parsedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (parsedText) {
      console.log('\nStructured Task:', parsedText);
    } else {
      console.log('\nNo structured response found.');
    }

  } catch (err) {
    console.error('ERROR:', err);
  }
}

parseTaskWithGemini("Book dentist appointment next Monday at 10am");
