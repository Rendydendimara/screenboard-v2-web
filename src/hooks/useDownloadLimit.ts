
import { useState, useEffect } from 'react';

interface DownloadData {
  count: number;
  downloads: Array<{
    screenId: string;
    screenName: string;
    category: string;
    timestamp: string;
  }>;
}

export const useDownloadLimit = () => {
  const [downloadData, setDownloadData] = useState<DownloadData>({ count: 0, downloads: [] });
  const DOWNLOAD_LIMIT = 10;

  useEffect(() => {
    const saved = localStorage.getItem('downloadData');
    if (saved) {
      try {
        setDownloadData(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing download data:', error);
      }
    }
  }, []);

  const saveDownloadData = (data: DownloadData) => {
    localStorage.setItem('downloadData', JSON.stringify(data));
    setDownloadData(data);
  };

  const canDownload = downloadData.count < DOWNLOAD_LIMIT;
  const remainingDownloads = Math.max(0, DOWNLOAD_LIMIT - downloadData.count);

  const recordDownload = (screenId: string, screenName: string, category: string) => {
    if (!canDownload) return false;

    const newDownload = {
      screenId,
      screenName,
      category,
      timestamp: new Date().toISOString()
    };

    const newData = {
      count: downloadData.count + 1,
      downloads: [...downloadData.downloads, newDownload]
    };

    saveDownloadData(newData);
    return true;
  };

  const resetDownloads = () => {
    saveDownloadData({ count: 0, downloads: [] });
  };

  return {
    downloadData,
    canDownload,
    remainingDownloads,
    recordDownload,
    resetDownloads,
    DOWNLOAD_LIMIT
  };
};
