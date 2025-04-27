import { Node } from './node-class.js'

export default {
    data() {
        return {
            nodes: [],
            connections: [],
            selectedNode: null,
            linkingOption: null,
            dragOffset: { x: 0, y: 0 },
            isDragging: false,
            // 新增对话框相关数据
            editDialogVisible: false,
            editNode: null,
            editTitle: '',
            editContent: ''
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
            };
            
            // 创建Blob并触发下载
            const blob = new Blob([JSON.stringify(storyData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // 创建隐藏的下载链接
            const link = document.createElement('a');
            link.href = url;
            link.download = 'story.json';
            document.body.appendChild(link);
            link.click();
            
            // 清理资源
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // 替换原来的uni-app提示
            alert('故事文件已下载');
        },
        
        // 修改后的双击处理方法
        handleDoubleClick(node) {
            this.editNode = node;
            this.editTitle = node.title;
            this.editContent = node.content || ''; // 新增剧情内容字段
            this.editDialogVisible = true;
        },
        
        // 新增对话框确认方法
        handleConfirm() {
            if (this.editNode) {
                this.editNode.title = this.editTitle;
                this.editNode.content = this.editContent;
                this.editDialogVisible = false;
            }
        },
        
        // 新增对话框取消方法
        handleCancel() {
            this.editDialogVisible = false;
        },
        
        // 修改现有节点模板事件绑定
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
