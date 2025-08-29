export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: 'preset' | 'custom';
  tags: string[];
  createdAt: number;
  lastUsed?: number;
  useCount: number;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const STORAGE_KEY = 'weekly_report_templates';
const TEMPLATE_STATS_KEY = 'weekly_report_template_stats';

export class TemplateStorage {
  // 预设模板
  static getPresetTemplates(): Template[] {
    return [
      {
        id: 'tech_weekly',
        name: '技术开发周报',
        description: '适合程序员和技术人员使用的周报模板',
        content: `本周主要完成了以下技术开发工作：

## 🔧 开发任务
- [请填写本周完成的开发任务]

## 🐛 问题解决
- [请填写遇到的技术问题及解决方案]

## 📚 学习成长
- [请填写本周的技术学习和成长]

## 📋 下周计划
- [请填写下周的工作计划]`,
        category: 'preset',
        tags: ['技术', '开发', '程序员'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'sales_weekly',
        name: '销售业务周报',
        description: '适合销售人员使用的业绩汇报模板',
        content: `本周销售工作总结：

## 📊 业绩数据
- [请填写本周的销售数据和完成情况]

## 👥 客户跟进
- [请填写重要客户的跟进情况]

## 🎯 重点项目
- [请填写本周重点项目的进展]

## 💡 问题与改进
- [请填写遇到的问题和改进建议]

## 📈 下周目标
- [请填写下周的销售目标和计划]`,
        category: 'preset',
        tags: ['销售', '业务', '客户'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'project_weekly',
        name: '项目管理周报',
        description: '适合项目经理和管理人员使用',
        content: `项目进展周报：

## 📋 项目概况
- [请填写项目整体进展情况]

## ✅ 本周完成
- [请填写本周完成的重要里程碑]

## ⚠️ 风险与问题
- [请填写项目风险和待解决问题]

## 👥 团队协作
- [请填写团队协作和沟通情况]

## 🎯 下周重点
- [请填写下周的工作重点和目标]`,
        category: 'preset',
        tags: ['项目', '管理', '团队'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'general_weekly',
        name: '通用工作周报',
        description: '适合各种职位的通用模板',
        content: `工作周报：

## 本周工作内容
- [请填写本周主要工作内容]

## 工作成果
- [请填写本周的工作成果和亮点]

## 遇到的问题
- [请填写工作中遇到的困难和问题]

## 学习与改进
- [请填写本周的学习收获和改进想法]

## 下周计划
- [请填写下周的工作安排]`,
        category: 'preset',
        tags: ['通用', '基础'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'marketing_weekly',
        name: '市场营销周报',
        description: '适合市场营销人员的专业模板',
        content: `本周市场营销工作总结：

## 📢 推广活动
- [请填写本周执行的营销活动和效果]

## 📊 数据分析
- 网站流量：[填写数据]
- 转化率：[填写数据]
- 用户增长：[填写数据]

## 🎯 渠道运营
- [请填写各渠道的运营情况]

## 💰 预算使用
- [请填写本周营销预算使用情况]

## 📈 下周规划
- [请填写下周的营销计划和目标]`,
        category: 'preset',
        tags: ['市场', '营销', '推广'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'hr_weekly',
        name: '人力资源周报',
        description: '适合HR和人事管理人员',
        content: `人力资源工作周报：

## 👥 招聘进展
- [请填写本周招聘工作进展]

## 🎓 培训发展
- [请填写员工培训和发展活动]

## 📋 行政事务
- [请填写处理的行政和人事事务]

## 📊 员工关怀
- [请填写员工关怀和团建活动]

## 📅 下周重点
- [请填写下周HR工作重点]`,
        category: 'preset',
        tags: ['人力资源', 'HR', '招聘'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'design_weekly',
        name: '设计师周报',
        description: '适合UI/UX设计师和视觉设计师',
        content: `本周设计工作汇报：

## 🎨 设计项目
- [请填写本周完成的设计项目]

## 💡 创意探索
- [请填写新的设计理念和尝试]

## 🔍 用户研究
- [请填写用户调研和反馈收集]

## 🛠️ 工具学习
- [请填写新工具或技能的学习]

## 📋 下周计划
- [请填写下周的设计任务安排]`,
        category: 'preset',
        tags: ['设计', 'UI', 'UX'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'qa_weekly',
        name: '测试工程师周报',
        description: '适合QA测试工程师使用',
        content: `测试工作周报：

## 🧪 测试执行
- [请填写本周执行的测试任务]

## 🐛 缺陷管理
- 发现缺陷：[数量]个
- 回归测试：[数量]个
- 已修复：[数量]个

## 📊 质量评估
- [请填写产品质量评估结果]

## 🔧 流程改进
- [请填写测试流程优化建议]

## 📅 下周安排
- [请填写下周测试计划]`,
        category: 'preset',
        tags: ['测试', 'QA', '质量'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'finance_weekly',
        name: '财务会计周报',
        description: '适合财务和会计人员',
        content: `财务工作周报：

## 💰 账务处理
- [请填写本周处理的账务工作]

## 📊 报表分析
- [请填写完成的财务报表和分析]

## 🧾 发票管理
- [请填写发票开具和管理情况]

## 📋 合规检查
- [请填写合规性检查和审核工作]

## 📈 下周重点
- [请填写下周财务工作重点]`,
        category: 'preset',
        tags: ['财务', '会计', '报表'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'operation_weekly',
        name: '运营专员周报',
        description: '适合产品运营和内容运营人员',
        content: `运营工作周报：

## 📱 产品运营
- [请填写本周产品运营工作]

## 📝 内容创作
- [请填写内容创作和发布情况]

## 👥 用户运营
- 新增用户：[数量]
- 活跃用户：[数量]
- 用户反馈：[处理情况]

## 📊 数据表现
- [请填写关键运营数据]

## 🎯 下周目标
- [请填写下周运营目标和策略]`,
        category: 'preset',
        tags: ['运营', '产品', '用户'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'customer_service_weekly',
        name: '客服专员周报',
        description: '适合客户服务和技术支持人员',
        content: `客户服务工作周报：

## 📞 服务数据
- 接待客户：[数量]人次
- 处理工单：[数量]个
- 满意度评分：[分数]

## 🔧 问题解决
- [请填写处理的主要客户问题]

## 📋 流程优化
- [请填写服务流程改进建议]

## 💡 客户反馈
- [请填写收集的客户意见和建议]

## 📈 下周改进
- [请填写下周服务改进计划]`,
        category: 'preset',
        tags: ['客服', '支持', '服务'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'data_analyst_weekly',
        name: '数据分析师周报',
        description: '适合数据分析和商业智能人员',
        content: `数据分析工作周报：

## 📊 数据报表
- [请填写本周完成的数据报表]

## 🔍 深度分析
- [请填写进行的专项数据分析]

## 📈 业务洞察
- [请填写发现的业务洞察和建议]

## 🛠️ 工具优化
- [请填写数据工具和流程优化]

## 📋 下周计划
- [请填写下周的分析任务]`,
        category: 'preset',
        tags: ['数据', '分析', 'BI'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'product_manager_weekly',
        name: '产品经理周报',
        description: '适合产品经理和产品策划人员',
        content: `产品管理工作周报：

## 📱 产品进展
- [请填写本周产品开发进展]

## 👥 用户调研
- [请填写用户调研和需求收集]

## 📊 数据分析
- [请填写产品数据分析结果]

## 🎯 需求管理
- 新增需求：[数量]个
- 已完成：[数量]个
- 进行中：[数量]个

## 🚀 下周规划
- [请填写下周产品规划重点]`,
        category: 'preset',
        tags: ['产品', '经理', '策划'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'content_creator_weekly',
        name: '内容创作者周报',
        description: '适合自媒体和内容创作者',
        content: `内容创作周报：

## ✍️ 创作成果
- 文章发布：[数量]篇
- 视频制作：[数量]个
- 总阅读量：[数量]

## 📈 数据表现
- 新增粉丝：[数量]
- 互动率：[百分比]
- 热门内容：[标题]

## 💡 创作思考
- [请填写本周的创作心得和灵感]

## 🎯 选题规划
- [请填写下周的内容选题计划]

## 📊 运营优化
- [请填写账号运营优化策略]`,
        category: 'preset',
        tags: ['创作', '自媒体', '内容'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'teacher_weekly',
        name: '教师周报',
        description: '适合教师和教育工作者',
        content: `教学工作周报：

## 📚 教学任务
- 授课班级：[班级信息]
- 完成课程：[课程内容]
- 作业批改：[批改情况]

## 👨‍🎓 学生管理
- [请填写学生学习情况和管理工作]

## 📝 教研活动
- [请填写参与的教研活动和培训]

## 💡 教学反思
- [请填写教学心得和改进思考]

## 📅 下周安排
- [请填写下周教学计划]`,
        category: 'preset',
        tags: ['教师', '教学', '教育'],
        createdAt: Date.now(),
        useCount: 0
      },
      {
        id: 'legal_weekly',
        name: '法务专员周报',
        description: '适合法务和合规人员',
        content: `法务工作周报：

## ⚖️ 合同审核
- 审核合同：[数量]份
- 修改建议：[主要问题]

## 📋 法律咨询
- [请填写提供的法律咨询服务]

## 🛡️ 风险防控
- [请填写识别的法律风险和防控措施]

## 📚 法规更新
- [请填写关注的法律法规变化]

## 📈 下周重点
- [请填写下周法务工作重点]`,
        category: 'preset',
        tags: ['法务', '合规', '法律'],
        createdAt: Date.now(),
        useCount: 0
      }
    ];
  }

  // 获取所有模板
  static getAllTemplates(): Template[] {
    const customTemplates = this.getCustomTemplates();
    const presetTemplates = this.getPresetTemplates();
    
    // 合并统计数据
    const stats = this.getTemplateStats();
    const allTemplates = [...presetTemplates, ...customTemplates].map(template => ({
      ...template,
      useCount: stats[template.id]?.useCount || template.useCount || 0,
      lastUsed: stats[template.id]?.lastUsed
    }));

    return allTemplates;
  }

  // 获取自定义模板
  static getCustomTemplates(): Template[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading templates from localStorage:', error);
      return [];
    }
  }

  // 保存自定义模板
  static saveCustomTemplate(template: Omit<Template, 'id' | 'category' | 'createdAt' | 'useCount'>): string {
    if (typeof window === 'undefined') return '';

    const newTemplate: Template = {
      ...template,
      id: `custom_${Date.now()}`,
      category: 'custom',
      createdAt: Date.now(),
      useCount: 0
    };

    try {
      const customTemplates = this.getCustomTemplates();
      customTemplates.push(newTemplate);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customTemplates));
      return newTemplate.id;
    } catch (error) {
      console.error('Error saving template:', error);
      return '';
    }
  }

  // 删除自定义模板
  static deleteCustomTemplate(templateId: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const customTemplates = this.getCustomTemplates();
      const filtered = customTemplates.filter(t => t.id !== templateId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }

  // 更新模板使用统计
  static updateTemplateUsage(templateId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const stats = this.getTemplateStats();
      stats[templateId] = {
        useCount: (stats[templateId]?.useCount || 0) + 1,
        lastUsed: Date.now()
      };
      localStorage.setItem(TEMPLATE_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating template stats:', error);
    }
  }

  // 获取模板统计数据
  static getTemplateStats(): { [templateId: string]: { useCount: number; lastUsed: number } } {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem(TEMPLATE_STATS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading template stats:', error);
      return {};
    }
  }

  // 根据ID获取模板
  static getTemplateById(templateId: string): Template | null {
    const allTemplates = this.getAllTemplates();
    return allTemplates.find(t => t.id === templateId) || null;
  }

  // 获取最近使用的模板
  static getRecentlyUsedTemplates(limit = 5): Template[] {
    return this.getAllTemplates()
      .filter(t => t.lastUsed)
      .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0))
      .slice(0, limit);
  }

  // 获取最受欢迎的模板
  static getPopularTemplates(limit = 5): Template[] {
    return this.getAllTemplates()
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit);
  }

  // 清空所有自定义模板
  static clearCustomTemplates(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TEMPLATE_STATS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing templates:', error);
      return false;
    }
  }
}