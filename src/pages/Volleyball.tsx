import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Volleyball() {
  return <SportPageTemplate config={eventConfig.volleyball} />;
}
