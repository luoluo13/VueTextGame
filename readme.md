# VueTextGame-AI

一款基于 Vue 和 DeepSeek API 的动态 AI 剧情文字游戏。

## 核心特性

- **AI 动态剧情生成**：接入 DeepSeek API，根据玩家身份和历史记录实时生成独一无二的修仙剧情。
- **深度身份卡系统**：包含姓名、境界、战力、灵石、生命、灵力、声望、资质及背景描述。
- **动态属性修改**：AI 会根据剧情选择实时修改玩家的各项属性，实现数值与剧情的深度联动。
- **存档/读档系统**：支持本地存档，随时保存你的修仙进度。
- **可视化界面**：支持侧边栏宽度拖拽调整，沉浸式阅读体验。
- **实时设置**：支持在游戏内直接修改身份卡背景设定。

## 快速开始

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **配置 API Key**：
   在 `src/utils/ai-service.js` 中填入你的 DeepSeek API Key：
   ```javascript
   const API_KEY = '你的API_KEY';
   ```

3. **运行项目**：
   使用 HBuilderX 或 Vue CLI 运行至浏览器。

## 目录结构

- `pages/index/`：主游戏页面
- `src/utils/ai-service.js`：AI 通信核心服务
- `Character_attributes/`：角色初始属性配置
- `src/index/`：页面逻辑与样式

## 开源协议

本项目基于 [MIT](https://zh.wikipedia.org/wiki/MIT許可證) 协议开源。

项目详细变更记录请查看 [CHANGELOG.md](./CHANGELOG.md)
