import fetch from 'node-fetch';

const OPENAI_API_KEY = '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';

async function parseTaskWithGPT(taskText) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant. Extract structured task details from user input.
          Return JSON with fields:
          {
            "title": "...",
            "date": "YYYY-MM-DD",
            "time": "HH:mm",
            "priority": "low" | "medium" | "high"
          }`
        },
        {
          role: 'user',
          content: taskText
        }
      ],
      temperature: 0.2
    })
  });

  const data = await response.json();
  console.log('GPT-3.5 Full Response:', JSON.stringify(data, null, 2));

  try {
    const reply = data.choices?.[0]?.message?.content;
    console.log('\nStructured Task:', reply);
  } catch (err) {
    console.error('Error parsing GPT response:', err);
  }
}

parseTaskWithGPT("Book dentist appointment next Monday at 10am");
