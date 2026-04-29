import characterData from '../../Character_attributes/attributes.js';
import { aiService } from '../utils/ai-service.js';

export default {
  // 组件数据定义
  data() {
    return {
      rightSidebarWidth: 20, // 右侧边栏初始宽度百分比
      sidebarWidth: 20,    // 侧边栏初始宽度百分比
      scrollTop: 0,        // 滚动容器当前位置
      currentStory: '',    // 当前剧情文本内容
      options: [],         // 当前可选项数组
      character: characterData, // 从外部导入的角色数据
      chatHistory: [],     // AI 对话历史记录
      isProcessing: false,   // 加载状态锁
      showSettings: false,   // 是否显示设置弹窗
      tempCharacter: {},     // 临时存储设置中的角色数据
    }
  },
  
  // 页面加载生命周期钩子
  async onLoad() {
    // 优先尝试读取存档
    const hasSave = this.loadGame(true);
    if (!hasSave) {
      await this.loadStoryData(); // 初始化加载剧情数据
    }
  },

  // 组件方法定义
  methods: {
    /**
     * 调用 AI 加载剧情数据
     */
    async loadStoryData() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      
      try {
        const result = await aiService.generateStory(this.character, this.chatHistory);
        
        // 更新剧情文本
        const separator = this.currentStory ? '\n\n' : '';
        this.currentStory += separator + result.story;
        
        // 更新选项
        this.options = result.options || [];
        
        // 将 AI 回复加入历史记录
        this.chatHistory.push({
          role: 'assistant',
          content: JSON.stringify(result)
        });

        this.scrollToBottom();
      } catch (error) {
        uni.showToast({
          title: '剧情生成失败，请检查 API 配置',
          icon: 'none'
        });
      } finally {
        this.isProcessing = false;
      }
    },

    /**
     * 自动滚动到底部
     */
    scrollToBottom() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.story-container').boundingClientRect();
        query.select('.story-text').boundingClientRect();
        query.exec(res => {
          if (res[0] && res[1]) {
            const scrollHeight = res[1].height - res[0].height;
            if (scrollHeight > 0) {
              this.scrollTop = scrollHeight + 100; // 增加缓冲确保滚到底
            }
          }
        });
      });
    },

    /**
     * 存档功能
     */
    saveGame() {
      const saveData = {
        currentStory: this.currentStory,
        options: this.options,
        character: this.character,
        chatHistory: this.chatHistory,
        saveTime: new Date().toLocaleString()
      };
      uni.setStorageSync('game_save', saveData);
      uni.showToast({ title: '存档成功', icon: 'success' });
    },

    /**
     * 读档功能
     * @param {boolean} silent - 是否静默加载（不弹出提示）
     */
    loadGame(silent = false) {
      const saveData = uni.getStorageSync('game_save');
      if (saveData) {
        this.currentStory = saveData.currentStory;
        this.options = saveData.options;
        this.character = saveData.character;
        this.chatHistory = saveData.chatHistory;
        if (!silent) uni.showToast({ title: '读档成功', icon: 'success' });
        this.scrollToBottom();
        return true;
      } else {
        if (!silent) uni.showToast({ title: '未发现存档', icon: 'none' });
        return false;
      }
    },

    /**
     * 打开设置
     */
    openSettings() {
      this.tempCharacter = JSON.parse(JSON.stringify(this.character));
      this.showSettings = true;
    },

    /**
     * 关闭设置
     */
    closeSettings() {
      this.showSettings = false;
    },

    /**
     * 确认设置修改
     */
    confirmSettings() {
      this.character = JSON.parse(JSON.stringify(this.tempCharacter));
      this.showSettings = false;
      uni.showToast({ title: '身份卡已更新', icon: 'success' });
      // 如果剧情为空，更新身份卡后自动触发一次生成
      if (!this.currentStory) {
        this.loadStoryData();
      }
    },

    // 点击剧情区域处理
    handleClickStory() {
      // AI 模式下，点击不再自动加载，必须通过选项驱动
    },

    // 开始调整侧边栏宽度
    startResize(e) {
      const startX = e.clientX;       // 记录初始X坐标
      const initialWidth = this.sidebarWidth; // 记录初始宽度

      const handleMove = (moveEvent) => {
        // 计算宽度变化量（转换为百分比）
        const delta = (moveEvent.clientX - startX) / window.innerWidth * 100;
        // 限制宽度范围在15%-30%之间
        this.sidebarWidth = Math.min(Math.max(10, initialWidth + delta), 30);
      }

      const handleUp = () => {
        // 移除事件监听
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      }

      // 注册鼠标事件
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },  
    
    startResizeRight(e) {
      const startX = e.clientX;
      const startWidth = this.rightSidebarWidth;
      
      const doDrag = (e) => {
        const delta = (startX - e.clientX) / window.innerWidth * 100;  // 反向计算
        this.rightSidebarWidth = Math.min(Math.max(startWidth + delta, 10), 30);
      };
  
      const stopDrag = () => {
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
      };
  
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
    },

    /**
     * 选择剧情选项
     * @param {number} index - 选项索引
     */
    async selectOption(index) {
      if (this.isProcessing) return;

      const option = this.options[index];
      
      // 1. 显示玩家的选择结果
      this.currentStory += '\n\n> ' + option.text + '\n\n' + option.outcome;
      this.scrollToBottom();

      // 2. 应用选项效果到角色属性
      if (option.effect) {
        Object.entries(option.effect).forEach(([key, value]) => {
          if (this.character[key] !== undefined) {
            if (typeof this.character[key] === 'number') {
              this.character[key] += value;
              // 限制 HP 不超过上限
              if (key === 'hp' && this.character.maxHp) {
                this.character.hp = Math.min(this.character.hp, this.character.maxHp);
              }
            } else {
              // 处理非数值属性（如 level 的变动，虽然 AI 目前主要改数值）
              this.character[key] = value;
            }
          }
        });
      }

      // 3. 将玩家选择加入历史记录
      this.chatHistory.push({
        role: 'user',
        content: `我选择了：${option.text}。后果是：${option.outcome}。请继续生成后续剧情。`
      });

      // 4. 清空当前选项并加载新剧情
      this.options = []; 
      await this.loadStoryData();
    }
   }
}