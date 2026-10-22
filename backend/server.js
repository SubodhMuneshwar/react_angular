const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper to read tasks
function getTasks() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading tasks file:', err);
    return [];
  }
}

// Helper to save tasks
function saveTasks(tasks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing tasks file:', err);
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/tasks - Retrieve all tasks with optional query filters
app.get('/api/tasks', (req, res) => {
  let tasks = getTasks();
  const { search, status, priority, category } = req.query;

  if (search) {
    const q = search.toLowerCase();
    tasks = tasks.filter(t => 
      t.title.toLowerCase().includes(q) || 
      (t.description && t.description.toLowerCase().includes(q))
    );
  }

  if (status && status !== 'All') {
    tasks = tasks.filter(t => t.status === status);
  }

  if (priority && priority !== 'All') {
    tasks = tasks.filter(t => t.priority === priority);
  }

  if (category && category !== 'All') {
    tasks = tasks.filter(t => t.category === category);
  }

  res.json(tasks);
});

// GET /api/tasks/:id - Retrieve a single task by ID
app.get('/api/tasks/:id', (req, res) => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, category, priority, status } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const tasks = getTasks();
  const newTask = {
    id: `task-${Date.now()}`,
    title: title.trim(),
    description: description ? description.trim() : '',
    category: category || 'General',
    priority: priority || 'Medium',
    status: status || 'Todo',
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update an existing task
app.put('/api/tasks/:id', (req, res) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updated = {
    ...tasks[index],
    ...req.body,
    id: tasks[index].id, // Prevent ID mutation
    updatedAt: new Date().toISOString()
  };

  tasks[index] = updated;
  saveTasks(tasks);
  res.json(updated);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== req.params.id);
  if (filtered.length === tasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }

  saveTasks(filtered);
  res.json({ message: 'Task deleted successfully', id: req.params.id });
});

// GET /api/stats - Dashboard analytics summary
app.get('/api/stats', (req, res) => {
  const tasks = getTasks();
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    highPriority: tasks.filter(t => t.priority === 'High').length
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
