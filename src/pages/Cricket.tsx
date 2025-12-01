import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Cricket() {
  return <SportPageTemplate config={eventConfig.cricket} />;
}
