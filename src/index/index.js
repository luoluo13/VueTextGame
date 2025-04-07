import characterData from '../../Character_attributes/attributes.js';

export default {
  // 组件数据定义
  data() {
    return {
      rightSidebarWidth: 20, // 右侧边栏初始宽度百分比
      sidebarWidth: 20,    // 侧边栏初始宽度百分比
      scrollTop: 0,        // 滚动容器当前位置
      currentStory: '',    // 当前剧情文本内容
      options: [],         // 当前可选项数组
      character: characterData // 从外部导入的角色数据
    }
  },
  
  // 页面加载生命周期钩子
  async onLoad() {
    await this.loadStoryData(); // 初始化加载剧情数据
  },

  // 组件方法定义
  methods: {
    /**
     * 加载剧情数据
     * @param {string} node - 剧情节点标识（默认'start'）
     */
    async loadStoryData(node = 'start') {
      const res = await uni.request({
        url: '/story/story.json', // 剧情数据接口地址
        method: 'GET'
      });
      const currentData = res.data[node];
      this.currentStory = currentData.text;  // 更新当前剧情文本
      this.options = currentData.options || []; // 更新选项数组
    },

    // 点击剧情区域处理
    handleClickStory() {
      // 当没有选项时自动加载默认节点
      if (this.options.length === 0) {
        this.loadStoryData('next_default_node');
      }
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
    },  startResizeRight(e) {
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
    selectOption(index) {
      const option = this.options[index];
      this.currentStory += '\n\n' + option.outcome; // 追加选项结果到剧情

      // 自动滚动到底部
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.story-container').boundingClientRect();
        query.select('.story-text').boundingClientRect();
        query.exec(res => {
          // 计算可滚动高度差
          const scrollHeight = res[1].height - res[0].height;
          // 当差值大于0时更新滚动位置
          if (scrollHeight > 0) {
            this.scrollTop = scrollHeight + 20; // 添加20px缓冲
          }
        });
      });

      // 应用选项效果到角色属性
      if (option.effects) {
        Object.entries(option.effects).forEach(([key, value]) => {
          this.character[key] = String(Number(this.character[key]) + value);
        });
      }

      // 加载后续剧情节点
      if (option.next) {
        this.loadStoryData(option.next);
      }
    }
  }
}