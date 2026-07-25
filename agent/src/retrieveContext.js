import db from "./utils/db.js";
import { createEmbedding } from "./utils/embed.js";
import { cosineSimilarity } from "./utils/cosine.js";

export async function retrieveContext(
  query,
  topK = 10
) {
  const queryEmbedding =
    await createEmbedding(query);

  const files =
    db.prepare(
      "SELECT * FROM files"
    ).all();

  const scored = files.map((file) => ({
    ...file,
    score: cosineSimilarity(
      queryEmbedding,
      JSON.parse(file.embedding)
    )
  }));

  scored.sort(
    (a, b) => b.score - a.score
  );

  return scored.slice(0, topK);
}