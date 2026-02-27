---
name: mpwechat-formatter
description: "Transform concise viewpoint documents into beautifully formatted WeChat official account articles. Supports language polishing, Markdown formatting, 18 style themes, custom styles, and generates WeChat editor-compatible rich text. Use when: 1) User needs to polish and format a concise viewpoint document, 2) User needs rich text ready to paste into WeChat official account editor, 3) User needs multiple professional style theme options."
---

# WeChat Official Account Article Formatter

Transform concise viewpoint documents into beautifully formatted WeChat articles with language polishing, Markdown optimization, and styled HTML output.

## Quick Start

1. **Check ambiguities** - Use `AskUserQuestion` to identify unclear points, get user clarification
2. **Polish content** - Read `references/polish-guidelines.md`, apply polish rules
3. **Optimize Markdown** - Read `references/formatters.md`, improve structure
4. **Confirm Markdown** - Use `AskUserQuestion` to verify user satisfaction (loop until satisfied)
5. **Select style** - Ask article type, then use `AskUserQuestion` to let user choose from recommended styles or describe custom style
6. **Generate HTML** - Run `scripts/generate-html.js` with selected style, then automatically open in browser (supports custom style via JSON file)
7. **Confirm HTML** - Use `AskUserQuestion` to verify satisfaction (loop back to Step 3 or 5 if needed)
8. **Deliver** - User copies from opened browser to WeChat editor

## Workflow

### Step 1: Check for Ambiguities

Before polishing, use the comprehensive checklist to identify all ambiguities and missing information.

**Read**: `references/polish-guidelines.md` - Section "文章层面歧义检查清单" (Article-Level Ambiguity Checklist)

**Comprehensive checklist includes**:

1. **标题检查** (Title Check) - Does the article have a title? If not, offer suggestions
2. **语言风格** (Language Style) - Formal/professional, casual/popular, conversational, or custom
3. **目标读者** (Target Audience) - General public, industry practitioners, technical, decision-makers, or custom
4. **文章长度期望** (Length Expectation) - Keep concise, medium length, deep dive, or natural
5. **配图需求** (Image Requirements) - Need image suggestions, no images, or images prepared
6. **数据来源标注** (Data Source Attribution) - Whether to cite data sources
7. **情感倾向** (Emotional Tone) - Objective neutral, supportive, critical, or balanced
8. **专业术语处理** (Technical Terminology) - Keep as-is, explain on first use, or simplify
9. **结尾行动号召** (Call-to-Action) - Add CTA, custom CTA, or no CTA
10. **时效性标注** (Time Sensitivity) - Whether to add time-based annotations

**Content ambiguities to check**:
- Vague statements: "这个产品很好" (Which product? What aspect?)
- Missing context: "这很重要" (What is important? To whom?)
- Data gaps: "用户增长了很多" (From what to what? Timeframe?)

**Use `AskUserQuestion` tool** for confirmations, max 4 options per question. Prioritize most important ambiguities first.

**Example workflow**:

**Check 1: Title**
```
Question: "注意到您没有提供文章标题。请选择标题方式："
Options:
- "生成选项" (description: "根据内容提供3个标题建议供选择")
- "自定义标题" (description: "您自己提供文章标题")
- "无需标题" (description: "文章不需要标题，直接开始正文")
- "跳过" (description: "暂时跳过，稍后处理")
```

**Check 2: Language Style**
```
Question: "请选择文章的语言风格："
Options:
- "正式专业" (description: "适合学术、行业分析、技术文档")
- "轻松通俗" (description: "适合科普、生活分享、大众阅读")
- "亲切口语" (description: "适合个人观点、随笔、情感表达")
- "自定义风格" (description: "描述您想要的语言风格特点")
```

**Check 3: Target Audience**
```
Question: "请选择文章的目标读者："
Options:
- "普通大众" (description: "非专业人士，需要通俗易懂，避免术语")
- "行业从业者" (description: "有行业背景，可以使用专业术语")
- "技术人员" (description: "技术背景，可以深入技术细节")
- "决策者/管理者" (description: "关注商业价值、ROI、战略意义")
```

**Wait** for user response before continuing. Collect all necessary information through multiple rounds if needed.

### Step 2: Polish Content

Improve language quality without changing original meaning.

**Read**: `references/polish-guidelines.md` - Sections "润色原则" (Polish Principles) and "好的 vs 坏的润色对比" (Good vs Bad Polish Comparison)

