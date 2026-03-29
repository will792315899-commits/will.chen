import type { AnalysisResult } from '../types';

const KEY = 'ling_jing_history';
const MAX = 20;

export interface HistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string; // 200x200 base64 JPEG
  result: AnalysisResult;
}

export function getHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as HistoryItem[];
  } catch {
    return [];
  }
}

export function addHistoryItem(thumbnail: string, result: AnalysisResult): void {
  const prev = getHistory();
  const item: HistoryItem = { id: Date.now().toString(), timestamp: Date.now(), thumbnail, result };
  localStorage.setItem(KEY, JSON.stringify([item, ...prev].slice(0, MAX)));
}

export function deleteHistoryItem(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(getHistory().filter(i => i.id !== id)));
}

/** Center-crop and resize imageUrl to a small square thumbnail (base64 JPEG). */
export function makeThumbnail(imageUrl: string, size = 200): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      const min = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = imageUrl;
  });
}
