const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchEvents(start, end){
  const res = await fetch(`${API_URL}/events?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

export async function createEvent(payload){
  const res = await fetch(`${API_URL}/events`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  return res.json();
}

export async function updateEvent(id, payload){
  const res = await fetch(`${API_URL}/events/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  return res.json();
}
