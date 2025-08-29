import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateStorage, Template } from '../utils/templateStorage';

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreate?: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ isOpen, onClose, onTemplateCreate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    tags: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = () => {
    const allTemplates = TemplateStorage.getAllTemplates();
    setTemplates(allTemplates);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      content: '',
      tags: ''
    });
    setEditingTemplate(null);
    setShowCreateForm(false);
  };

  const handleCreateTemplate = () => {
    if (!formData.name || !formData.content) {
      alert('请填写模板名称和内容');
      return;
    }

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    TemplateStorage.saveCustomTemplate({
      name: formData.name,
      description: formData.description,
      content: formData.content,
      tags
    });

    resetForm();
    loadTemplates();
    onTemplateCreate?.();
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('确定要删除这个模板吗？')) {
      TemplateStorage.deleteCustomTemplate(templateId);
      loadTemplates();
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      content: template.content,
      tags: template.tags.join(', ')
    });
    setShowCreateForm(true);
  };

  const customTemplates = templates.filter(t => t.category === 'custom');
  const presetTemplates = templates.filter(t => t.category === 'preset');

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
          className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">模板管理</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  创建模板
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-full max-h-[calc(90vh-80px)]">
            {/* 左侧列表 */}
            <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  自定义模板 ({customTemplates.length})
                </h3>
                
                {customTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p>还没有自定义模板</p>
                    <p className="text-sm">点击"创建模板"开始</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customTemplates.map(template => (
                      <div
                        key={template.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{template.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
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
                            <div className="text-xs text-gray-400 mt-2">
                              使用 {template.useCount} 次 • 创建于 {new Date(template.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    预设模板 ({presetTemplates.length})
                  </h3>
                  <div className="space-y-2">
                    {presetTemplates.map(template => (
                      <div
                        key={template.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-700">{template.name}</h4>
                            <p className="text-sm text-gray-500">{template.description}</p>
                          </div>
                          <div className="text-xs text-gray-400">
                            使用 {template.useCount} 次
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧表单 */}
            <div className="w-1/2 overflow-y-auto">
              {showCreateForm ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {editingTemplate ? '编辑模板' : '创建新模板'}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        模板名称 *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例如：技术周报模板"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        模板描述
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="简单描述这个模板的用途"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        标签
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="用逗号分隔，例如：技术,开发,程序员"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        模板内容 *
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="在这里输入模板内容，支持 Markdown 格式..."
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleCreateTemplate}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {editingTemplate ? '更新模板' : '创建模板'}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium mb-2">创建自定义模板</h3>
                    <p className="text-sm mb-4">根据你的需求创建专属周报模板</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      开始创建
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateManager;