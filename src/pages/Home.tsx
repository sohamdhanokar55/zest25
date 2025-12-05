import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import About from "../components/About";
import Timeline from "../components/Timeline";
import DayWiseEvents from "../components/DayWiseEvents";
import EventsGrid from "../components/EventsGrid";
import GeneralRules from "../components/GeneralRules";
import AboutUs from "../components/AboutUs";
import Contact from "../components/Contact";
import EventModal from "../components/EventModal";
import JerseyDesigns from "../components/JerseyDesigns";
import CommunityRulebook from "../components/CommunityRulebook";
import { Event } from "../types/Event";

const Home = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  return (
    <Layout>
      <Hero />
      <About />
      <Timeline />
      <DayWiseEvents />
      <JerseyDesigns />
      <CommunityRulebook />
      <EventsGrid onEventClick={openEventModal} />
      <GeneralRules />
      <AboutUs />
      <Contact />
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeEventModal}
      />
    </Layout>
  );
};

export default Home;
