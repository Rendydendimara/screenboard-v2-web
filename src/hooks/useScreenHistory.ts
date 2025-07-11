
import { useState, useEffect } from 'react';

interface HistoryItem {
  screenId: string;
  screenName: string;
  category: string;
  appName: string;
  timestamp: string;
  action: 'viewed' | 'downloaded';
}

export const useScreenHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('screenHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing screen history:', error);
      }
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    localStorage.setItem('screenHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const addToHistory = (item: Omit<HistoryItem, 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      timestamp: new Date().toISOString()
    };

    // Remove duplicate if exists (same screen and action)
    const filtered = history.filter(
      h => !(h.screenId === item.screenId && h.action === item.action)
    );

    // Add new item at the beginning and limit to 100 items
    const newHistory = [newItem, ...filtered].slice(0, 100);
    saveHistory(newHistory);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const getFilteredHistory = (filter?: 'viewed' | 'downloaded') => {
    if (!filter) return history;
    return history.filter(item => item.action === filter);
  };

  return {
    history,
    addToHistory,
    clearHistory,
    getFilteredHistory
  };
};
