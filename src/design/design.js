import { Node } from './node-class.js'

export default {
  data() {
    return {
      nodes: [],
      connections: [],
      selectedNode: null,
      linkingOption: null,
      dragOffset: { x: 0, y: 0 }
    }
  },
  methods: {
    addNode() {
      const newNode = new Node({
        x: Math.random() * 500,
        y: Math.random() * 300,
        title: '新节点',
        options: [{ text: '新选项', next: '' }]
      })
      this.nodes.push(newNode)
    },
    startLinking(option, event) {
      this.linkingOption = { 
        node: this.selectedNode, 
        option,
        startPos: { x: event.clientX, y: event.clientY }
      }
    },
    
    // 新增保存逻辑
    saveStory() {
      const storyData = {
        nodes: this.nodes.map(node => node.toJSON())
      }
      // 调用uni-app文件API保存到story.json
      uni.saveFile({
        filePath: './story/story.json',
        data: JSON.stringify(storyData, null, 2),
        success: () => uni.showToast({ title: '保存成功' }),
        fail: (err) => console.error('保存失败:', err)
      });
    },
    
    selectNode(node, event) {  // 增加event参数
      this.selectedNode = node
      this.dragOffset = {
        x: node.x - event.clientX,
        y: node.y - event.clientY
      }
    },
    
    startDrag(event) {
      if (this.selectedNode) {
        document.addEventListener('mousemove', this.onDrag.bind(this))
        document.addEventListener('mouseup', this.endDrag.bind(this))
      }
    },
    
    onDrag(event) {
      if (this.selectedNode) {
        this.selectedNode.x = event.clientX + this.dragOffset.x
        this.selectedNode.y = event.clientY + this.dragOffset.y
      }
    },
    
    endDrag() {
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.endDrag)
      // 新增状态重置
      this.selectedNode = null
      this.dragOffset = { x: 0, y: 0 }
    }
  }
}