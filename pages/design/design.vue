<template>
  <view class="editor-container">
    <!-- 画布区域 -->
    <svg class="canvas" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag">
      <!-- 连接线 -->
      <path v-for="(conn, i) in connections" :key="i" 
            :d="conn.path" 
            class="connection"
            :class="{ selected: conn.selected }"/>
    </svg>
    
    <!-- 节点元素 -->
    <div v-for="node in nodes" 
         :key="node.id"
         class="node"
         :style="{ left: node.x + 'px', top: node.y + 'px' }"
         @mousedown.stop="selectNode(node, $event)"
         @dblclick.stop="handleDoubleClick(node, $event)"> <!-- 新增双击事件 -->
      <div class="node-header">{{ node.title }}</div>
      <div class="node-content">
        <div class="content-preview">
            {{ node.content ? 
               node.content.split('\n').slice(0,2).join('\n').substring(0,50) + 
               (node.content.length > 50 || node.content.split('\n').length > 2 ? '...' : '') 
             : '无剧情' }}
        </div>
      <!-- 在node-content之后添加 -->
      <div class="node-ports">
          <div class="port input" @mouseup="handleInputDrop(node, $event)"></div>
          <div class="port output" @mousedown.stop="startOutputDrag(node, $event)"></div>
      </div>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <button @click="addNode">+ 添加节点</button>
      <button @click="saveStory">💾 保存</button>
    </div>
  </view>
  <div v-if="editDialogVisible" class="dialog-mask">
    <div class="dialog-container">
        <h3>节点编辑</h3>
        <div class="form-item">
            <label>节点名称：</label>
            <input v-model="editTitle" type="text">
        </div>
        <div class="form-item">
            <label>剧情内容：</label>
            <textarea v-model="editContent" rows="5"></textarea>
        </div>
        <div class="dialog-buttons">
            <button @click="handleConfirm">确认</button>
            <button @click="handleCancel">取消</button>
        </div>
    </div>
</div>
</template>

<script src="../../src/design/design.js"></script>
<style src="../../src/design/design.css"></style>
