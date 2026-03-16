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
    freeDescription: "Fire sign crystals amplify your passion, courage, and creative spark. They resonate with your chart's dominant energy.",
    collectionUrl: "https://veloracrystal.com/collections/fire-signs",
    buttonText: "Explore Fire Sign Crystals",
  },
  Earth: {
    element: "Earth",
    emoji: "🌍",
    color: "#4CAF50",
    freeDescription: "Earth sign crystals ground your energy, attract abundance, and nurture your steady, reliable nature.",
    collectionUrl: "https://veloracrystal.com/collections/earth-signs",
    buttonText: "Explore Earth Sign Crystals",
  },
  Water: {
    element: "Water",
    emoji: "💧",
    color: "#2196F3",
    freeDescription: "Water sign crystals deepen your intuition, soothe your emotions, and enhance your natural empathic gifts.",
    collectionUrl: "https://veloracrystal.com/collections/water-signs",
    buttonText: "Explore Water Sign Crystals",
  },
  Air: {
    element: "Air",
    emoji: "💨",
    color: "#9C27B0",
    freeDescription: "Air sign crystals sharpen your mind, enhance communication, and fuel your visionary thinking.",
    collectionUrl: "https://veloracrystal.com/collections/air-signs",
    buttonText: "Explore Air Sign Crystals",
  },
};

export function getElementForSign(sign: string): Element {
  return SIGN_ELEMENTS[sign.toLowerCase()] || "Fire";
}

export function getElementData(element: Element): ElementData {
  return ELEMENT_DATA[element];
}
