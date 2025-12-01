import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Badminton() {
  return <SportPageTemplate config={eventConfig.badminton} />;
}
