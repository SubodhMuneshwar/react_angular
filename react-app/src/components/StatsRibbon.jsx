import React from 'react';
import { CheckCircle2, Clock, ListTodo, Flame } from 'lucide-react';

/**
 * StatsRibbon Component
 * Concept: Props Destructuring & Component Decomposition
 * - Instead of writing 4 identical HTML blocks, we define a config array and map() over it.
 * - Each item in map() MUST have a unique `key` prop!
 */
export default function StatsRibbon({ stats }) {
  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.15)'
    },
    {
      label: 'To Do',
      value: stats.todo,
      icon: Clock,
      color: '#cbd5e1',
      bg: 'rgba(148, 163, 184, 0.15)'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Flame,
      color: '#60a5fa',
      bg: 'rgba(59, 130, 246, 0.15)'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: '#4ade80',
      bg: 'rgba(34, 197, 94, 0.15)'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="stat-card glass-panel">
            <div className="stat-icon" style={{ backgroundColor: card.bg, color: card.color }}>
              <Icon size={20} />
            </div>
            <div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
