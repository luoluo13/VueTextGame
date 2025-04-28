export class Node {
  static idCounter = 0

  constructor({ x = 0, y = 0, title = '新节点', options = [] }) {
    this.id = Node.idCounter++
    this.x = x
    this.y = y
    this.title = title
    this.options = options.map(opt => ({ ...opt, id: crypto.randomUUID() }))
    // 新增连接点坐标
    this.ports = {
      input: { x: 8, y: 84 },   // 左下角坐标
      output: { x: 184, y: 84 } // 右下角坐标（基于200px宽度）
    }
  }

  // 序列化为JSON格式
  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      title: this.title,
      options: this.options,
      ports: this.ports // 新增端口信息
    }
  }
}