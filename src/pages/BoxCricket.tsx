import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function BoxCricket() {
  return <SportPageTemplate config={eventConfig["box-cricket"]} />;
}
