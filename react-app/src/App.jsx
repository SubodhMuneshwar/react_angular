import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsRibbon from './components/StatsRibbon';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import LearningBanner from './components/LearningBanner';
import { Plus, Search, AlertCircle, RefreshCw } from 'lucide-react';
import './App.css';

export default function App() {
  // State: Memory of the Component
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Side Effect: Fetch tasks from the shared backend API on mount
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Could not connect to backend server. Make sure it is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handler: Create Task (POST to backend)
  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Failed to create task');
      const created = await response.json();
      
      // Immutability in React: Create a brand new array with the new task first
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to save task to backend.');
    }
  };

  // Handler: Update Task Status (PUT to backend)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updated = await response.json();

      // Update state immutably using map()
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task on backend.');
    }
  };

  // Handler: Delete Task (DELETE from backend)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');

      // Remove from state immutably using filter()
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    }
  };

  // Derived State (Computed on every render, no separate state variable needed!)
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'Todo').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length
  };

  return (
    <div className="app-container">
      {/* 1. Header Component */}
      <Header totalTasks={stats.total} completedTasks={stats.completed} />

      {/* 2. Educational Concept Banner */}
      <LearningBanner />

      {/* 3. Stats Ribbon Component */}
      <StatsRibbon stats={stats} />

      {/* 4. Controls: Search, Filter Tabs & Add Task Button */}
      <section className="controls-bar glass-panel">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['All', 'Todo', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              className={`tab-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Task
        </button>
      </section>

      {/* 5. Error & Loading Notifications */}
      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fda4af',
          padding: '1rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button 
            className="btn-secondary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            onClick={fetchTasks}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* 6. Tasks Grid */}
      <main className="tasks-grid">
        {isLoading ? (
          <div className="empty-state">
            <RefreshCw size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem' }}>Loading tasks from backend API...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-icon">📋</p>
            <h3>No tasks found</h3>
            <p>Try adjusting your search query or filter status, or click "New Task" to create one.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </main>

      {/* 7. Modal Form */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
