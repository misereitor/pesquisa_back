export function toTitleCase(str: string): string {
  if (!str) return str;
  const lower = str.toLowerCase();
  const smallWords = [
    'de',
    'da',
    'do',
    'dos',
    'das',
    'e',
    'em',
    'com',
    'por',
    'para'
  ];

  return lower.replace(/\S+/g, (word, index) => {
    // Se a palavra for pequena e não for a primeira, mantém minúscula
    if (smallWords.includes(word) && index !== 0) {
      return word;
    }
    // Caso contrário, capitaliza a primeira letra
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}
