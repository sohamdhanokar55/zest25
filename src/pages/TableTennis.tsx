import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function TableTennis() {
  return <SportPageTemplate config={eventConfig["table-tennis"]} />;
}
