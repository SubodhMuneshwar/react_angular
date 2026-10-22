import React from 'react';
import { Calendar, MapPin, Heart, Trash2, Quote, Sparkles } from 'lucide-react';

/**
 * MemoryCard Component
 * Concepts:
 * 1. Props Passing: Receives memory data and callbacks (`onToggleCore`, `onDelete`).
 * 2. Lifting State Up: When the user hearts or deletes a memory, the child triggers the parent's function.
 * 3. Conditional Rendering: Only renders inside joke or image if they exist.
 */
export default function MemoryCard({ memory, onToggleCore, onDelete, isHighlighted }) {
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  const getMoodClass = (mood) => {
    switch (mood) {
      case 'Laughter': return 'mood-laughter';
      case 'Adventure': return 'mood-adventure';
      case 'Deep Talk': return 'mood-deep-talk';
      case 'Milestone': return 'mood-milestone';
      default: return 'mood-laughter';
    }
  };

  return (
    <article className={`memory-card glass-panel ${memory.isCoreMemory ? 'core-memory' : ''} ${isHighlighted ? 'highlighted' : ''}`}>
      {/* Photo Header */}
      {memory.imageUrl && (
        <div className="memory-photo-wrapper">
          <img 
            src={memory.imageUrl} 
            alt={memory.title} 
            className="memory-photo" 
            loading="lazy"
          />
          <div className="memory-photo-overlay">
            <span className={`mood-badge ${getMoodClass(memory.mood)}`}>
              {memory.mood}
            </span>

            <button 
              className={`btn-heart ${memory.isCoreMemory ? 'active' : ''}`}
              title={memory.isCoreMemory ? 'Core Memory (Click to unstar)' : 'Mark as Core Memory'}
              onClick={() => onToggleCore(memory.id, !memory.isCoreMemory)}
            >
              <Heart size={16} fill={memory.isCoreMemory ? '#f43f5e' : 'none'} />
            </button>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="memory-content">
        <div className="memory-meta">
          <span className="meta-item">
            <Calendar size={14} color="var(--primary)" />
            {formatDate(memory.date)}
          </span>
          {memory.location && (
            <span className="meta-item">
              <MapPin size={14} color="var(--text-faint)" />
              {memory.location}
            </span>
          )}
        </div>

        <h3 className="memory-title">
          {memory.isCoreMemory && <Sparkles size={16} color="#fbbf24" style={{ display: 'inline', marginRight: '6px' }} />}
          {memory.title}
        </h3>

        <p className="memory-story">{memory.story}</p>

        {/* The Inside Joke Box */}
        {memory.insideJoke && (
          <div className="inside-joke-box">
            <div className="inside-joke-label">
              <Quote size={12} /> The Inside Joke
            </div>
            <p className="inside-joke-text">{memory.insideJoke}</p>
          </div>
        )}

        <div className="memory-footer">
          <button 
            className="icon-btn delete" 
            title="Delete this memory"
            onClick={() => onDelete(memory.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
