import SportPageTemplate from "./SportPageTemplate";
import { eventConfig } from "../config/eventConfig";

export default function Futsal() {
  return <SportPageTemplate config={eventConfig.futsal} />;
}
