<template>
  <!-- 主容器布局 -->
  <view class="container">
    <!-- 左侧可拖拽侧边栏 -->
    <view 
      class="left-sidebar"
      :style="{ width: sidebarWidth + '%' }"  
      @mousedown="startResize"  
    ><!-- 动态绑定宽度 --><!-- 拖拽调整宽度事件 -->
      <div class="drag-handle"></div>  <!-- 拖拽手柄 -->
      <!-- 菜单项 -->
      <view class="menu-item">存档</view>
      <view class="menu-item">设置</view>
      <view class="menu-item">图鉴</view>
    </view>

    <!-- 中央剧情展示区 -->
    <view class="main-content">
      <!-- 可滚动剧情容器 -->
      <scroll-view 
        class="story-container"
        scroll-y  
        :scroll-top="scrollTop"  
        @click="handleClickStory"  
      ><!-- 启用垂直滚动 --><!-- 控制滚动位置 --><!-- 点击继续剧情 -->

        <text class="story-text">{{ currentStory }}</text>  <!-- 当前剧情文本 -->
      </scroll-view>

      <!-- 选项按钮容器 -->
      <view class="options-container">
        <!-- 动态生成选项按钮 -->
        <button
          v-for="(option, index) in options"
          :key="index"
          class="option-btn"
          @click="selectOption(index)"  
        ><!-- 选择选项事件 -->
          {{ option.text }}  <!-- 选项显示文本 -->
        </button>
      </view>
    </view>

    <!-- 右侧角色信息面板 -->
    <view class="right-panel">
      <view class="character-card">
        <text class="character-name">{{ character.name }}</text>  <!-- 角色名称 -->
        <view class="attribute">境界：{{ character.level }}</view>  <!-- 角色等级 -->
        <view class="attribute">战力：{{ character.power }}</view>  <!-- 战力数值 -->
        <view class="attribute">灵石：{{ character.money }}</view>  <!-- 货币数量 -->
      </view>
    </view>
  </view>
</template>

<!-- 引入外部脚本 -->
<script src="../../src/index/index.js"></script>
<!-- 引入外部样式 -->
<style src="../../src/index/index.css"></style>
