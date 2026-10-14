const EMOJI: Record<string, string> = {
  "red-apple": "🍎",
  orange: "🍊",
  banana: "🍌",
  grape: "🍇",
  pomegranate: "🍒",
  kiwi: "🥝",
  persimmon: "🍅",
  mandarin: "🍊",
  pear: "🍐",
  peach: "🍑",
};

export function fruitEmoji(slug?: string) {
  return (slug && EMOJI[slug]) || "🍏";
}
