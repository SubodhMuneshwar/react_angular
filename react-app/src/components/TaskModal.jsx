import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

/**
 * TaskModal Component
 * Concepts:
 * 1. Controlled Components: In React, form inputs are controlled by React state.
 *    The input value is driven by state, and changes update the state via onChange.
 * 2. Form Submission: `e.preventDefault()` stops the browser from doing a full page refresh.
 * 3. Local State: State that is only needed inside this dialog lives here with `useState`.
 */
export default function TaskModal({ isOpen, onClose, onAddTask }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    priority: 'Medium',
    status: 'Todo'
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    onAddTask(formData);
    // Reset form state
    setFormData({
      title: '',
      description: '',
      category: 'Frontend',
      priority: 'Medium',
      status: 'Todo'
    });
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create New Task</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ color: '#f43f5e', fontSize: '0.85rem', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Master React useState Hook"
              value={formData.title}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="3"
              placeholder="Brief description of what needs to be accomplished..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Architecture">Architecture</option>
                <option value="Testing">Testing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <PlusCircle size={16} /> Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
