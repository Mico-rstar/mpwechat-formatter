# Style Selection Examples

This file contains complete style selection examples for all article types. Use these as templates when recommending styles to users.

## Article Type Selection

```
Question: "请选择您的文章类型："
Options:
- "通用文章" (description: "日常文章、观点分享、生活随笔")
- "技术文章" (description: "编程教程、技术分析、开发经验")
- "商业财经" (description: "行业分析、商业评论、财经报道")
- "深度长文" (description: "深度报道、长篇分析、专题文章")
- "新闻资讯" (description: "新闻、资讯、时事评论")
- "极简风格" (description: "追求简洁、极简美学设计")
- "自定义风格" (description: "描述您想要的风格特点，或提供自定义配置")
```

## Style Recommendations by Article Type

### 通用文章 (Generic Articles)

```
Question: "请选择通用类文章风格："
Options:
- "默认公众号" (wechat-default) - 经典微信公众号风格
- "优雅简约" (wechat-elegant) - 简洁优雅
- "Claude官方" (wechat-anthropic) - Claude品牌风格
- "自定义风格" (custom) - 描述您想要的风格
```

### 技术文章 (Technical Articles)

```
Question: "请选择技术类文章风格："
Options:
- "技术风格" (wechat-tech) - 专为技术文章设计
- "Claude官方" (wechat-anthropic) - 适合技术分享
- "Apple极简" (wechat-apple) - 简洁技术文档风格
- "自定义风格" (custom) - 描述您想要的风格
```

### 商业财经 (Business & Finance)

```
Question: "请选择商业财经类文章风格："
Options:
- "金融时报" (wechat-ft) - Financial Times风格
- "Nikkei日经" (nikkei) - 日经新闻风格
- "晚点风格" (latepost-depth) - 深度商业报道
- "自定义风格" (custom) - 描述您想要的风格
```

### 深度长文 (Deep Dive Articles)

```
Question: "请选择深度长文类文章风格："
Options:
- "晚点风格" (latepost-depth) - 深度报道专用
- "Medium长文" (wechat-medium) - Medium阅读体验
- "深度阅读" (wechat-deepread) - 优化长文阅读
- "自定义风格" (custom) - 描述您想要的风格
```

### 新闻资讯 (News & Current Events)

```
Question: "请选择新闻资讯类文章风格："
Options:
- "纽约时报" (wechat-nyt) - NYT新闻风格
- "Guardian卫报" (guardian) - 卫报风格
- "Le Monde世界报" (lemonde) - 世界报风格
- "自定义风格" (custom) - 描述您想要的风格
```

### 极简风格 (Minimalist Design)

```
Question: "请选择极简类文章风格："
Options:
- "Jony Ive" (wechat-jonyive) - 极简设计大师
- "Apple极简" (wechat-apple) - Apple官方风格
- "原研哉·空" (kenya-emptiness) - 日式极简
- "自定义风格" (custom) - 描述您想要的风格
```

## Custom Style Handling

When user chooses "自定义风格":

1. Allow user to describe desired style characteristics
2. Examples: "配色温馨柔和，标题用圆角边框，背景浅粉色"
3. Read `references/custom-style-guide.md` for generation guidelines
4. Create custom style JSON file following WeChat constraints

## Pattern for New Article Types

When adding new article type categories, follow this pattern:

```
Question: "请选择[XX]类文章风格："
Options:
- "[Style 1 Name]" (style-key) - Brief description
- "[Style 2 Name]" (style-key) - Brief description
- "[Style 3 Name]" (style-key) - Brief description
- "自定义风格" (custom) - 描述您想要的风格
```

Always include "自定义风格" as the last option to allow user customization.
