import React, { useState } from 'react';
import Header from './components/Header';
import MilestonesRibbon from './components/MilestonesRibbon';
import MemoryCard from './components/MemoryCard';
import MemoryModal from './components/MemoryModal';
import LearningBanner from './components/LearningBanner';
import Toast from './components/Toast';
import { useMemories } from './hooks/useMemories';
import { useDebounce } from './hooks/useDebounce';
import { Plus, Search, LayoutGrid, GitCommit, Heart, AlertCircle, RefreshCw, Shuffle } from 'lucide-react';
import './App.css';

export default function App() {
  // Use Custom Hook for clean data architecture
  const { memories, isLoading, error, refresh, addMemory, toggleCore, deleteMemory } = useMemories();

  // Local UI State
  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState('All');
  const [coreOnly, setCoreOnly] = useState(false);
  const [viewMode, setViewMode] = useState('river'); // 'river' or 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Custom Hook: Debounce search input by 300ms
  const debouncedSearch = useDebounce(search, 300);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Wrapped Handlers with Toast Feedback
  const handleAddMemory = async (memoryData) => {
    const res = await addMemory(memoryData);
    if (res.success) {
      showToast('New moment captured in your Timeline! ✨');
    } else {
      showToast(res.error || 'Failed to save moment', 'error');
    }
  };

  const handleToggleCore = async (id, isCoreMemory) => {
    const res = await toggleCore(id, isCoreMemory);
    if (res.success) {
      showToast(isCoreMemory ? 'Starred as Core Memory! ❤️' : 'Removed from Core Memories.');
    } else {
      showToast('Could not update status on backend', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) return;
    const res = await deleteMemory(id);
    if (res.success) {
      showToast('Moment deleted from Timeline.', 'success');
    } else {
      showToast('Failed to delete moment', 'error');
    }
  };

  // Interactive Nostalgia Time Machine (Surprise Me!)
  const handleRandomMemory = () => {
    if (memories.length === 0) return;
    const randomIndex = Math.floor(Math.random() * memories.length);
    const chosen = memories[randomIndex];
    setHighlightedId(chosen.id);

    setTimeout(() => {
      const el = document.getElementById(`mem-${chosen.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setTimeout(() => {
      setHighlightedId(null);
    }, 4000);
  };

  // Derived State: filtered with debounced search query
  const filteredMemories = memories.filter((mem) => {
    const q = debouncedSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      mem.title.toLowerCase().includes(q) ||
      (mem.story && mem.story.toLowerCase().includes(q)) ||
      (mem.location && mem.location.toLowerCase().includes(q)) ||
      (mem.insideJoke && mem.insideJoke.toLowerCase().includes(q));

    const matchesMood = moodFilter === 'All' || mem.mood === moodFilter;
    const matchesCore = !coreOnly || mem.isCoreMemory;

    return matchesSearch && matchesMood && matchesCore;
  });

  // Derived Friendship Stats
  const calculateDaysOfFriendship = () => {
    if (memories.length === 0) return 0;
    const timestamps = memories.map((m) => new Date(m.date).getTime()).filter((t) => !isNaN(t));
    if (timestamps.length === 0) return 0;
    const earliest = Math.min(...timestamps);
    const diff = Math.abs(Date.now() - earliest);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const stats = {
    daysOfFriendship: calculateDaysOfFriendship(),
    totalMemories: memories.length,
    coreMemories: memories.filter((m) => m.isCoreMemory).length,
    adventures: memories.filter((m) => m.mood === 'Adventure').length
  };

  return (
    <div className="app-container">
      {/* 1. Header with branding and live counters */}
      <Header
        daysOfFriendship={stats.daysOfFriendship}
        coreMemoriesCount={stats.coreMemories}
      />

      {/* 2. Educational Concept Banner */}
      <LearningBanner />

      {/* 3. Friendship Milestones Ribbon */}
      <MilestonesRibbon stats={stats} />

      {/* 4. Controls: Search, View Mode, Filter Pills, Random Memory & Add */}
      <section className="controls-bar glass-panel">
        <div className="controls-top-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search memories by place, inside joke, or story..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="controls-actions">
            {/* View Switcher: River vs Scrapbook */}
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'river' ? 'active' : ''}`}
                onClick={() => setViewMode('river')}
                title="Timeline River View"
              >
                <GitCommit size={16} /> River
              </button>
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Scrapbook Grid View"
              >
                <LayoutGrid size={16} /> Scrapbook
              </button>
            </div>

            {/* Nostalgia Time Machine */}
            <button
              className="btn-random"
              onClick={handleRandomMemory}
              title="Surprise me with a random memory!"
            >
              <Shuffle size={16} /> Surprise Me!
            </button>

            {/* Capture New Memory */}
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Add Moment
            </button>
          </div>
        </div>

        {/* Mood Filter Pills & Core Memories Only Toggle */}
        <div className="filter-pills-row">
          {['All', 'Laughter', 'Adventure', 'Deep Talk', 'Milestone'].map((mood) => (
            <button
              key={mood}
              className={`filter-pill ${moodFilter === mood ? 'active' : ''}`}
              onClick={() => setMoodFilter(mood)}
            >
              {mood === 'All' ? '✨ All Moments' : mood}
            </button>
          ))}

          <button
            className={`filter-pill ${coreOnly ? 'active' : ''}`}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            onClick={() => setCoreOnly(!coreOnly)}
          >
            <Heart size={14} fill={coreOnly ? '#f43f5e' : 'none'} color="#f43f5e" />
            Core Memories Only
          </button>
        </div>
      </section>

      {/* 5. Error & Retry notification */}
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
            onClick={refresh}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* 6. Main Content: Timeline River or Scrapbook Grid */}
      <main>
        {isLoading ? (
          <div className="empty-state">
            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
            <p style={{ marginTop: '1rem' }}>Loading moments from .NET 10 backend...</p>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="empty-state glass-panel">
            <p className="empty-state-icon">📸</p>
            <h3>No moments found</h3>
            <p style={{ marginTop: '0.5rem' }}>
              Try adjusting your search query or filters, or capture a brand new moment!
            </p>
          </div>
        ) : viewMode === 'river' ? (
          <div className="timeline-river">
            {filteredMemories.map((memory, index) => (
              <div
                key={memory.id}
                id={`mem-${memory.id}`}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="timeline-node" />
                <MemoryCard
                  memory={memory}
                  onToggleCore={handleToggleCore}
                  onDelete={handleDelete}
                  isHighlighted={highlightedId === memory.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="scrapbook-grid">
            {filteredMemories.map((memory) => (
              <div key={memory.id} id={`mem-${memory.id}`}>
                <MemoryCard
                  memory={memory}
                  onToggleCore={handleToggleCore}
                  onDelete={handleDelete}
                  isHighlighted={highlightedId === memory.id}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 7. Capture Memory Modal */}
      <MemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMemory={handleAddMemory}
      />

      {/* 8. Toast Feedback Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
