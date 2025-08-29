import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryStorage, HistoryRecord } from '../utils/historyStorage';
import { marked } from 'marked';

interface HistoryPanelProps {
  onRecordSelect: (record: HistoryRecord) => void;
  className?: string;
  refreshTrigger?: number; // 新增：用于触发刷新的prop
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onRecordSelect, className = '', refreshTrigger }) => {
  const [groupedHistory, setGroupedHistory] = useState<{ [date: string]: HistoryRecord[] }>({});
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);

  const loadHistory = () => {
    const grouped = HistoryStorage.getGroupedHistory();
    setGroupedHistory(grouped);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 监听 refreshTrigger 变化，触发历史记录刷新
  useEffect(() => {
    if (refreshTrigger) {
      loadHistory();
    }
  }, [refreshTrigger]);

  const handleRecordClick = (record: HistoryRecord) => {
    setSelectedRecordId(record.id);
    onRecordSelect(record);
  };

  const handleDeleteRecord = (recordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这条记录吗？')) {
      HistoryStorage.deleteRecord(recordId);
      loadHistory();
      if (selectedRecordId === recordId) {
        setSelectedRecordId('');
      }
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTotalRecords = () => {
    return Object.values(groupedHistory).reduce((total, records) => total + records.length, 0);
  };

  if (!isVisible) {
    return (
      <div className={`${className} w-80 flex-shrink-0`}>
        <button
          onClick={() => setIsVisible(true)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-l-lg shadow-lg z-10"
        >
          📋
        </button>
      </div>
    );
  }

  return (
    <div className={`${className} w-80 flex-shrink-0 bg-gray-50 border-l border-gray-200 h-screen overflow-hidden flex flex-col`}>
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🕒</span>
          <h3 className="font-semibold text-gray-800">历史记录</h3>
          {getTotalRecords() > 0 && (
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {getTotalRecords()}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
          title="隐藏历史记录"
        >
          ×
        </button>
      </div>

      {/* 隐私说明 */}
      <div className="bg-blue-50 border-b border-blue-100 p-3">
        <div className="flex items-start space-x-2 text-xs text-blue-700">
          <span className="text-sm">🔒</span>
          <div>
            <p className="font-medium mb-1">数据仅保存在本地</p>
            <p className="text-blue-600">所有生成记录只存储在您的浏览器中，不会上传到服务器。清除浏览器数据或更换设备将丢失历史记录。</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>暂无历史记录</p>
            <p className="text-sm mt-1">生成周报后会自动保存到本地</p>
            <p className="text-xs mt-2 text-gray-400">记录仅存储在浏览器中，确保数据隐私</p>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {Object.entries(groupedHistory)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, records]) => (
                <div key={date} className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 px-2">
                    <span>📅</span>
                    <span>{date}</span>
                  </div>
                  <div className="space-y-1">
                    {records.map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group cursor-pointer rounded-lg border p-3 transition-colors hover:bg-white ${
                          selectedRecordId === record.id 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                        onClick={() => handleRecordClick(record)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 mb-1">
                              {formatTime(record.timestamp)}
                            </div>
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {record.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {record.input.substring(0, 60)}...
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDeleteRecord(record.id, e)}
                            className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                            title="删除记录"
                          >
                            🗑️
                          </button>
                        </div>
                        {selectedRecordId === record.id && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="text-xs text-blue-600 font-medium">
                              ▶ 当前选中
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {Object.keys(groupedHistory).length > 0 && (
        <div className="border-t border-gray-200 p-3 space-y-2">
          <div className="text-xs text-gray-400 text-center mb-2">
            💡 数据安全提示：历史记录存储在本地浏览器，不会同步到云端
          </div>
          <button
            onClick={() => {
              if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
                HistoryStorage.clearAllHistory();
                loadHistory();
                setSelectedRecordId('');
              }
            }}
            className="w-full text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            清空所有记录
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;