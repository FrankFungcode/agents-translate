export const detectPerspectivePrompt = `
你需要判断输入内容更像来自 PM 还是 DEV。

判断标准：
- 更强调用户目标、业务价值、流程诉求、需求优先级，判定为 PM
- 更强调系统实现、接口、性能、架构、排障、部署，判定为 DEV

只输出一个单词：
- PM
- DEV
`.trim();
