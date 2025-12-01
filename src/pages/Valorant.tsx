import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Valorant() {
  return <SportPageTemplate config={eventConfig.valorant} />;
}
