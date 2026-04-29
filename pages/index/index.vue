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
      <view class="menu-item" @click="saveGame">存档</view>
      <view class="menu-item" @click="loadGame">读档</view>
      <view class="menu-item" @click="openSettings">设置</view>
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
    <view 
      class="right-sidebar" 
      :style="{ width: rightSidebarWidth + '%' }"
      @mousedown="startResizeRight"
    ><!-- 动态绑定宽度 --><!-- 拖拽调整宽度事件 -->
    <div class="drag-handle right-handle"></div>  <!-- 添加右侧手柄样式 -->      
    <view class="character-card">
        <text class="character-name">{{ character.name }}</text>
        <view class="attribute">境界：{{ character.level }}</view>
        <view class="attribute">战力：{{ character.power }}</view>
        <view class="attribute">灵石：{{ character.money }}</view>
        <view class="attribute">生命：{{ character.hp }}/{{ character.maxHp }}</view>
        <view class="attribute">灵力：{{ character.spirit }}</view>
        <view class="attribute">声望：{{ character.reputation }}</view>
        <view class="attribute">资质：{{ character.talent }}</view>
        <view class="description-text">{{ character.description }}</view>
      </view>
    </view>

    <!-- 设置弹窗 -->
    <view v-if="showSettings" class="modal-mask">
      <view class="modal-content">
        <view class="modal-header">身份卡设定</view>
        <view class="modal-body">
          <view class="form-item">
            <text>姓名：</text>
            <input v-model="tempCharacter.name" placeholder="请输入姓名" />
          </view>
          <view class="form-item">
            <text>境界：</text>
            <input v-model="tempCharacter.level" placeholder="请输入境界" />
          </view>
          <view class="form-item">
            <text>描述：</text>
            <textarea v-model="tempCharacter.description" placeholder="请输入身份背景描述" />
          </view>
        </view>
        <view class="modal-footer">
          <button @click="closeSettings">取消</button>
          <button @click="confirmSettings" class="primary">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<!-- 引入外部脚本 -->
<script src="../../src/index/index.js"></script>
<!-- 引入外部样式 -->
<style src="../../src/index/index.css"></style>
