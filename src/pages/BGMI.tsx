import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function BGMI() {
  return <SportPageTemplate config={eventConfig.bgmi} />;
}
