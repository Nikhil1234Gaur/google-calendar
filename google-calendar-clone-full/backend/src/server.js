const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { RRule } = require('rrule');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Helper: expand recurring events using rrule between start and end (ISO strings)
async function fetchEventsBetween(startISO, endISO) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const events = await prisma.event.findMany();
  const results = [];

  for (const ev of events) {
    if (!ev.recurrence) {
      if (ev.end > start && ev.start < end) {
        results.push(ev);
      }
    } else {
      try {
        const options = RRule.parseString(ev.recurrence);
        options.dtstart = ev.start;
        const rule = new RRule(options);
        const occ = rule.between(start, end, true);
        const duration = new Date(ev.end) - new Date(ev.start);
        for (const d of occ) {
          results.push({
            id: ev.id + '-occ-' + d.toISOString(),
            title: ev.title,
            description: ev.description,
            location: ev.location,
            start: d.toISOString(),
            end: new Date(d.getTime() + duration).toISOString(),
            allDay: ev.allDay,
            color: ev.color,
            parentId: ev.id
          });
        }
      } catch (err) {
        // invalid rrule -> ignore recurrence
        if (ev.end > start && ev.start < end) results.push(ev);
      }
    }
  }
  return results;
}

// GET /api/events?start=ISO&end=ISO
app.get('/api/events', async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ error: 'start and end query params required (ISO strings)' });
  }
  try {
    const events = await fetchEventsBetween(start, end);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST create
app.post('/api/events', async (req, res) => {
  const data = req.body;
  try {
    const ev = await prisma.event.create({ data });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'create failed' });
  }
});

// GET single
app.get('/api/events/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const ev = await prisma.event.findUnique({ where: { id }});
  if (!ev) return res.status(404).json({ error: 'not found' });
  res.json(ev);
});

// PUT update
app.put('/api/events/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  try {
    const ev = await prisma.event.update({ where: { id }, data });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'update failed' });
  }
});

// DELETE
app.delete('/api/events/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.event.delete({ where: { id }});
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'delete failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port', PORT));
