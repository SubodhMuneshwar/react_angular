import React from 'react';
import { Compass, Sparkles, Heart } from 'lucide-react';

/**
 * Header Component
 * Concept: Functional Components & Props
 * - Receives `daysOfFriendship` and `coreMemoriesCount` as props from parent App.
 * - Displays branding and dynamic friendship counters.
 */
export default function Header({ daysOfFriendship, coreMemoriesCount }) {
  return (
    <header className="app-header glass-panel">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Compass size={28} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="brand-title">Timeline</h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              React Edition
            </span>
          </div>
          <p className="brand-subtitle">
            Every laugh, late-night trip & milestone with my best friend
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="friendship-counter-pill">
          <Sparkles size={18} color="#fbbf24" />
          <div>
            <div className="counter-number">{daysOfFriendship.toLocaleString()}</div>
            <div className="counter-label">Days of Friendship</div>
          </div>
        </div>

        <div className="friendship-counter-pill" style={{ borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.1)' }}>
          <Heart size={18} color="#f43f5e" fill="#f43f5e" />
          <div>
            <div className="counter-number" style={{ color: '#fb7185' }}>{coreMemoriesCount}</div>
            <div className="counter-label">Core Memories</div>
          </div>
        </div>
      </div>
    </header>
  );
}
