import ollama from 'ollama';

export async function askModel(prompt) {
  const response = await ollama.chat({
    model: 'qwen2.5-coder:14b',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return response.message.content;
}