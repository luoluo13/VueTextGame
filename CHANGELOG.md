# 更新日志

### 2025.04.28

#### 功能更新

- 支持design页面中的节点UI预览剧情
- 新增bug：尝试实现comfyUI的节点连接功能，但使用svg绘图无法满足该需求。至少需要实现动态连接。



### 2025.04.27
#### 功能更新
- 实现节点双击编辑对话框
- 改进故事保存为本地下载功能
- 新增剧情内容编辑字段

#### 已修复问题
- 修复节点拖拽异常事件监听问题

### 2025.04.23

- 在菜单栏中新增了design页面，实现了简易版comfyUI的功能，实现了图形化设计剧情路线的功能。
- 新增bug：在design页面，当鼠标单击”新节点“时，会持续执行mousemove行为，控件持续跟随鼠标，且无法正常结束该行为。但是，在mousemove执行期间，鼠标右键呼出浏览器菜单栏，并单击画布空白处，即可正常使用该功能（鼠标按下拖动控件，抬起结束拖动）。



### 2025.04.17

#### 吐槽

- 没别的意思就是想吐槽一下，新增两个页面，改了一整天全改乱了，然后回档了....
- 原项目不受影响，白干了一天而已。
- 烦人！



### 2025.04.16
#### 功能更新
- 新增剧情节点状态机机制
- 实现无选项时需要手动点击空白处推进剧情的功能
- 增加剧情加载防抖处理（isProcessing状态锁）

#### 已修复问题
- 修复选项选择后剧情自动跳转的问题
- 解决最终节点选项无法隐藏的问题
- 优化剧情加载异常时的错误处理

### 2025.04.07
#### 功能更新
- 实现剧情块滚动条样式优化
- 添加滚动位置自动跟踪功能

#### 已修复问题
- 修复了剧情块右边框遮挡问题）
- 修复了滚动条样式兼容性问题

### 2025.03.27
- 初始化项目基础框架
- 实现基本剧情滚动功能