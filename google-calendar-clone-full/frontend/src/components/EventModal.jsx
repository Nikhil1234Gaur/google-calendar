import { motion } from 'framer-motion';
import { useState } from 'react';
import { createEvent, updateEvent } from '../utils/api';

export default function EventModal({ event, onClose }) {
  const [title, setTitle] = useState(event?.title || '');
  const [start, setStart] = useState(event?.start ? new Date(event.start).toISOString().slice(0,16) : '');
  const [end, setEnd] = useState(event?.end ? new Date(event.end).toISOString().slice(0,16) : '');
  const [desc, setDesc] = useState(event?.description || '');

  async function save(e){
    e.preventDefault();
    const payload = { title, description: desc, start: new Date(start).toISOString(), end: new Date(end).toISOString(), allDay: false };
    try {
      if (event && event.id && String(event.id).startsWith(String(event.id).replace(/\D/g,''))) {
        // event from server may be rrule occ -> has parentId; try update by numeric id only
      }
      if (event && event.id && Number.isInteger(event.id)) {
        await updateEvent(event.id, payload);
      } else {
        await createEvent(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded p-4 shadow-lg w-96">
        <h2 className="text-lg mb-2">Event</h2>
        <form onSubmit={save} className="space-y-2">
          <input className="w-full border p-1" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" required />
          <input type="datetime-local" className="w-full border p-1" value={start} onChange={(e)=>setStart(e.target.value)} required />
          <input type="datetime-local" className="w-full border p-1" value={end} onChange={(e)=>setEnd(e.target.value)} required />
          <textarea className="w-full border p-1" value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Description" />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
