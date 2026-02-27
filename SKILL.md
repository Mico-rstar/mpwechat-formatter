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

**Read**: `references/polish-guidelines.md` - Complete ambiguity checklist and confirmation patterns

Use `AskUserQuestion` tool for confirmations, max 4 options per question. Prioritize most important ambiguities first.

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

**Image Handling**:
- If user provided images in Markdown, they will be automatically converted to Base64 during HTML generation
- No manual image processing needed in this step - simply include image references in Markdown:
  - Local images: `![alt text](./images/photo.jpg)`
  - Remote images: `![alt text](https://example.com/image.png)`
- All images are automatically converted to Base64 for WeChat compatibility

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

Use `AskUserQuestion` to present 3-4 recommended styles for the chosen article type.

**Example for "通用文章"**:
```
Question: "请选择通用类文章风格："
Options:
- "默认公众号" (wechat-default) - 经典微信公众号风格
- "优雅简约" (wechat-elegant) - 简洁优雅
- "Claude官方" (wechat-anthropic) - Claude品牌风格
- "自定义风格" (custom) - 描述您想要的风格
```

**Example for "技术文章"**:
```
Question: "请选择技术类文章风格："
Options:
- "技术风格" (wechat-tech) - 专为技术文章设计
- "Claude官方" (wechat-anthropic) - 适合技术分享
- "Apple极简" (wechat-apple) - 简洁技术文档风格
- "自定义风格" (custom) - 描述您想要的风格
```

**For complete style examples for all article types**, see `references/style-selection-examples.md`

Follow the same pattern: 3 recommended styles + "自定义风格" option.

**If user chooses "自定义风格"**:
- Allow user to describe desired style characteristics
- Examples: "配色温馨柔和，标题用圆角边框，背景浅粉色"
- **Read `references/custom-style-guide.md`** for generation guidelines
- **Read `references/custom-style-template.md`** for JSON template and WeChat constraints
- Create custom style JSON file following WeChat constraints
- Save to working directory as `custom-style.json`
- Use `--custom-style custom-style.json` parameter when generating HTML

### Step 6: Generate HTML

Convert Markdown to styled HTML using the script.

**Run**: `scripts/generate-html.js`

**Usage with predefined style**:
```bash
# Pass markdown content directly (for short content)
node scripts/generate-html.js "markdown content" --style <selected-style>

# Read from markdown file (RECOMMENDED - cross-platform compatible)
node scripts/generate-html.js --file article.md --style <selected-style>
```

**Usage with custom style**:
```bash
# Direct content
node scripts/generate-html.js "markdown content" --custom-style custom-style.json

# From file (RECOMMENDED)
node scripts/generate-html.js --file article.md --custom-style custom-style.json
```

**Image Processing**:
Images are automatically converted to Base64 for WeChat compatibility. See `references/image-processing.md` for complete documentation including:

- Supported image formats (JPEG, PNG, GIF, WebP, SVG, BMP, TIFF, ICO)
- Error handling and warnings
- Command-line options: `--no-convert-images`, `--max-image-size`, `--image-timeout`, `--image-base-path`
- Troubleshooting guide

**Save output to file**:
```bash
# Cross-platform compatible (works on Windows, macOS, Linux)
node scripts/generate-html.js --file article.md --style wechat-default > article.html
```

**Output**: Complete HTML file with inline styles and Base64-encoded images, ready for WeChat.

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

### `references/custom-style-template.md`
- **When**: Step 5 (creating custom style JSON file)
- **Content**: WeChat-compatible JSON template and constraint checklist

### `references/style-selection-examples.md`
- **When**: Step 5 (recommending styles)
- **Content**: Complete AskUserQuestion examples for all article types

### `references/image-processing.md`
- **When**: Step 6 (generating HTML with images)
- **Content**: Complete image processing documentation, options, error handling, and troubleshooting

## Scripts

### `scripts/generate-html.js`

Converts Markdown to HTML with inline styles.

**Features**:
- Markdown-it rendering with syntax highlighting
- Image grid layout (2+ consecutive images)
- Inline style application
- WeChat-compatible output
- **Custom style support** via `--custom-style` parameter
- **Automatic image to Base64 conversion** for WeChat compatibility
- **Local and remote image support** with automatic handling

**Usage**:
```bash
# Read from markdown file (RECOMMENDED - cross-platform)
node scripts/generate-html.js --file article.md --style wechat-default > output.html

# Pass markdown content directly
node scripts/generate-html.js "# Title\n\nContent" --style wechat-default > output.html

# Custom style from file
node scripts/generate-html.js --file article.md --custom-style custom-style.json > output.html

# With image processing options
node scripts/generate-html.js --file article.md --style wechat-default --max-image-size 10 > output.html
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
node scripts/generate-html.js --file article.md --style wechat-default > article.html

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

**Issue**: Image conversion warnings in stderr
- **Solution**: Check warnings for specific issues:
  - "Image file not found" - Verify local image path is correct relative to markdown file
  - "Failed to download image" - Check URL is accessible and not blocked by CORS
  - "Image exceeds maximum size" - Increase `--max-image-size` limit or compress image
  - "Image download timeout" - Increase `--image-timeout` value

**Issue**: Images not being converted to Base64
- **Solution**:
  - Check if `--no-convert-images` flag was used (remove it to enable conversion)
  - For local images, verify paths are relative to the markdown file location
  - For remote images, ensure URLs start with `http://` or `https://`
  - WeChat material URLs (mp.weixin.qq.com) are preserved as-is by design

**Issue**: Local image path resolution fails
- **Solution**: Use `--image-base-path` option to specify the base directory for relative images:
  ```bash
  node scripts/generate-html.js --file article.md --style wechat-default --image-base-path ./assets/images
  ```

**Issue**: Layout broken in WeChat editor
- **Solution**: Check `references/wechat-syntax.md` for compatibility rules, avoid unsupported CSS

**Issue**: Large image causing slow WeChat editor
- **Solution**: Compress images before conversion or reduce `--max-image-size` limit to exclude large images

**Issue**: User wants style not in recommended list
- **Solution**: User can select "自定义风格", describe requirements, or manually choose from all 18 styles in `references/styles.js`
