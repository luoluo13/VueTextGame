import { Node } from './node-class.js'

export default {
    data() {
        return {
            nodes: [],
            connections: [],
            selectedNode: null,
            linkingOption: null,
            dragOffset: { x: 0, y: 0 },
            isDragging: false // 新增拖拽状态标记
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
        
        selectNode(node, event) {
            // 仅在鼠标左键按下时开始拖拽
            if (event.button === 0) {
                this.selectedNode = node
                this.dragOffset = {
                    x: node.x - event.clientX,
                    y: node.y - event.clientY
                }
                this.isDragging = true; // 标记开始拖拽
                window.addEventListener('mousemove', this.onDrag);
                window.addEventListener('mouseup', this.endDrag);
            }
        },
        
        startDrag(event) {
            // 该方法可能不需要，可考虑移除
        },
        
        onDrag(event) {
            if (this.selectedNode && this.isDragging) {
                this.selectedNode.x = event.clientX + this.dragOffset.x;
                this.selectedNode.y = event.clientY + this.dragOffset.y;
            }
        },
        
        endDrag() {
            this.isDragging = false; // 清除拖拽状态
            this.selectedNode = null; // 取消选中节点
            window.removeEventListener('mousemove', this.onDrag);
            window.removeEventListener('mouseup', this.endDrag);
            // 额外重置：清除连线状态（如有）
            this.linkingOption = null;
        }
    }
}
