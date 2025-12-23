const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const chatWithAI = async (message) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are RePlate AI, the intelligent assistant for RePlate - a food surplus sharing platform.

ABOUT REPLATE:
- RePlate connects restaurants with surplus food to people in need
- Reduces food waste and environmental impact
- Restaurants list surplus meals at discounted prices (50-80% off)
- Users browse and claim these meals for pickup
- Fights climate change by preventing food waste

YOUR PERSONALITY:
- Friendly, enthusiastic, and genuinely helpful
- Passionate about reducing food waste and helping communities
- Knowledgeable about food, restaurants, and sustainability
- Conversational but professional
- Use emojis occasionally to be engaging

YOUR ROLE:
- Answer ANY questions about RePlate intelligently
- Help users navigate the platform
- Explain how food surplus sharing works
- Discuss environmental impact and benefits
- Assist with restaurant partnerships
- Be creative and adaptive in responses

GUIDELINES:
- Keep responses concise (2-3 sentences max)
- Be specific and helpful
- If you don't know something, be honest but helpful
- Focus on food surplus, sustainability, and community impact
- Always maintain a positive, solution-oriented tone`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.8, // Slightly creative for engaging responses
        presence_penalty: 0.2, // Encourages new topics
        frequency_penalty: 0.2  // Reduces repetition
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Our AI assistant is taking a quick break! 🍕 Please try again in a moment.');
  }
};