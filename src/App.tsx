import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import DayWiseEvents from './components/DayWiseEvents';
import EventsGrid from './components/EventsGrid';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import EventModal from './components/EventModal';
import { Event } from './types/Event';

function App() {
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <Timeline />
      <DayWiseEvents />
      <EventsGrid onEventClick={openEventModal} />
      <AboutUs />
      <Contact />
      <Footer />
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeEventModal}
      />
    </div>
  );
}

export default App;