**Apply**:
- Improve vocabulary (很好→优秀, 很多→大量)
- Expand short paragraphs (< 50 characters) from different angles (reason, impact, examples)
- Add transition sentences (此外, 然而, 因此)
- Vary sentence structure (mix short and long sentences)

**Constraints**:
- Do NOT add information not mentioned by user
- Do NOT change user's core viewpoints
- Do NOT fabricate data or examples
- Follow user's language (Chinese input → Chinese polish, English input → English polish)

### Step 3: Optimize Markdown Structure

Improve Markdown structure for better readability.

**Read**: `references/formatters.md` - All sections

**Apply**:
- Limit headings to 3 levels (h1, h2, h3)
- Convert single-item lists to paragraphs
- Limit list nesting to 2 levels
- Add spacing every 300-500 characters
- Split long paragraphs (> 150 characters)

### Step 4: Confirm Markdown with User (Loop until satisfied)

After polishing and formatting, use `AskUserQuestion` to verify user satisfaction.

**Display polished Markdown content to user**.

**Use `AskUserQuestion` tool**:

```
Question: "请查看上述润色后的 Markdown 内容，您是否满意？"
Options:
- "满意" (description: "内容符合预期，继续选择风格")
- "需要改进" (description: "提供修改意见，我会重新润色和排版")
```

**If user chooses "需要改进"**:
- Collect specific feedback
- Re-polish and re-format based on user's suggestions
- **Display updated content again**
- **Ask again using `AskUserQuestion`** - Loop until user selects "满意"

**If user chooses "满意"**:
- Proceed to Step 5

### Step 5: Select Style Theme

Due to `AskUserQuestion` tool limitation (max 4 options), use a two-step approach:

#### Step 5a: Ask Article Type

**Use `AskUserQuestion` tool**:

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

#### Step 5b: Recommend Styles Based on Article Type

**For "通用文章"**, use `AskUserQuestion`:

```
Question: "请选择通用类文章风格："
Options:
- "默认公众号" (wechat-default) - 经典微信公众号风格
- "优雅简约" (wechat-elegant) - 简洁优雅
- "Claude官方" (wechat-anthropic) - Claude品牌风格
- "自定义风格" (custom) - 描述您想要的风格
```

**For "技术文章"**, use `AskUserQuestion`:

```
Question: "请选择技术类文章风格："
Options:
- "技术风格" (wechat-tech) - 专为技术文章设计
- "Claude官方" (wechat-anthropic) - 适合技术分享
- "Apple极简" (wechat-apple) - 简洁技术文档风格
- "自定义风格" (custom) - 描述您想要的风格
```

**For "商业财经"**, use `AskUserQuestion`:

```
Question: "请选择商业财经类文章风格："
Options:
- "金融时报" (wechat-ft) - Financial Times风格
- "Nikkei日经" (nikkei) - 日经新闻风格
- "晚点风格" (latepost-depth) - 深度商业报道
- "自定义风格" (custom) - 描述您想要的风格
```

**For "深度长文"**, use `AskUserQuestion`:

```
Question: "请选择深度长文类文章风格："
Options:
- "晚点风格" (latepost-depth) - 深度报道专用
- "Medium长文" (wechat-medium) - Medium阅读体验
- "深度阅读" (wechat-deepread) - 优化长文阅读
- "自定义风格" (custom) - 描述您想要的风格
```

**For "新闻资讯"**, use `AskUserQuestion`:

```
Question: "请选择新闻资讯类文章风格："
Options:
- "纽约时报" (wechat-nyt) - NYT新闻风格
- "Guardian卫报" (guardian) - 卫报风格
- "Le Monde世界报" (lemonde) - 世界报风格
- "自定义风格" (custom) - 描述您想要的风格
```

**For "极简风格"**, use `AskUserQuestion`:

```
Question: "请选择极简类文章风格："
Options:
- "Jony Ive" (wechat-jonyive) - 极简设计大师
- "Apple极简" (wechat-apple) - Apple官方风格
- "原研哉·空" (kenya-emptiness) - 日式极简
- "自定义风格" (custom) - 描述您想要的风格
```

**If user chooses "自定义风格"**:
- Allow user to describe desired style characteristics
- Examples: "配色温馨柔和，标题用圆角边框，背景浅粉色"
- **Read `references/custom-style-guide.md` for generation guidelines**
- **Create custom style JSON file** following WeChat constraints:
  - ✅ Container max-width ≤ 740px (CRITICAL)
  - ✅ Padding ≤ 20px (left/right)
  - ✅ Font-size 16-17px for body text
  - ✅ Line-height 1.75-1.85 for readability
  - ✅ Use !important for critical styles
  - ✅ Add word-wrap: break-word
