export interface HistoryRecord {
  id: string;
  timestamp: number;
  date: string;
  input: string;
  output: string;
  title: string;
}

const STORAGE_KEY = 'weekly_report_history';

export class HistoryStorage {
  static getHistory(): HistoryRecord[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading history from localStorage:', error);
      return [];
    }
  }

  static saveRecord(input: string, output: string): string {
    if (typeof window === 'undefined') return '';

    const timestamp = Date.now();
    const date = new Date(timestamp).toLocaleDateString();
    const title = this.generateTitle(input);
    
    const record: HistoryRecord = {
      id: `record_${timestamp}`,
      timestamp,
      date,
      input: input.trim(),
      output: output.trim(),
      title
    };

    try {
      const history = this.getHistory();
      history.unshift(record); // 最新的在前面
      
      // 限制历史记录数量，最多保存100条
      const limitedHistory = history.slice(0, 100);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
      return record.id;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return '';
    }
  }

  static deleteRecord(id: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const history = this.getHistory();
      const filtered = history.filter(record => record.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      return false;
    }
  }

  static getRecord(id: string): HistoryRecord | null {
    const history = this.getHistory();
    return history.find(record => record.id === id) || null;
  }

  static getGroupedHistory(): { [date: string]: HistoryRecord[] } {
    const history = this.getHistory();
    const grouped: { [date: string]: HistoryRecord[] } = {};

    history.forEach(record => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });

    return grouped;
  }

  private static generateTitle(input: string): string {
    const maxLength = 20;
    const cleaned = input.replace(/\n/g, ' ').trim();
    
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    
    return cleaned.substring(0, maxLength - 3) + '...';
  }

  static clearAllHistory(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }
}