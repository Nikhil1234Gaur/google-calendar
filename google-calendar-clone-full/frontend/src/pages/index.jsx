import Head from 'next/head';
import CalendarView from '../components/CalendarView';
import { useEffect, useState } from 'react';
import { fetchEvents } from '../utils/api';
import EventModal from '../components/EventModal';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [range, setRange] = useState({start: new Date().toISOString(), end: new Date(new Date().setMonth(new Date().getMonth()+1)).toISOString()});
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, [range]);

  async function load(){
    try {
      const ev = await fetchEvents(range.start, range.end);
      setEvents(ev);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <Head><title>Calendar Clone</title></Head>
      <main className="p-4">
        <h1 className="text-2xl mb-4">Google Calendar Clone — Demo</h1>
        <CalendarView events={events} onEventClick={(ev)=>{ setSelected(ev); setOpen(true); }} />
        {open && <EventModal event={selected} onClose={()=>{ setOpen(false); setSelected(null); load(); }} />}
      </main>
    </div>
  );
}
