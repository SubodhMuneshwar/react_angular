import { useState, useEffect } from 'react';

/**
 * Custom Hook: useDebounce
 * Concept: Delay updating the debounced value until after the user pauses typing.
 * Teaches: useEffect cleanup functions (clearing timeouts when dependencies change).
 * 
 * @param {any} value - The input value to debounce (e.g. search query)
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up timer to update debounced value after specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: runs if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
