import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

/**
 * Header Component
 * Concept: Functional Component & Props
 * - In React, components are simple JavaScript functions that return JSX.
 * - 'props' are passed into the function just like arguments.
 */
export default function Header({ totalTasks, completedTasks }) {
  return (
    <header className="app-header glass-panel">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Layers size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="brand-title">PulseTask</h1>
            <span className="brand-tag">React Edition</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            Agile Task & Learning Dashboard
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Progress</div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
            {completedTasks} / {totalTasks} Completed
          </div>
        </div>
      </div>
    </header>
  );
}
