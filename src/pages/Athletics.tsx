import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Athletics() {
  return <SportPageTemplate config={eventConfig.athletics} />;
}