- Save to working directory as `custom-style.json`
- Use `--custom-style custom-style.json` parameter when generating HTML

**Custom style generation checklist**:
- [ ] Container width ≤ 740px
- [ ] Left/right padding ≤ 20px
- [ ] Body font-size 16-17px
- [ ] Line-height 1.75-1.85
- [ ] Critical styles use !important
- [ ] Images have max-width: 100%
- [ ] word-wrap: break-word included

**Custom style JSON template** (with WeChat constraints):
```json
{
  "name": "用户自定义风格",
  "styles": {
    "container": "max-width: 740px; margin: 0 auto; padding: 10px 12px 20px 12px; font-family: -apple-system, sans-serif; font-size: 16px; line-height: 1.8 !important; color: #3f3f3f !important; background-color: #fff !important; word-wrap: break-word;",
    "h1": "font-size: 24px; font-weight: 600; color: #2c3e50 !important; line-height: 1.4 !important; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #3498db;",
    "h2": "font-size: 22px; font-weight: 600; color: #2c3e50 !important; line-height: 1.4 !important; margin: 28px 0 14px; padding-left: 12px; border-left: 4px solid #3498db;",
    "h3": "font-size: 20px; font-weight: 600; color: #34495e !important; line-height: 1.4 !important; margin: 24px 0 12px;",
    "p": "margin: 16px 0 !important; line-height: 1.8 !important; color: #3f3f3f !important;",
    "strong": "font-weight: 600; color: #2c3e50 !important;",
    "em": "font-style: italic; color: #555 !important;",
    "a": "color: #3498db !important; text-decoration: none; border-bottom: 1px solid #3498db;",
    "ul": "margin: 16px 0; padding-left: 24px;",
    "ol": "margin: 16px 0; padding-left: 24px;",
    "li": "margin: 8px 0; line-height: 1.8 !important;",
    "blockquote": "margin: 16px 0; padding: 8px 16px; background-color: #fafafa !important; border-left: 3px solid #999; color: #666 !important; line-height: 1.5 !important;",
    "code": "font-family: Consolas, Monaco, \"Courier New\", monospace; font-size: 14px; padding: 2px 6px; background-color: #f5f5f5 !important; color: #e74c3c !important; border-radius: 3px;",
    "pre": "margin: 20px 0; padding: 16px; background-color: #2d2d2d !important; border-radius: 8px; overflow-x: auto; line-height: 1.6 !important;",
    "hr": "margin: 32px 0; border: none; border-top: 1px solid #e0e0e0;",
    "img": "max-width: 100%; max-height: 600px !important; height: auto; display: block; margin: 20px auto; border-radius: 8px;",
    "table": "width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 15px;",
    "th": "background-color: #f0f0f0 !important; padding: 10px; text-align: left; border: 1px solid #e0e0e0; font-weight: 600;",
    "td": "padding: 10px; border: 1px solid #e0e0e0;",
    "tr": "border-bottom: 1px solid #e0e0e0;"
  }
}
```

### Step 6: Generate HTML

Convert Markdown to styled HTML using the script.

**Run**: `scripts/generate-html.js`

**Usage with predefined style**:
```bash
node scripts/generate-html.js "markdown content" --style <selected-style>
```

**Usage with custom style**:
```bash
node scripts/generate-html.js "markdown content" --custom-style custom-style.json
```

**Save output to file**:
```bash
node scripts/generate-html.js "$(cat article.md)" --style wechat-default > article.html
```

**Output**: Complete HTML file with inline styles, saved to working directory.

**IMPORTANT**: After generating the HTML file, automatically open it in the browser:
```bash
# Windows
start article.html

# macOS
open article.html

# Linux
xdg-open article.html
```

This ensures the user can immediately preview the formatted article without manual browser navigation.

### Step 7: Confirm HTML with User (Loop until satisfied)

After generating HTML, automatically open it in the browser (see Step 6), then use `AskUserQuestion` to verify user satisfaction.

**The HTML file is automatically opened for preview** - the user should see the formatted article in their browser immediately.

**Use `AskUserQuestion` tool**:

```
Question: "请预览生成的 HTML 文章，您是否满意？"
Options:
- "满意" (description: "排版和风格都符合预期，可以复制到公众号")
- "修改内容或排版" (description: "不满意文章内容或排版，返回修改")
- "更换风格" (description: "内容满意但风格不合适，重新选择风格")
```

**If user chooses "满意"**:
- Proceed to Step 8

