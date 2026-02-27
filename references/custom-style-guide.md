# 微信公众号自定义风格生成指南

本文档提供创建自定义风格的完整指南，确保生成的风格完全兼容微信公众号编辑器。

## 微信公众号编辑器约束（必须遵守）

### 关键约束

#### 1. 宽度约束 ⚠️ **最重要**
```css
/* 正确的 container 宽度 */
max-width: 740px;  /* 推荐最大宽度 */
max-width: 700px;  /* 稍窄，适合极简风格 */
max-width: 680px;  /* 最窄，适合经典报纸风格 */

/* ❌ 错误的宽度 */
max-width: 100%;   /* 会超出编辑器范围 */
max-width: 1200px; /* 严重超出，导致横向滚动条 */
```

**原因**：微信公众号编辑器的最大内容宽度约为 677-720px，超过会导致横向滚动条。

#### 2. 内边距约束
```css
/* 推荐配置 */
padding: 10px 12px 20px 12px;  /* 上 右 下 左 */
padding: 16px 12px 36px 12px;  /* 更宽松的上下间距 */

/* 左右内边距必须 ≤ 20px */
padding: 10px 20px 20px 20px;  /* 最大可接受 */
```

**原因**：移动端屏幕宽度有限，过大的左右内边距会压缩内容宽度。

#### 3. 文字大小约束
```css
/* 正文文字 */
font-size: 16px;  /* 推荐大小 */
font-size: 17px;  /* 稍大，适合长文阅读 */

/* 标题文字 */
font-size: 24px;  /* h1 标题 */
font-size: 22px;  /* h2 标题 */
font-size: 20px;  /* h3 标题 */
```

**原因**：过小的文字在移动端难以阅读，过大的文字会占用过多空间。

#### 4. 行高约束
```css
/* 正文行高 */
line-height: 1.8;   /* 推荐值 */
line-height: 1.75;  /* 可接受范围 */
line-height: 1.85;  /* 可接受范围 */

/* 标题行高 */
line-height: 1.4;   /* 推荐值 */
line-height: 1.3;   /* 紧凑标题 */
```

**原因**：合适的行高确保移动端阅读舒适度。

#### 5. 样式优先级
```css
/* 关键样式必须使用 !important */
color: #3f3f3f !important;
background-color: #fff !important;
line-height: 1.8 !important;
```

**原因**：微信公众号编辑器可能添加内联样式，!important 确保自定义样式生效。

## 完整的自定义风格模板

### 基础模板

