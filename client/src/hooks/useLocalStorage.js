import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting React state in localStorage with sync capability.
 * @param {string} key - The key in localStorage.
 * @param {any} initialValue - The fallback value if key doesn't exist.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // Gracefully handle storage quota errors so the app never crashes
      console.warn(`LocalStorage quota exceeded for key "${key}". Data maintained in memory.`);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting React state in localStorage with sync capability.
 * @param {string} key - The key in localStorage.
 * @param {any} initialValue - The fallback value if key doesn't exist.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}