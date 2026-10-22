import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Code, Lightbulb, Zap } from 'lucide-react';

/**
 * LearningBanner Component
 * An interactive educational tool embedded right inside the app!
 * Explains core concepts: JSX, Virtual DOM, Props, State, and Immutability.
 */
export default function LearningBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="learning-banner">
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge-step">STEP 1</span>
          <div className="learning-info">
            <h4>
              <Lightbulb size={18} color="#a5b4fc" />
              React Foundations: Components, JSX, Props & State
            </h4>
            <p>
              Explore how this app is built with pure reusable components and synchronized with the backend.
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
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#a5b4fc', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code size={14} /> 1. JSX (JavaScript XML)
              </div>
              <p style={{ color: 'var(--text-muted)' }}>
                JSX looks like HTML, but it's JavaScript. Notice we use <code>className</code> instead of <code>class</code>, and <code>{`{}`}</code> to evaluate dynamic JS expressions.
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#38bdf8', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={14} /> 2. Props (Properties)
              </div>
              <p style={{ color: 'var(--text-muted)' }}>
                Data flows <strong>downwards</strong> from parent to child via props (like function arguments). The child cannot mutate them!
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#4ade80', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={14} /> 3. State & Immutability
              </div>
              <p style={{ color: 'var(--text-muted)' }}>
                When state changes via <code>setTasks(...)</code>, React re-renders the component. Never mutate state directly (e.g., don't do <code>tasks.push(...)</code>).
              </p>
            </div>
          </div>
        )}
      </div>

      <button 
        className="icon-btn"
        style={{ marginLeft: '1rem', color: '#a5b4fc' }}
        onClick={() => setExpanded(!expanded)}
        title={expanded ? "Collapse Concept Guide" : "Expand Concept Guide"}
      >
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
    </div>
  );
}
