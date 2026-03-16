export type Element = "Fire" | "Earth" | "Water" | "Air";

export interface ElementData {
  element: Element;
  emoji: string;
  color: string;
  // Free tier: short one-liner shown after reading
  freeDescription: string;
  // Collection page URL on Velora Crystal
  collectionUrl: string;
  // Button text
  buttonText: string;
}

// Zodiac sign -> element mapping
export const SIGN_ELEMENTS: Record<string, Element> = {
  aries: "Fire",
  leo: "Fire",
  sagittarius: "Fire",
  taurus: "Earth",
  virgo: "Earth",
  capricorn: "Earth",
  gemini: "Air",
  libra: "Air",
  aquarius: "Air",
  cancer: "Water",
  scorpio: "Water",
  pisces: "Water",
};

export const ELEMENT_DATA: Record<Element, ElementData> = {
  Fire: {
    element: "Fire",
    emoji: "🔥",
    color: "#FF6B35",
    freeDescription: "Fire element crystals amplify your passion, courage, and creative spark. They resonate with your chart's dominant energy.",
    collectionUrl: "https://veloracrystal.com/fire-crystals/",
    buttonText: "Explore Fire Element Crystals",
  },
  Earth: {
    element: "Earth",
    emoji: "🌍",
    color: "#4CAF50",
    freeDescription: "Earth element crystals ground your energy, attract abundance, and nurture your steady, reliable nature.",
    collectionUrl: "https://veloracrystal.com/earth-crystals/",
    buttonText: "Explore Earth Element Crystals",
  },
  Water: {
    element: "Water",
    emoji: "💧",
    color: "#2196F3",
    freeDescription: "Water element crystals deepen your intuition, soothe your emotions, and enhance your natural empathic gifts.",
    collectionUrl: "https://veloracrystal.com/water-crystals/",
    buttonText: "Explore Water Element Crystals",
  },
  Air: {
    element: "Air",
    emoji: "💨",
    color: "#9C27B0",
    freeDescription: "Air element crystals sharpen your mind, enhance communication, and fuel your visionary thinking.",
    collectionUrl: "https://veloracrystal.com/air-crystals/",
    buttonText: "Explore Air Element Crystals",
  },
};

export function getElementForSign(sign: string): Element {
  return SIGN_ELEMENTS[sign.toLowerCase()] || "Fire";
}

export function getElementData(element: Element): ElementData {
  return ELEMENT_DATA[element];
}
