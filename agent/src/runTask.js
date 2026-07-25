import { askModel } from './ollama.js';
import { retrieveContext } from './retrieveContext.js';


export async function runTask(task) {

  const files =
    await retrieveContext(task, 10);

  const context =
    files
      .map(
        file => `
FILE: ${file.path}

${file.content}
`
      )
      .join("\n\n");

  const prompt = `
You are a senior Node.js engineer.

Task:
${task}

Relevant project files:

${context}

Requirements:
- Reuse existing code
- Follow project conventions
- Do not invent APIs

Return code only.
Do not use markdown.
Do not use code fences.
`;

  return askModel(prompt);
}