```json
{
  "name": "用户自定义风格",
  "styles": {
    "container": "max-width: 740px; margin: 0 auto; padding: 10px 12px 20px 12px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; font-size: 16px; line-height: 1.8 !important; color: #3f3f3f !important; background-color: #fff !important; word-wrap: break-word;",
    "h1": "font-size: 24px; font-weight: 600; color: #2c3e50 !important; line-height: 1.4 !important; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #3498db;",
    "h2": "font-size: 22px; font-weight: 600; color: #2c3e50 !important; line-height: 1.4 !important; margin: 28px 0 14px; padding-left: 12px; border-left: 4px solid #3498db;",
    "h3": "font-size: 20px; font-weight: 600; color: #34495e !important; line-height: 1.4 !important; margin: 24px 0 12px;",
    "h4": "font-size: 18px; font-weight: 600; color: #34495e !important; line-height: 1.4 !important; margin: 20px 0 10px;",
    "h5": "font-size: 17px; font-weight: 600; color: #34495e !important; line-height: 1.4 !important; margin: 18px 0 9px;",
    "h6": "font-size: 16px; font-weight: 600; color: #34495e !important; line-height: 1.4 !important; margin: 16px 0 8px;",
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

## 基于用户描述生成风格

### 示例 1：温馨柔和风格

**用户描述**："配色温馨柔和，标题用圆角边框，背景浅粉色"

**生成策略**：
```json
{
  "name": "温馨柔和风格",
  "styles": {
    "container": "max-width: 740px; margin: 0 auto; padding: 10px 12px 20px 12px; font-family: -apple-system, sans-serif; font-size: 16px; line-height: 1.8 !important; color: #5a4a42 !important; background-color: #fff5f7 !important; word-wrap: break-word;",
    "h1": "font-size: 24px; font-weight: 600; color: #e85a71 !important; line-height: 1.4 !important; margin: 32px 0 16px; padding: 12px 16px; background-color: #fff0f3; border-radius: 12px; border: 2px solid #ffd6df;",
    "h2": "font-size: 22px; font-weight: 600; color: #e85a71 !important; line-height: 1.4 !important; margin: 28px 0 14px; padding: 10px 14px; background-color: #fff0f3; border-radius: 10px; border-left: 4px solid #e85a71;",
    "p": "margin: 16px 0 !important; line-height: 1.8 !important; color: #5a4a42 !important;",
    "strong": "font-weight: 600; color: #e85a71 !important; background-color: rgba(232, 90, 113, 0.1) !important; padding: 2px 6px; border-radius: 4px;",
    "a": "color: #e85a71 !important; text-decoration: none; border-bottom: 1px solid #e85a71;"
  }
}
```

### 示例 2：商务专业风格

**用户描述**："商务风格，蓝色主题，严肃专业"

**生成策略**：
```json
{
  "name": "商务专业风格",
  "styles": {
    "container": "max-width: 700px; margin: 0 auto; padding: 16px 12px 36px 12px; font-family: Georgia, \"Times New Roman\", serif; font-size: 17px; line-height: 1.75 !important; color: #2c3e50 !important; background-color: #fff !important; word-wrap: break-word;",
    "h1": "font-size: 28px; font-weight: 700; color: #1a365d !important; line-height: 1.3 !important; margin: 40px 0 20px; padding-bottom: 12px; border-bottom: 3px solid #3182ce;",
    "h2": "font-size: 24px; font-weight: 600; color: #2c5282 !important; line-height: 1.3 !important; margin: 32px 0 16px; padding-left: 16px; border-left: 5px solid #3182ce;",
    "p": "margin: 20px 0 !important; line-height: 1.75 !important; color: #2c3e50 !important;",
    "strong": "font-weight: 700; color: #1a365d !important;",
    "blockquote": "margin: 20px 0; padding: 12px 20px; background-color: #ebf8ff; border-left: 4px solid #3182ce; color: #2c5282 !important; font-style: italic;"
  }
}
```

### 示例 3：科技未来风格

**用户描述**："科技感，深色背景，霓虹色点缀"

**生成策略**：
```json
{
  "name": "科技未来风格",
  "styles": {
    "container": "max-width: 740px; margin: 0 auto; padding: 10px 12px 20px 12px; font-family: \"SF Mono\", Menlo, monospace; font-size: 16px; line-height: 1.8 !important; color: #e2e8f0 !important; background-color: #1a202c !important; word-wrap: break-word;",
    "h1": "font-size: 26px; font-weight: 700; color: #00ff9f !important; line-height: 1.3 !important; margin: 32px 0 16px; text-shadow: 0 0 10px rgba(0, 255, 159, 0.5);",
    "h2": "font-size: 22px; font-weight: 600; color: #00d4ff !important; line-height: 1.4 !important; margin: 28px 0 14px; border-left: 4px solid #00d4ff; padding-left: 12px;",
    "p": "margin: 16px 0 !important; line-height: 1.8 !important; color: #e2e8f0 !important;",
    "strong": "font-weight: 700; color: #00ff9f !important;",
    "code": "font-family: \"SF Mono\", monospace; font-size: 14px; padding: 3px 8px; background-color: #2d3748 !important; color: #00ff9f !important; border: 1px solid #00d4ff; border-radius: 4px;"
  }
}
```

## 颜色方案推荐

### 温馨色系
- 主色：`#e85a71` (粉红)
- 辅色：`#ffd6df` (浅粉)
- 背景：`#fff5f7` (极浅粉)
- 文字：`#5a4a42` (暖灰)

### 商务色系
- 主色：`#1a365d` (深蓝)
- 辅色：`#3182ce` (蓝色)
- 背景：`#ffffff` (白色)
- 文字：`#2c3e50` (深灰)

### 自然色系
- 主色：`#276749` (深绿)
- 辅色：`#48bb78` (绿色)
- 背景：`#f0fff4` (极浅绿)
- 文字：`#234e52` (深青)

### 科技色系
- 主色：`#00ff9f` (霓虹绿)
- 辅色：`#00d4ff` (霓虹蓝)
- 背景：`#1a202c` (深色)
- 文字：`#e2e8f0` (浅灰)

## 安全检查清单

生成自定义风格时，必须检查以下项目：

- [ ] **容器宽度** ≤ 740px
- [ ] **左右内边距** ≤ 20px
- [ ] **正文字号** 16-17px
- [ ] **正文行高** 1.75-1.85
- [ ] **关键样式使用 !important**
- [ ] **图片 max-width: 100%**
- [ ] **使用 word-wrap: break-word**
- [ ] **测试在移动端的显示效果**

## 常见错误

### ❌ 错误 1：宽度过大
```json
{
  "container": "max-width: 100%; padding: 0;"  // 会导致横向滚动
}
```

### ✅ 正确 1：合适宽度
```json
{
  "container": "max-width: 740px; padding: 10px 12px 20px 12px;"
}
```

### ❌ 错误 2：缺少 !important
```json
{
  "p": "color: #333; line-height: 1.8;"  // 可能被编辑器样式覆盖
}
```

### ✅ 正确 2：添加优先级
```json
{
  "p": "color: #333 !important; line-height: 1.8 !important;"
}
```

### ❌ 错误 3：文字过小
```json
{
  "p": "font-size: 14px;"  // 移动端难以阅读
}
```

### ✅ 正确 3：合适大小
```json
{
  "p": "font-size: 16px;"
}
```

## 调试技巧

1. **在浏览器中预览**：打开生成的 HTML 文件，使用移动设备模式检查
2. **检查横向滚动**：确保没有出现横向滚动条
3. **测试文字可读性**：在移动端屏幕上检查文字大小
4. **验证颜色对比度**：确保文字和背景有足够的对比度

## 参考资料

- 参考 `references/styles.js` 中的18个预定义风格
- 参考 `references/wechat-syntax.md` 了解微信公众号编辑器的完整约束
