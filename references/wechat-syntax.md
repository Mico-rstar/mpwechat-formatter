# 微信公众号排版语言语法约束文档

基于公众号 Markdown 编辑器项目的实际实现，总结微信公众号编辑器支持的 HTML/CSS 语法规范。

## 📋 目录

- [概述](#概述)
- [支持的 HTML 标签](#支持的-html-标签)
- [支持的 CSS 属性](#支持的-css-属性)
- [不支持的特性](#不支持的特性)
- [图片处理约束](#图片处理约束)
- [布局限制](#布局限制)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 概述

微信公众号编辑器使用的是**高度受限的 HTML 子集**，类似于 HTML 4.01/CSS 2.1 的部分功能，但有以下特点：

- ✅ 支持基础 HTML 标签
- ✅ 仅支持内联样式（`style` 属性）
- ❌ 不支持外部样式表
- ❌ 不支持 CSS 类选择器
- ❌ 不支持 JavaScript
- ❌ 不支持现代 CSS 布局（Grid、Flexbox 部分支持）

---

## 支持的 HTML 标签

### 文本结构标签

| 标签 | 支持程度 | 说明 | 示例 |
|------|---------|------|------|
| `<div>` | ✅ 完全支持 | 通用容器，用于布局分组 | `<div style="padding: 10px;">内容</div>` |
| `<p>` | ✅ 完全支持 | 段落标签，推荐使用 | `<p style="margin: 16px 0;">段落内容</p>` |
| `<span>` | ✅ 完全支持 | 内联文本容器 | `<span style="color: red;">文字</span>` |
| `<section>` | ⚠️ 部分支持 | 可用于带背景色的容器 | `<section style="background: #f5f5f5;">` |
| `<br>` | ✅ 完全支持 | 换行 | `<br>` |

**代码参考**：
```javascript
// app.js:1099-1101
const container = doc.createElement('div');
container.setAttribute('style', style.container);
container.innerHTML = doc.body.innerHTML;
```

### 标题标签

| 标签 | 支持程度 | 推荐样式 |
|------|---------|---------|
| `<h1>` | ✅ 完全支持 | `font-size: 22-26px; font-weight: 600;` |
| `<h2>` | ✅ 完全支持 | `font-size: 20-24px; font-weight: 600;` |
| `<h3>` | ✅ 完全支持 | `font-size: 18-20px; font-weight: 600;` |
| `<h4>` | ✅ 完全支持 | `font-size: 16-18px; font-weight: 600;` |
| `<h5>` | ✅ 完全支持 | `font-size: 15-17px; font-weight: 600;` |
| `<h6>` | ✅ 完全支持 | `font-size: 14-16px; font-weight: 600;` |

**样式参考**（来自 styles.js）：
```css
h1: 'font-size: 24px; font-weight: 600; color: #2c3e50 !important; line-height: 1.4 !important; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #3498db;'
```

### 文本格式化标签

| 标签 | 支持程度 | 用途 |
|------|---------|------|
| `<strong>` | ✅ 完全支持 | 加粗文本 |
| `<b>` | ✅ 完全支持 | 加粗（语义弱于 strong） |
| `<em>` | ✅ 完全支持 | 斜体强调 |
| `<i>` | ✅ 完全支持 | 斜体（语义弱于 em） |
| `<a>` | ✅ 完全支持 | 超链接 |
| `<u>` | ✅ 完全支持 | 下划线 |
| `<del>` | ⚠️ 部分支持 | 删除线 |
| `<s>` | ⚠️ 部分支持 | 删除线 |

**代码参考**：
```javascript
// app.js:1078-1088
const inlineNodes = heading.querySelectorAll(headingInlineSelectorList);
inlineNodes.forEach(node => {
  const tag = node.tagName.toLowerCase();
  // 处理标题内的内联元素样式
});
```

### 列表标签

| 标签 | 支持程度 | 说明 |
|------|---------|------|
| `<ul>` | ✅ 完全支持 | 无序列表 |
| `<ol>` | ✅ 完全支持 | 有序列表 |
| `<li>` | ✅ 完全支持 | 列表项 |

**样式参考**：
```css
ul: 'margin: 16px 0; padding-left: 24px;'
ol: 'margin: 16px 0; padding-left: 24px;'
li: 'margin: 8px 0; line-height: 1.8 !important;'
```

### 表格标签

| 标签 | 支持程度 | 说明 |
|------|---------|------|
| `<table>` | ✅ 完全支持 | 表格容器（**推荐布局方案**） |
| `<tr>` | ✅ 完全支持 | 表格行 |
| `<td>` | ✅ 完全支持 | 表格单元格 |
| `<th>` | ✅ 完全支持 | 表头单元格 |

**⚠️ 重要提示**：微信公众号使用 `<table>` 进行布局，因为不支持 CSS Grid。

**代码参考**（app.js:1309-1350 Grid 转 Table）：
```javascript
const table = doc.createElement('table');
table.setAttribute('style', 'width: 100% !important; border-collapse: collapse;');

const tr = doc.createElement('tr');
const td = doc.createElement('td');
// ... 转换逻辑
```

### 代码标签

| 标签 | 支持程度 | 说明 |
|------|---------|------|
| `<pre>` | ✅ 完全支持 | 预格式化文本 |
| `<code>` | ✅ 完全支持 | 代码块 |

**样式参考**：
```css
code: 'font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace; font-size: 14px; padding: 2px 6px; background-color: #f6f8fa; border-radius: 3px;'
pre: 'font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace; font-size: 14px; padding: 16px; overflow-x: auto; line-height: 1.5;'
```

### 媒体标签

| 标签 | 支持程度 | 约束 |
|------|---------|------|
| `<img>` | ✅ 完全支持 | 必须使用 Base64 或公众号素材库 URL |

**⚠️ 重要约束**：外部图片链接可能无法显示，推荐使用 Base64 编码。

**代码参考**（app.js:1450-1495）：
```javascript
async convertImageToBase64(imgElement) {
  const imageId = imgElement.getAttribute('data-image-id');
  if (imageId && this.imageStore) {
    const blob = await this.imageStore.getImageBlob(imageId);
    const reader = new FileReader();
    reader.readAsDataURL(blob); // 转为 Base64
    // ...
  }
}
```

---

## 支持的 CSS 属性

### 文本样式属性

| 属性 | 支持程度 | 推荐值 |
|------|---------|--------|
| `color` | ✅ 完全支持 | 十六进制 `#333` 或 RGB |
| `font-size` | ✅ 完全支持 | 12px - 24px |
| `font-weight` | ✅ 完全支持 | `normal` / `bold` / `400` / `600` |
| `font-family` | ⚠️ 部分支持 | 系统字体栈（见下方） |
| `line-height` | ✅ 完全支持 | `1.4` - `2.0` |
| `text-align` | ✅ 完全支持 | `left` / `center` / `right` |
| `text-decoration` | ✅ 完全支持 | `none` / `underline` |
| `letter-spacing` | ✅ 完全支持 | 字母间距 |

**推荐字体栈**（来自项目）：
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### 间距属性

| 属性 | 支持程度 | 推荐值 |
|------|---------|--------|
| `margin` | ✅ 完全支持 | `16px 0`（上下16px，左右0） |
| `padding` | ✅ 完全支持 | `12px 16px` |
| `margin-top/bottom/left/right` | ✅ 完全支持 | 单向边距 |
| `padding-top/bottom/left/right` | ✅ 完全支持 | 单向内边距 |

### 背景属性

| 属性 | 支持程度 | 约束 |
|------|---------|------|
| `background-color` | ✅ 完全支持 | 纯色背景 |
| `background` | ⚠️ 部分支持 | 简单背景可工作 |
| `background-image` | ❌ 不推荐 | 可能被过滤 |

**示例**：
```css
background-color: #f5f5f5; /* ✅ 可用 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* ⚠️ 可能被过滤 */
```

### 边框属性

| 属性 | 支持程度 | 推荐值 |
|------|---------|--------|
| `border` | ✅ 完全支持 | `1px solid #e0e0e0` |
| `border-left/right/top/bottom` | ✅ 完全支持 | 单向边框 |
| `border-radius` | ✅ 完全支持 | `4px` - `8px` |
| `border-collapse` | ✅ 完全支持 | 表格边框合并 |

### 尺寸属性

| 属性 | 支持程度 | 说明 |
|------|---------|------|
| `width` | ✅ 完全支持 | 百分比或像素 |
| `height` | ✅ 完全支持 | 像素值 |
| `max-width` | ✅ 完全支持 | 推荐用于图片 |
| `max-height` | ✅ 完全支持 | 推荐用于图片 |

**代码参考**：
```css
img: 'max-width: 100%; max-height: 400px; height: auto;'
```

### 定位属性

| 属性 | 支持程度 | 说明 |
|------|---------|------|
| `display` | ⚠️ 部分支持 | 仅 `block` / `inline` / `table-cell` |
| `float` | ⚠️ 不推荐 | 使用 table 布局代替 |
| `position` | ❌ 不支持 | 使用 margin/padding 代替 |

### 其他属性

| 属性 | 支持程度 | 说明 |
|------|---------|------|
| `overflow` | ✅ 完全支持 | 代码块滚动 |
| `white-space` | ✅ 完全支持 | 代码格式 |
| `word-wrap` | ✅ 完全支持 | 长单词换行 |
| `opacity` | ⚠️ 部分支持 | 可能被过滤 |

---

## 不支持的特性

### ❌ 完全不支持的 CSS 特性

| 特性 | 替代方案 |
|------|---------|
| **CSS Grid** | 使用 `<table>` 布局 |
| **Flexbox** | 使用 `<table>` 布局 |
| **CSS 变量 (`var(--name)`)** | 直接使用值 |
| **外部样式表 (`<link>`)` | 内联样式 |
| **类选择器 (`.class`)** | 内联样式 |
| **ID 选择器 (`#id`)** | 内联样式 |
| **伪元素 (`::before`, `::after`)** | 在 HTML 中添加内容 |
| **伪类 (`:hover`, `:active`)** | 不支持交互效果 |
| **JavaScript** | 纯静态 HTML |
| **`@import`** | 内联样式 |
| **`calc()`** | 手动计算值 |
| **CSS 动画/过渡** | 不支持 |
| **`transform`** | 不支持 |
| **`box-shadow`** | ⚠️ 可能被过滤 |

### ⚠️ 部分支持或不稳定的特性

| 特性 | 说明 |
|------|------|
| **渐变背景** | 可能被某些版本的编辑器过滤 |
| **复杂边框** | 简化为基础边框 |
| **多个 class** | 会被剥离，使用内联样式 |
| **data 属性** | 可能被保留，但不可靠 |

---

## 图片处理约束

### 图片格式支持

| 格式 | 支持程度 | 推荐场景 |
|------|---------|---------|
| JPEG | ✅ 完全支持 | 照片、复杂图像 |
| PNG | ✅ 完全支持 | 透明背景、图标 |
| GIF | ⚠️ 部分支持 | 静态 GIF 可用，动画可能不播放 |
| SVG | ❌ 不支持 | 需转为 PNG/JPEG |
| WebP | ❌ 不支持 | 需转为 JPEG |

### 图片尺寸约束

基于项目代码（app.js:1201-1280）：

```javascript
// 单张图片
max-height: 400px;

// 网格布局中的图片
max-height: 360px;

// 图片压缩参数（ImageCompressor）
maxWidth: 1920px;
maxHeight: 1920px;
quality: 0.85;
```

### 图片编码约束

| 方式 | 支持程度 | 说明 |
|------|---------|------|
| **Base64** | ✅ 推荐 | 内嵌在 HTML 中，100% 可靠 |
| **公众号素材库 URL** | ✅ 推荐 | 上传到公众号后使用 |
| **外部 URL** | ⚠️ 不推荐 | 可能无法显示或被防盗链 |
| **本地路径** | ❌ 不支持 | 粘贴后无法访问 |

**Base64 编码示例**：
```html
<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCE..."
     style="max-width: 100%; max-height: 400px;">
```

### 图片布局规则

基于项目代码（app.js:1114-1140）：

```
连续 2 张图片：并排两列（50% + 50%）
连续 3 张图片：一行三列（33.33% × 3）
连续 4 张图片：2×2 网格
5 张及以上：3 列网格布局
```

**实现方式**：使用 `<table>` 模拟网格布局

```javascript
// app.js:1310-1350
const table = doc.createElement('table');
// 将 Grid 转换为 Table
```

---

## 布局限制

### 容器约束

| 属性 | 限制 | 推荐值 |
|------|------|--------|
| 最大宽度 | 不超过手机屏幕宽度 | `max-width: 677px`（公众号编辑器宽度） |
| 内边距 | 避免过于拥挤 | `padding: 20px 12px` |
| 外边距 | 适当间距 | `margin: 16px 0` |

**代码参考**：
```css
container: 'max-width: 740px; margin: 0 auto; padding: 10px 12px 20px 12px;'
```

### 多列布局

**❌ 不支持的方案**：
```css
/* 这样不行 */
display: grid;
grid-template-columns: 1fr 1fr;

/* 这样也不行 */
display: flex;
flex-direction: row;
```

**✅ 推荐方案**：使用 `<table>`
```html
<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; padding: 10px;">左列</td>
    <td style="width: 50%; padding: 10px;">右列</td>
  </tr>
</table>
```

### 居中对齐

**文本居中**：
```html
<p style="text-align: center;">居中文本</p>
```

**元素居中（使用 table-cell）**：
```html
<div style="display: table-cell; vertical-align: middle; text-align: center; width: 100%;">
  <img src="..." style="display: block; margin: 0 auto;">
</div>
```

**代码参考**（app.js:1375-1382）：
```javascript
const innerWrapper = doc.createElement('div');
innerWrapper.setAttribute('style', `
  display: table-cell !important;
  vertical-align: middle !important;
  text-align: center !important;
`);
```

---

## 最佳实践

### 1. 样式内联化

**✅ 正确**：
```html
<h1 style="font-size: 24px; font-weight: bold; color: #333;">标题</h1>
```

**❌ 错误**：
```html
<h1 class="title">标题</h1>
```

### 2. 使用 !important

公众号编辑器可能添加自己的默认样式，使用 `!important` 确保样式生效：

```css
color: #2c3e50 !important;
line-height: 1.8 !important;
```

**代码参考**（styles.js）：
```javascript
h1: 'font-size: 24px; color: #2c3e50 !important; line-height: 1.4 !important;'
```

### 3. 图片使用 Base64

**✅ 正确**：
```html
<img src="data:image/png;base64,iVBORw0KGgo...">
```

**⚠️ 有风险**：
```html
<img src="https://example.com/image.jpg">
```

### 4. 使用表格布局

**✅ 正确**：
```html
<table style="width: 100%;">
  <tr>
    <td style="width: 50%;">左</td>
    <td style="width: 50%;">右</td>
  </tr>
</table>
```

**❌ 错误**：
```html
<div style="display: grid; grid-template-columns: 1fr 1fr;">
```

### 5. 简化代码块

公众号编辑器可能剥离复杂结构：

**✅ 推荐**：
```html
<pre style="background: #f6f8fa; padding: 16px; font-family: monospace;">
代码内容
</pre>
```

**⚠️ 避免嵌套**：
```html
<!-- 不推荐多层嵌套 -->
<pre><code><span>代码</span></code></pre>
```

### 6. 字体回退栈

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB",
             "Microsoft YaHei", sans-serif;
```

### 7. 响应式图片

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

---

## 常见问题

### Q1: 为什么预览正常，粘贴到公众号后样式丢失？

**原因**：
- 使用了外部样式表
- 使用了 CSS 类选择器
- 使用了不支持的 CSS 属性

**解决方案**：
```javascript
// 项目中的解决方案：所有样式内联化
element.setAttribute('style', styleConfig.h1);
```

### Q2: 图片在公众号中显示不出来？

**原因**：
- 使用了外部图片链接（被防盗链）
- 使用了不支持的图片格式（SVG、WebP）
- 图片过大（超过 5MB）

**解决方案**：
```javascript
// 项目中的解决方案：转为 Base64
const reader = new FileReader();
reader.readAsDataURL(blob); // Base64 编码
```

### Q3: 复杂布局在公众号中乱了？

**原因**：
- 使用了 CSS Grid 或 Flexbox
- 公众号不支持现代布局方式

**解决方案**：
```javascript
// 项目中的解决方案：Grid 转 Table
function convertGridToTable(gridElement) {
  const table = doc.createElement('table');
  // ... 转换逻辑
}
```

### Q4: 代码块在公众号中格式乱了？

**原因**：
- 使用了多层嵌套结构
- 字体等宽属性未生效

**解决方案**：
```css
/* 简化为单层结构 */
pre {
  font-family: monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}
```

### Q5: 表格边框不显示？

**解决方案**：
```css
table {
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
}
td, th {
  border: 1px solid #e0e0e0;
  padding: 12px;
}
```

---

## 快速参考

### 最小可用的 HTML 结构

```html
<section style="max-width: 677px; margin: 0 auto; padding: 20px 12px; font-family: sans-serif;">

  <!-- 标题 -->
  <h1 style="font-size: 22px; font-weight: bold; color: #333; margin: 20px 0;">
    文章标题
  </h1>

  <!-- 段落 -->
  <p style="margin: 16px 0; line-height: 1.8; color: #333;">
    这是正文内容。
  </p>

  <!-- 图片 -->
  <img src="data:image/jpeg;base64,..."
       style="max-width: 100%; height: auto; display: block; margin: 16px 0;">

  <!-- 列表 -->
  <ul style="margin: 16px 0; padding-left: 24px;">
    <li style="margin: 8px 0;">列表项</li>
  </ul>

</section>
```

### CSS 属性速查表

| 用途 | 属性 | 示例值 |
|------|------|--------|
| 文本颜色 | `color` | `#333` |
| 字体大小 | `font-size` | `16px` |
| 字体粗细 | `font-weight` | `bold` / `600` |
| 行高 | `line-height` | `1.8` |
| 外边距 | `margin` | `16px 0` |
| 内边距 | `padding` | `12px 16px` |
| 背景色 | `background-color` | `#f5f5f5` |
| 边框 | `border` | `1px solid #e0e0e0` |
| 圆角 | `border-radius` | `4px` |
| 文本对齐 | `text-align` | `center` |

---

## 版本信息

- **文档版本**：1.0
- **基于项目**：公众号 Markdown 编辑器 v2.0
- **最后更新**：2026-02-26
- **测试环境**：微信公众号编辑器（2025年版本）

---

## 参考资源

- [项目源码](app.js)
- [样式配置](styles.js)
- [微信公众号官方文档](https://mp.weixin.qq.com/cgi-bin/opshowpage)

---

**注意**：微信公众号编辑器的支持情况可能会随时间变化，建议在实际发布前进行测试验证。
