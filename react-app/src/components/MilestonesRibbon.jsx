import React from 'react';
import { CalendarDays, Camera, Heart, Compass } from 'lucide-react';

/**
 * MilestonesRibbon Component
 * Concept: Array Mapping & Key Props
 * - Maps over an array of milestone objects to dynamically create cards.
 * - Always provide a stable unique `key` prop when rendering lists in React!
 */
export default function MilestonesRibbon({ stats }) {
  const cards = [
    {
      label: 'Days of Friendship',
      value: stats.daysOfFriendship,
      icon: CalendarDays,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)'
    },
    {
      label: 'Moments Captured',
      value: stats.totalMemories,
      icon: Camera,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.15)'
    },
    {
      label: 'Core Memories',
      value: stats.coreMemories,
      icon: Heart,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.15)'
    },
    {
      label: 'Epic Adventures',
      value: stats.adventures,
      icon: Compass,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="stat-card glass-panel">
            <div className="stat-icon" style={{ backgroundColor: card.bg, color: card.color }}>
              <Icon size={22} />
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
