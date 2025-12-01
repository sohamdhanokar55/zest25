import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Carrom() {
  return <SportPageTemplate config={eventConfig.carrom} />;
}
