import React, { useState } from 'react';
import { X, Heart, PlusCircle, Image as ImageIcon } from 'lucide-react';

/**
 * MemoryModal Component
 * Concepts:
 * 1. Controlled Components: Form state lives in React state.
 * 2. Form Handling: `e.preventDefault()` prevents browser reload on submit.
 * 3. Quick Image Presets: Enables quick selection of themed photos.
 */
export default function MemoryModal({ isOpen, onClose, onAddMemory }) {
  const today = new Date().toISOString().split('T')[0];

  const presets = [
    { label: 'Chai / Cafe', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80' },
    { label: 'Road Trip', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80' },
    { label: 'Hackathon / Late Night', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Graduation / Celebration', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    date: today,
    location: '',
    mood: 'Laughter',
    story: '',
    insideJoke: '',
    imageUrl: presets[0].url,
    isCoreMemory: false
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a title for this memory.');
      return;
    }

    onAddMemory(formData);
    // Reset form
    setFormData({
      title: '',
      date: today,
      location: '',
      mood: 'Laughter',
      story: '',
      insideJoke: '',
      imageUrl: presets[0].url,
      isCoreMemory: false
    });
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Capture a New Moment</h2>
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
            <label className="form-label">Moment Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Midnight Ice Cream Run"
              value={formData.title}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Marine Drive"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Vibe / Mood</label>
            <select
              name="mood"
              className="form-select"
              value={formData.mood}
              onChange={handleChange}
            >
              <option value="Laughter">🤣 Laughter</option>
              <option value="Adventure">🎒 Adventure</option>
              <option value="Deep Talk">☕ Deep Talk</option>
              <option value="Milestone">🎓 Milestone</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">The Story / Memory</label>
            <textarea
              name="story"
              className="form-textarea"
              rows="3"
              placeholder="What happened? What made this moment unforgettable?"
              value={formData.story}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Inside Joke or Quote (Optional)</label>
            <input
              type="text"
              name="insideJoke"
              className="form-input"
              placeholder="e.g. 'Never let him navigate again!'"
              value={formData.insideJoke}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Photo URL</label>
            <input
              type="url"
              name="imageUrl"
              className="form-input"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {/* Quick presets */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', alignSelf: 'center' }}>Presets:</span>
              {presets.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  style={{
                    background: formData.imageUrl === p.url ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface-elevated)',
                    color: formData.imageUrl === p.url ? '#fbbf24' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}
                  onClick={() => setFormData((prev) => ({ ...prev, imageUrl: p.url }))}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: 'var(--radius-md)',
            marginTop: '0.5rem',
            cursor: 'pointer'
          }} onClick={() => setFormData(prev => ({ ...prev, isCoreMemory: !prev.isCoreMemory }))}>
            <input
              type="checkbox"
              name="isCoreMemory"
              id="isCoreMemory"
              checked={formData.isCoreMemory}
              onChange={handleChange}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="isCoreMemory" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={14} fill={formData.isCoreMemory ? '#f43f5e' : 'none'} color="#f43f5e" />
              Mark as a "Core Memory" (Starred Moment)
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <PlusCircle size={16} /> Save Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
