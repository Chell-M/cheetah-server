import wordsArray from "../data/words.js";

export const generateWordSequence = (numberOfWords = 25) => {
  if (numberOfWords > wordsArray.length) {
    throw new Error("Requested number of words exceeds the available words.");
  }

  const shuffled = [...wordsArray];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selectedWords = shuffled.slice(0, numberOfWords);
  return selectedWords.join(" ");
};
