import db from "./utils/db.js";
import { chunkText } from './utils/chunk.js'
import { loadProject } from "./readProject.js";
import { createEmbedding } from "./utils/embed.js";

const files = await loadProject();

for (const file of files) {
  const chunks = chunkText(file.content);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    console.log(`Indexing ${file.path} chunk ${i}`);

    const embedding = await createEmbedding(chunk);

    db.prepare(`
      INSERT OR REPLACE INTO files
      (path, content, embedding)
      VALUES (?, ?, ?)
    `).run(
      `${file.path}::${i}`,
      chunk,
      JSON.stringify(embedding)
    );
  }
}

console.log("Indexing complete");