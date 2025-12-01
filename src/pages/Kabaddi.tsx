import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Kabaddi() {
  return <SportPageTemplate config={eventConfig.kabaddi} />;
}
