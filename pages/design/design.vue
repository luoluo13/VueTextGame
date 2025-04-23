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
         @mousedown.stop="selectNode(node, $event)">
      <div class="node-header">{{ node.title }}</div>
      <div class="node-content">
        <div v-for="(opt, i) in node.options" 
             :key="i"
             class="option-handle"
             @mousedown.stop="startLinking(opt, $event)">
          {{ opt.text }}
        </div>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <button @click="addNode">+ 添加节点</button>
      <button @click="saveStory">💾 保存</button>
    </div>
  </view>
</template>

<script src="../../src/design/design.js"></script>
<style src="../../src/design/design.css"></style>