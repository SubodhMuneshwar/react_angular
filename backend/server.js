const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'memories.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper to read memories
function getMemories() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const memories = JSON.parse(raw);
    // Sort chronologically by default (newest first or oldest first)
    return memories.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error('Error reading memories file:', err);
    return [];
  }
}

// Helper to save memories
function saveMemories(memories) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memories, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing memories file:', err);
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Timeline Backend', timestamp: new Date().toISOString() });
});

// GET /api/memories - Get all moments with search, mood, and year filtering
app.get('/api/memories', (req, res) => {
  let memories = getMemories();
  const { search, mood, year, coreOnly } = req.query;

  if (search) {
    const q = search.toLowerCase();
    memories = memories.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.story && m.story.toLowerCase().includes(q)) ||
      (m.location && m.location.toLowerCase().includes(q)) ||
      (m.insideJoke && m.insideJoke.toLowerCase().includes(q))
    );
  }

  if (mood && mood !== 'All') {
    memories = memories.filter(m => m.mood === mood);
  }

  if (year && year !== 'All') {
    memories = memories.filter(m => new Date(m.date).getFullYear().toString() === year);
  }

  if (coreOnly === 'true') {
    memories = memories.filter(m => m.isCoreMemory);
  }

  res.json(memories);
});

// GET /api/memories/:id - Get a single memory
app.get('/api/memories/:id', (req, res) => {
  const memories = getMemories();
  const memory = memories.find(m => m.id === req.params.id);
  if (!memory) {
    return res.status(404).json({ error: 'Memory not found' });
  }
  res.json(memory);
});

// POST /api/memories - Add a new moment
app.post('/api/memories', (req, res) => {
  const { title, date, location, mood, story, insideJoke, isCoreMemory, imageUrl } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Memory title is required' });
  }

  const memories = getMemories();
  const newMemory = {
    id: `mem-${Date.now()}`,
    title: title.trim(),
    date: date || new Date().toISOString().split('T')[0],
    location: location ? location.trim() : 'Unknown Place',
    mood: mood || 'Laughter',
    story: story ? story.trim() : '',
    insideJoke: insideJoke ? insideJoke.trim() : '',
    isCoreMemory: Boolean(isCoreMemory),
    imageUrl: imageUrl && imageUrl.trim() !== '' ? imageUrl.trim() : 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString()
  };

  memories.push(newMemory);
  saveMemories(memories);
  res.status(201).json(newMemory);
});

// PUT /api/memories/:id - Update memory (e.g. toggle Core Memory ❤️)
app.put('/api/memories/:id', (req, res) => {
  const memories = getMemories();
  const index = memories.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Memory not found' });
  }

  const updated = {
    ...memories[index],
    ...req.body,
    id: memories[index].id,
    updatedAt: new Date().toISOString()
  };

  memories[index] = updated;
  saveMemories(memories);
  res.json(updated);
});

// DELETE /api/memories/:id - Delete memory
app.delete('/api/memories/:id', (req, res) => {
  const memories = getMemories();
  const filtered = memories.filter(m => m.id !== req.params.id);
  if (filtered.length === memories.length) {
    return res.status(404).json({ error: 'Memory not found' });
  }

  saveMemories(filtered);
  res.json({ message: 'Memory deleted', id: req.params.id });
});

// GET /api/stats - Friendship analytics & milestone counters
app.get('/api/stats', (req, res) => {
  const memories = getMemories();
  if (memories.length === 0) {
    return res.json({
      daysOfFriendship: 0,
      totalMemories: 0,
      coreMemories: 0,
      adventures: 0
    });
  }

  // Calculate days since first memory
  const dates = memories.map(m => new Date(m.date).getTime()).filter(t => !isNaN(t));
  const earliestDate = Math.min(...dates);
  const diffTime = Math.abs(Date.now() - earliestDate);
  const daysOfFriendship = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  res.json({
    daysOfFriendship,
    totalMemories: memories.length,
    coreMemories: memories.filter(m => m.isCoreMemory).length,
    adventures: memories.filter(m => m.mood === 'Adventure').length
  });
});

app.listen(PORT, () => {
  console.log(`Timeline Backend running on http://localhost:${PORT}`);
});
