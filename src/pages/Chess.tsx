import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Chess() {
  return <SportPageTemplate config={eventConfig.chess} />;
}
