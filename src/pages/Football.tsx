import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Football() {
  return <SportPageTemplate config={eventConfig.football} />;
}
