import { Event } from "../types/Event";

export interface EventConfig {
  eventKey: string;
  title: string;
  priceType: "perPlayer" | "categoryBased" | "fixed" | "athletics";
  perPlayerPrice?: number;
  minPlayers?: number;
  maxPlayers?: number;
  categoryBasedLimits?: {
    boys?: { min: number; max: number };
    girls?: { min: number; max: number };
  };
  categories?: { label: string; value: string }[];
  categoryPrices?: Record<string, number>;
  fixedPrice?: number;
  athleticsEvents?: { name: string; price: number }[];
  requiresGender?: boolean;
  dynamicPlayerFields?: boolean;
  fixedPlayerCount?: number;
  requiresShotPutSubCategory?: boolean;
  requiresRelayPlayers?: boolean;
}

export const eventConfig: Record<string, EventConfig> = {
  football: {
    eventKey: "football",
    title: "Football",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    minPlayers: 11,
    maxPlayers: 15,
    dynamicPlayerFields: true,
  },
  cricket: {
    eventKey: "cricket",
    title: "Cricket",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    minPlayers: 11,
    maxPlayers: 15,
    dynamicPlayerFields: true,
  },
  "box-cricket": {
    eventKey: "box-cricket",
    title: "Box Cricket (Girls)",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    minPlayers: 7,
    maxPlayers: 9,
    dynamicPlayerFields: true,
  },
  futsal: {
    eventKey: "futsal",
    title: "Futsal (Girls)",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    minPlayers: 5,
    maxPlayers: 7,
    dynamicPlayerFields: true,
  },
  kabaddi: {
    eventKey: "kabaddi",
    title: "Kabaddi (Boys & Girls)",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    minPlayers: 7,
    maxPlayers: 12,
    categories: [
      { label: "Boys", value: "boys" },
      { label: "Girls", value: "girls" },
    ],
    requiresGender: true,
    dynamicPlayerFields: true,
  },
  basketball: {
    eventKey: "basketball",
    title: "Basketball (Boys & Girls)",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    categoryBasedLimits: {
      boys: { min: 5, max: 10 },
      girls: { min: 3, max: 6 },
    },
    categories: [
      { label: "Boys", value: "boys" },
      { label: "Girls", value: "girls" },
    ],
    requiresGender: true,
    dynamicPlayerFields: true,
  },
  badminton: {
    eventKey: "badminton",
    title: "Badminton",
    priceType: "categoryBased",
    categories: [
      { label: "Singles (Boys)", value: "singles-boys" },
      { label: "Singles (Girls)", value: "singles-girls" },
      { label: "Doubles (Boys)", value: "doubles-boys" },
      { label: "Doubles (Girls)", value: "doubles-girls" },
      { label: "Mixed Doubles", value: "mixed" },
    ],
    categoryPrices: {
      "singles-boys": 100,
      "singles-girls": 100,
      "doubles-boys": 200,
      "doubles-girls": 200,
      mixed: 200,
    },
    dynamicPlayerFields: true,
  },
  volleyball: {
    eventKey: "volleyball",
    title: "Volleyball (Boys & Girls)",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    minPlayers: 6,
    maxPlayers: 9,
    categories: [
      { label: "Boys", value: "boys" },
      { label: "Girls", value: "girls" },
    ],
    requiresGender: true,
    dynamicPlayerFields: true,
  },
  athletics: {
    eventKey: "athletics",
    title: "Athletics",
    priceType: "athletics",
    categories: [
      { label: "Boys", value: "boys" },
      { label: "Girls", value: "girls" },
    ],
    requiresGender: true,
    athleticsEvents: [
      { name: "100m", price: 100 },
      { name: "200m", price: 100 },
      { name: "400m", price: 100 },
      { name: "800m", price: 100 },
      { name: "Long Jump", price: 100 },
      { name: "Shot Put", price: 100 },
      { name: "Relay", price: 400 },
      { name: "Mixed Relay", price: 400 },
    ],
    requiresShotPutSubCategory: true,
    requiresRelayPlayers: true,
  },
  carrom: {
    eventKey: "carrom",
    title: "Carrom",
    priceType: "categoryBased",
    categories: [
      { label: "Singles", value: "singles" },
      { label: "Doubles", value: "doubles" },
    ],
    categoryPrices: {
      singles: 100,
      doubles: 200,
    },
    dynamicPlayerFields: true,
  },
  chess: {
    eventKey: "chess",
    title: "Chess",
    priceType: "fixed",
    fixedPrice: 100,
    fixedPlayerCount: 1,
    dynamicPlayerFields: true,
  },
  "tug-of-war": {
    eventKey: "tug-of-war",
    title: "Tug of War",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    minPlayers: 7,
    maxPlayers: 9,
    categories: [
      { label: "Boys", value: "boys" },
      { label: "Girls", value: "girls" },
    ],
    requiresGender: true,
    dynamicPlayerFields: true,
  },
  bgmi: {
    eventKey: "bgmi",
    title: "E-Sports (BGMI)",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    fixedPlayerCount: 4,
    dynamicPlayerFields: true,
  },
  valorant: {
    eventKey: "valorant",
    title: "E-Sports (VALORANT)",
    priceType: "perPlayer",
    perPlayerPrice: 100,
    fixedPlayerCount: 5,
    dynamicPlayerFields: true,
  },
  "table-tennis": {
    eventKey: "table-tennis",
    title: "Table Tennis",
    priceType: "categoryBased",
    categories: [
      { label: "Singles (Boys)", value: "singles-boys" },
      { label: "Singles (Girls)", value: "singles-girls" },
      { label: "Doubles (Boys)", value: "doubles-boys" },
      { label: "Mixed Doubles", value: "mixed" },
    ],
    categoryPrices: {
      "singles-boys": 100,
      "singles-girls": 100,
      "doubles-boys": 200,
      mixed: 200,
    },
    dynamicPlayerFields: true,
  },
};
