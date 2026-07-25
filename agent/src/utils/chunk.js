export function chunkText(text, size = 2000, overlap = 200) {
  const chunks = [];

  let i = 0;

  while (i < text.length) {
    const end = i + size;

    chunks.push(
      text.slice(i, end)
    );

    i = end - overlap;
  }

  return chunks;
}