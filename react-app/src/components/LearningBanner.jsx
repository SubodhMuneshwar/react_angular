import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Code, Lightbulb, Zap, Heart } from 'lucide-react';

/**
 * LearningBanner Component
 * An interactive educational tool embedded right inside the Timeline app!
 * Explains how React handles components, props, state, and derived calculations.
 */
export default function LearningBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="learning-banner">
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge-step">STEP 1</span>
          <div className="learning-info">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fde68a', fontSize: '0.95rem' }}>
              <Lightbulb size={18} color="#fbbf24" />
              Timeline Architecture: Components, Props & Derived State
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Explore how this Timeline app organizes moments, calculates friendship milestones, and updates state immutably.
            </p>
          </div>
        </div>

        {expanded && (
          <div style={{ 
            marginTop: '1.25rem', 
            paddingTop: '1.25rem', 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#fbbf24', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code size={14} /> 1. JSX & Conditional Rendering
              </div>
              <p style={{ color: 'var(--text-muted)' }}>
                Notice how the Inside Joke box only appears if <code>memory.insideJoke</code> exists using <code>{`{memory.insideJoke && <QuoteBox />}`}</code>.
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#f43f5e', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={14} /> 2. Lifting State Up
              </div>
              <p style={{ color: 'var(--text-muted)' }}>
                When clicking the ❤️ button on a <code>&lt;MemoryCard&gt;</code>, the child doesn't change its own data; it calls <code>onToggleCore(id)</code> to ask parent <code>&lt;App&gt;</code> to update it.
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#38bdf8', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={14} /> 3. Derived State (Best Practice)
              </div>
              <p style={{ color: 'var(--text-muted)' }}>
                "Days of Friendship" is not stored in a separate state variable. It is <strong>computed on the fly</strong> from the dates in the memories array!
              </p>
            </div>
          </div>
        )}
      </div>

      <button 
        className="icon-btn"
        style={{ marginLeft: '1rem', color: '#fbbf24' }}
        onClick={() => setExpanded(!expanded)}
        title={expanded ? "Collapse Concept Guide" : "Expand Concept Guide"}
      >
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
    </div>
  );
}
