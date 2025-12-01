import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Basketball() {
  return <SportPageTemplate config={eventConfig.basketball} />;
}
