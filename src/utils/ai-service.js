/**
 * AI 剧情生成服务 (DeepSeek API)
 */

const API_KEY = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // 请在此处替换您的 API Key
const BASE_URL = 'https://api.deepseek.com/v1/chat/completions';

export const aiService = {
  /**
   * 调用 DeepSeek API 生成剧情
   * @param {Object} character 角色属性
   * @param {Array} history 历史对话记录
   * @returns {Promise<Object>} 返回生成的剧情和选项
   */
  async generateStory(character, history) {
    const systemPrompt = `你是一个文字修仙游戏的主持人。
玩家身份卡：
- 姓名：${character.name}
- 境界：${character.level}
- 战力：${character.power}
- 灵石：${character.money}
- 生命：${character.hp}/${character.maxHp}
- 灵力：${character.spirit}
- 声望：${character.reputation}
- 资质：${character.talent}
- 背景：${character.description}

任务：
1. 根据玩家身份和历史，生成一段200字内的修仙剧情。
2. 给出 2-3 个后续选项。
3. 选项必须包含 'effect' 字段来动态修改玩家数据。你可以修改任何身份卡中的数值属性（power, money, hp, spirit, reputation）。
4. 如果玩家生命(hp)归零，请在剧情中宣布死亡并给出“重生”相关的特殊选项。
5. 你也可以在剧情中提到玩家的资质(talent)或背景，增加沉浸感。

请务必以 JSON 格式返回：
{
  "story": "剧情描述文字",
  "options": [
    {
      "text": "选项文字",
      "outcome": "结果描述",
      "effect": { "hp": -10, "spirit": 5, "power": 2 }
    }
  ]
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history
    ];

    try {
      const response = await uni.request({
        url: BASE_URL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        data: {
          model: 'deepseek-chat',
          messages: messages,
          response_format: { type: 'json_object' }
        }
      });

      if (response.statusCode === 200) {
        const content = response.data.choices[0].message.content;
        return JSON.parse(content);
      } else {
        console.error('API Request Failed:', response);
        throw new Error('AI 服务响应异常');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
};
