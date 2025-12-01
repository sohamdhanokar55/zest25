import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function TugOfWar() {
  return <SportPageTemplate config={eventConfig["tug-of-war"]} />;
}
