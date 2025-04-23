export class Node {
  static idCounter = 0

  constructor({ x = 0, y = 0, title = '新节点', options = [] }) {
    this.id = Node.idCounter++
    this.x = x
    this.y = y
    this.title = title
    this.options = options.map(opt => ({ ...opt, id: crypto.randomUUID() }))
  }

  // 序列化为JSON格式
  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      title: this.title,
      options: this.options
    }
  }
}