**If user chooses "修改内容或排版"**:
- Collect specific feedback
- **Loop back to Step 3** (Optimize Markdown structure)
- Apply changes to content/structure
- Re-polish if needed
- Re-generate HTML with same style
- Return to Step 7 for confirmation

**If user chooses "更换风格"**:
- Collect style preferences
- **Loop back to Step 5** (Select style theme)
- Let user choose different style
- Re-generate HTML with new style
- Return to Step 7 for confirmation

### Step 8: Deliver to User

After user confirms satisfaction, provide final instructions.

**Example message**:
```
✅ 文章已完成！HTML 文件已在浏览器中自动打开。

请按照以下步骤复制到微信公众号编辑器：

1. 在已打开的浏览器中，全选内容（Ctrl+A / Cmd+A）
2. 复制（Ctrl+C / Cmd+C）
3. 粘贴到微信公众号编辑器

文章格式已保留，可以直接发布。

如果浏览器未自动打开，请手动打开：{filename}
```

## References

Load these files as needed during workflow:

### `references/polish-guidelines.md`
- **When**: Step 1 (ambiguity check) and Step 2 (polishing)
- **Content**: Detailed ambiguity rules, polish principles, good vs bad examples

### `references/formatters.md`
- **When**: Step 3 (formatting)
- **Content**: Heading rules, list optimization, spacing rules

### `references/wechat-syntax.md`
- **When**: Encountering WeChat compatibility issues
- **Content**: WeChat HTML/CSS constraints and best practices

### `references/styles.js`
- **When**: Step 5 (style selection)
- **Content**: 18 style theme configurations with Chinese names

### `references/custom-style-guide.md`
- **When**: Step 5 (creating custom style)
- **Content**: Comprehensive guide for generating WeChat-compatible custom styles, including constraints checklists, templates, and color schemes

## Scripts

### `scripts/generate-html.js`

Converts Markdown to HTML with inline styles.

**Features**:
- Markdown-it rendering with syntax highlighting
- Image grid layout (2+ consecutive images)
- Inline style application
- WeChat-compatible output
- **Custom style support** via `--custom-style` parameter

**Usage**:
```bash
# Predefined style
node scripts/generate-html.js "markdown" --style wechat-default > output.html

# Custom style
node scripts/generate-html.js "markdown" --custom-style custom-style.json > output.html
```

**Styles**: 18 themes (see Step 5 for complete list organized by article type)

## Example

**Input**:
```
AI改变教育。个性化学习。效率提升。
```

**Step 1**: Use `AskUserQuestion` to check ambiguities (none found).

**Step 2**: Polish content (maintaining user's language).
```
人工智能正在深刻改变教育行业。通过个性化学习算法，AI能够根据每个学生的学习进度和特点，提供定制化的学习内容和路径。这不仅提高了学习效率，也让教育更加公平和可及。
```

**Step 3**: Format Markdown.
```
# 人工智能改变教育

人工智能正在深刻改变教育行业。通过个性化学习算法，AI能够根据每个学生的学习进度和特点，提供定制化的学习内容和路径。

这不仅提高了学习效率，也让教育更加公平和可及。
```

**Step 4**: Display content and use `AskUserQuestion` - User selects "满意".

**Step 5a**: Use `AskUserQuestion` - User selects "通用文章".

**Step 5b**: Use `AskUserQuestion` - User selects "默认公众号 (wechat-default)".

**Step 6**: Generate HTML and automatically open in browser.
```bash
node scripts/generate-html.js "$(cat article.md)" --style wechat-default > article.html

# Windows (automatically open in browser)
start article.html

# macOS (automatically open in browser)
open article.html

# Linux (automatically open in browser)
xdg-open article.html
```

**Step 7**: User previews HTML (automatically opened) and uses `AskUserQuestion` - User selects "满意".

**Step 8**: Provide copy instructions to user.

## Troubleshooting

**Issue**: Script fails with "Style not found"
- **Solution**: Check style key in `references/styles.js`, use exact key from Step 5

**Issue**: Custom style JSON parsing error
- **Solution**: Ensure JSON is valid and contains "styles" object with proper CSS syntax

**Issue**: Images not displaying in WeChat
- **Solution**: Ensure images are Base64 encoded or use WeChat material library URLs

**Issue**: Layout broken in WeChat editor
- **Solution**: Check `references/wechat-syntax.md` for compatibility rules, avoid unsupported CSS

**Issue**: User wants style not in recommended list
- **Solution**: User can select "自定义风格", describe requirements, or manually choose from all 18 styles in `references/styles.js`
