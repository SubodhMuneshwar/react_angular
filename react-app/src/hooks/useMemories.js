import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook: useMemories
 * Concept: Encapsulates all API network synchronization, local state management,
 * and optimistic mutations into a clean, reusable hook.
 * 
 * Teaches:
 * 1. Decoupling UI presentation from data fetching logic.
 * 2. useCallback for stable handler references.
 * 3. Optimistic UI updates with rollback on error.
 */
export function useMemories() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all memories from .NET 10 API
  const fetchMemories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/memories');
      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }
      const data = await response.json();
      setMemories(data);
    } catch (err) {
      console.error('Failed to load memories:', err);
      setError('Unable to reach .NET 10 backend server on port 5000.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  // Create Memory (POST)
  const addMemory = async (memoryData) => {
    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryData)
      });
      if (!response.ok) throw new Error('Failed to create memory');
      const created = await response.json();

      setMemories((prev) => {
        const next = [created, ...prev];
        return next.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
      return { success: true, data: created };
    } catch (err) {
      console.error('Error adding memory:', err);
      return { success: false, error: err.message };
    }
  };

  // Toggle Core Memory (PUT) with Optimistic UI Update
  const toggleCore = async (id, isCoreMemory) => {
    // 1. Optimistic Update (update UI instantly!)
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCoreMemory } : m))
    );

    try {
      const response = await fetch(`/api/memories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCoreMemory })
      });
      if (!response.ok) throw new Error('Failed to update status on server');
      const updated = await response.json();

      // Confirm with server response
      setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return { success: true };
    } catch (err) {
      console.error('Error toggling core memory, rolling back:', err);
      // Rollback to previous state
      setMemories((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isCoreMemory: !isCoreMemory } : m))
      );
      return { success: false, error: err.message };
    }
  };

  // Delete Memory (DELETE)
  const deleteMemory = async (id) => {
    try {
      const response = await fetch(`/api/memories/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete memory');

      setMemories((prev) => prev.filter((m) => m.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting memory:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    memories,
    isLoading,
    error,
    refresh: fetchMemories,
    addMemory,
    toggleCore,
    deleteMemory
  };
}
