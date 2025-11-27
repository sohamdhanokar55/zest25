export interface Event {
  id: string;
  name: string;
  category: string;
  day?: string;
  venue: string;
  entryFee: string;
  reportingTime: string;
  duration?: string;
  rules: string[];
  teamSize?: string;
  icon: string;
}
