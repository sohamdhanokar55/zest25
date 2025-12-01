// Sport configuration for pricing and player limits
export const SPORT_CONFIG: Record<
  string,
  {
    type: "team" | "dropdown" | "athletics" | "fixed" | "bgmi" | "valorant";
    min?: number;
    max?: number;
    fixed?: number;
    options?: { label: string; value: string; price: number }[];
    athleticsEvents?: { name: string; price: number }[];
    categoryBasedLimits?: {
      boys?: { min: number; max: number };
      girls?: { min: number; max: number };
    };
  }
> = {
  football: {
    type: "team",
    min: 11,
    max: 15,
  },
  cricket: {
    type: "team",
    min: 11,
    max: 15,
  },
  "box-cricket": {
    type: "team",
    min: 7,
    max: 9,
  },
  futsal: {
    type: "team",
    min: 5,
    max: 7,
  },
  kabaddi: {
    type: "team",
    min: 7,
    max: 9,
  },
  basketball: {
    type: "team",
    categoryBasedLimits: {
      boys: { min: 5, max: 10 },
      girls: { min: 3, max: 5 },
    },
  },
  badminton: {
    type: "dropdown",
    options: [
      { label: "Singles (Boys)", value: "singles-boys", price: 100 },
      { label: "Singles (Girls)", value: "singles-girls", price: 100 },
      { label: "Doubles (Boys)", value: "doubles-boys", price: 200 },
      { label: "Doubles (Girls)", value: "doubles-girls", price: 200 },
      { label: "Mixed Doubles", value: "mixed", price: 200 },
    ],
  },
  volleyball: {
    type: "team",
    min: 6,
    max: 9,
  },
  athletics: {
    type: "athletics",
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
  },
  carrom: {
    type: "dropdown",
    options: [
      { label: "Singles", value: "singles", price: 100 },
      { label: "Doubles", value: "doubles", price: 200 },
    ],
  },
  chess: {
    type: "fixed",
    fixed: 100,
  },
  "tug-of-war": {
    type: "team",
    min: 7,
    max: 9,
  },
  bgmi: {
    type: "bgmi",
    fixed: 4,
  },
  valorant: {
    type: "valorant",
    fixed: 4,
  },
  "table-tennis": {
    type: "dropdown",
    options: [
      { label: "Singles (Boys)", value: "singles-boys", price: 100 },
      { label: "Singles (Girls)", value: "singles-girls", price: 100 },
      { label: "Doubles (Boys)", value: "doubles-boys", price: 200 },
      { label: "Mixed Doubles", value: "mixed", price: 200 },
    ],
  },
};

export const BASE_PRICE = 100;

// Map event IDs to route paths
export const SPORT_ROUTES: Record<string, string> = {
  football: "/football",
  cricket: "/cricket",
  "box-cricket": "/boxcricket",
  futsal: "/futsal",
  kabaddi: "/kabaddi",
  basketball: "/basketball",
  badminton: "/badminton",
  volleyball: "/volleyball",
  athletics: "/athletics",
  carrom: "/carrom",
  chess: "/chess",
  "tug-of-war": "/tugofwar",
  bgmi: "/bgmi",
  valorant: "/valorant",
  "table-tennis": "/tabletennis",
};

