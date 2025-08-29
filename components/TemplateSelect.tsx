import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateStorage, Template } from '../utils/templateStorage';

interface TemplateSelectProps {
  onTemplateSelect: (template: Template) => void;
  onClose: () => void;
  isOpen: boolean;
}

const TemplateSelect: React.FC<TemplateSelectProps> = ({ onTemplateSelect, onClose, isOpen }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'preset' | 'custom' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = () => {
    const allTemplates = TemplateStorage.getAllTemplates();
    setTemplates(allTemplates);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    switch (activeTab) {
      case 'preset':
        return template.category === 'preset';
      case 'custom':
        return template.category === 'custom';
      case 'recent':
        return template.lastUsed && template.lastUsed > 0;
      default:
        return true;
    }
  });

  const handleTemplateSelect = (template: Template) => {
    TemplateStorage.updateTemplateUsage(template.id);
    onTemplateSelect(template);
    onClose();
  };

  const getTemplateIcon = (template: Template) => {
    if (template.tags.includes('技术')) return '💻';
    if (template.tags.includes('销售')) return '📈';
    if (template.tags.includes('项目')) return '📋';
    if (template.tags.includes('管理')) return '👥';
    return '📝';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">选择周报模板</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Search */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="搜索模板..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4">
              {[
                { key: 'all', label: '全部', count: templates.length },
                { key: 'preset', label: '预设模板', count: templates.filter(t => t.category === 'preset').length },
                { key: 'custom', label: '自定义', count: templates.filter(t => t.category === 'custom').length },
                { key: 'recent', label: '最近使用', count: templates.filter(t => t.lastUsed).length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-500">
                  {searchQuery ? '未找到匹配的模板' : '暂无模板'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getTemplateIcon(template)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                            {template.name}
                          </h3>
                          {template.category === 'custom' && (
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                              自定义
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-height-relaxed">
                          {template.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                          <span>使用 {template.useCount} 次</span>
                          {template.lastUsed && (
                            <span>
                              最近使用: {new Date(template.lastUsed).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Preview on hover */}
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gray-50 rounded p-2 text-xs text-gray-600 max-h-20 overflow-hidden">
                        {template.content.substring(0, 100)}...
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                选择模板后将替换当前输入内容
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateSelect;