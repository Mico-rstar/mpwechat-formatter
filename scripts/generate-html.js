#!/usr/bin/env node

/**
 * 微信公众号 HTML 生成器
 * 将 Markdown 转换为符合微信公众号编辑器约束的富文本 HTML
 *
 * 使用方式：
 *   node scripts/generate-html.js "markdown内容" --style wechat-default
 */

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const { JSDOM } = require('jsdom');

// 加载样式配置
const stylesPath = path.join(__dirname, '../references/styles.js');
const STYLES = require(stylesPath);

// 图片 MIME 类型映射
const MIME_TYPE_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.ico': 'image/x-icon'
};

/**
 * 检测文件 MIME 类型
 * @param {string} filePathOrUrl - 文件路径或URL
 * @returns {string} MIME 类型
 */
function detectMimeType(filePathOrUrl) {
  const ext = path.extname(filePathOrUrl).toLowerCase();
  return MIME_TYPE_MAP[ext] || 'image/jpeg';
}

/**
 * 转换本地图片为 Base64
 * @param {string} imagePath - 图片路径（相对或绝对）
 * @param {string} markdownFilePath - Markdown 文件路径（用于解析相对路径）
 * @param {object} options - 选项
 * @returns {string|null} Base64 Data URL 或 null（失败时）
 */
function convertLocalImageToBase64(imagePath, markdownFilePath = null, options = {}) {
  try {
    let resolvedPath;

    if (path.isAbsolute(imagePath)) {
      resolvedPath = imagePath;
    } else if (markdownFilePath) {
      const markdownDir = path.dirname(markdownFilePath);
      resolvedPath = path.resolve(markdownDir, imagePath);
    } else if (options.imageBasePath) {
      resolvedPath = path.resolve(options.imageBasePath, imagePath);
    } else {
      resolvedPath = path.resolve(imagePath);
    }

    if (!fs.existsSync(resolvedPath)) {
      console.error(`Warning: Image file not found: ${imagePath} (resolved: ${resolvedPath})`);
      return null;
    }

    const stats = fs.statSync(resolvedPath);
    const maxSizeBytes = (options.maxImageSize || 5) * 1024 * 1024;

    if (stats.size > maxSizeBytes) {
      console.error(`Warning: Image exceeds maximum size (${(stats.size / 1024 / 1024).toFixed(2)}MB > ${options.maxImageSize || 5}MB): ${imagePath}`);
      return null;
    }

    const buffer = fs.readFileSync(resolvedPath);
    const base64 = buffer.toString('base64');
    const mimeType = detectMimeType(resolvedPath);

    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.error(`Warning: Failed to convert local image: ${imagePath} - ${err.message}`);
    return null;
  }
}

/**
 * 下载并转换网络图片为 Base64
 * @param {string} imageUrl - 图片 URL
 * @param {object} options - 选项
 * @returns {Promise<string|null>} Base64 Data URL 或 null（失败时）
 */
async function convertRemoteImageToBase64(imageUrl, options = {}) {
  try {
    const { default: fetch } = await import('node-fetch');
    const timeout = options.imageTimeout || 10000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Warning: Failed to download image: ${imageUrl} (HTTP ${response.status})`);
      return null;
    }

    const buffer = await response.buffer();
    const maxSizeBytes = (options.maxImageSize || 5) * 1024 * 1024;

    if (buffer.length > maxSizeBytes) {
      console.error(`Warning: Downloaded image exceeds maximum size (${(buffer.length / 1024 / 1024).toFixed(2)}MB > ${options.maxImageSize || 5}MB): ${imageUrl}`);
      return null;
    }

    const base64 = buffer.toString('base64');
    const mimeType = detectMimeType(imageUrl);

    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error(`Warning: Image download timeout (${options.imageTimeout || 10000}ms): ${imageUrl}`);
    } else {
      console.error(`Warning: Failed to download image: ${imageUrl} - ${err.message}`);
    }
    return null;
  }
}

/**
 * 处理 Markdown 中的所有图片引用
 * @param {string} markdown - Markdown 内容
 * @param {object} options - 选项
 * @returns {Promise<string>} 处理后的 Markdown 内容
 */
async function processImages(markdown, options = {}) {
  if (options.noConvertImages) {
    return markdown;
  }

  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)|<img([^>]*)src=["']([^"']+)["']/gi;
  const replacements = [];
  let match;

  while ((match = imageRegex.exec(markdown)) !== null) {
    const fullMatch = match[0];
    const altText = match[1] || '';
    let imagePath = match[2] || match[4] || '';

    if (!imagePath) {
      continue;
    }

    // 跳过已经是 Base64 的图片
    if (imagePath.startsWith('data:')) {
      continue;
    }

    // 跳过微信公众号素材库 URL
    if (imagePath.includes('mp.weixin.qq.com')) {
      continue;
    }

    let replacement = null;
    const isRemoteUrl = imagePath.startsWith('http://') || imagePath.startsWith('https://');

    if (isRemoteUrl) {
      replacement = await convertRemoteImageToBase64(imagePath, options);
    } else {
      replacement = convertLocalImageToBase64(imagePath, options.markdownFilePath, options);
    }

    if (replacement) {
      replacements.push({
        start: match.index,
        end: match.index + fullMatch.length,
        replacement: fullMatch.replace(imagePath, replacement)
      });
    }
  }

  // 应用替换（从后向前，避免索引偏移）
  for (let i = replacements.length - 1; i >= 0; i--) {
    const { start, end, replacement } = replacements[i];
    markdown = markdown.substring(0, start) + replacement + markdown.substring(end);
  }

  return markdown;
}

/**
 * 应用内联样式到 HTML
 * @param {string} html - HTML内容
 * @param {string} styleKey - 样式键名
 * @param {object} customStyle - 自定义样式对象（可选）
 */
function applyInlineStyles(html, styleKey, customStyle = null) {
  let style;

  if (customStyle && typeof customStyle === 'object') {
    // 使用自定义样式（提取 styles 属性）
    style = customStyle.styles || customStyle;
  } else {
    // 使用预定义样式
    style = STYLES[styleKey]?.styles;
    if (!style) {
      throw new Error(`Style "${styleKey}" not found. Available styles: ${Object.keys(STYLES).join(', ')}`);
    }
  }

  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // 标题内行内元素的覆盖样式（避免主题样式冲突）
  const headingInlineOverrides = {
    strong: 'font-weight: 700; color: inherit !important; background-color: transparent !important;',
    em: 'font-style: italic; color: inherit !important; background-color: transparent !important;',
    a: 'color: inherit !important; text-decoration: none !important; border-bottom: 1px solid currentColor !important; background-color: transparent !important;',
    code: 'color: inherit !important; background-color: transparent !important; border: none !important; padding: 0 !important;',
    span: 'color: inherit !important; background-color: transparent !important;',
    b: 'font-weight: 700; color: inherit !important; background-color: transparent !important;',
    i: 'font-style: italic; color: inherit !important; background-color: transparent !important;',
    del: 'color: inherit !important; background-color: transparent !important;',
    mark: 'color: inherit !important; background-color: transparent !important;',
    s: 'color: inherit !important; background-color: transparent !important;',
    u: 'color: inherit !important; text-decoration: underline !important; background-color: transparent !important;',
    ins: 'color: inherit !important; text-decoration: underline !important; background-color: transparent !important;',
    kbd: 'color: inherit !important; background-color: transparent !important; border: none !important; padding: 0 !important;',
    sub: 'color: inherit !important; background-color: transparent !important;',
    sup: 'color: inherit !important; background-color: transparent !important;'
  };
  const headingInlineSelectorList = Object.keys(headingInlineOverrides).join(', ');

  // 先处理图片网格布局
  groupConsecutiveImages(doc);

  // 应用样式
  Object.keys(style).forEach(selector => {
    if (selector === 'pre' || selector === 'code' || selector === 'pre code') {
      return;
    }

    const elements = doc.querySelectorAll(selector);
    elements.forEach(el => {
      // 跳过网格容器中的图片
      if (el.tagName === 'IMG' && el.closest('.image-grid')) {
        return;
      }

      const currentStyle = el.getAttribute('style') || '';
      el.setAttribute('style', currentStyle + '; ' + style[selector]);
    });
  });

  // 标题内的行内元素统一继承标题颜色
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const inlineNodes = heading.querySelectorAll(headingInlineSelectorList);
    inlineNodes.forEach(node => {
      const tag = node.tagName.toLowerCase();
      let override = headingInlineOverrides[tag];
      if (!override) {
        return;
      }

      const currentStyle = node.getAttribute('style') || '';
      const sanitizedStyle = currentStyle
        .replace(/color:\s*[^;]+;?/gi, '')
        .replace(/background(?:-color)?:\s*[^;]+;?/gi, '')
        .replace(/border(?:-bottom)?:\s*[^;]+;?/gi, '')
        .replace(/text-decoration:\s*[^;]+;?/gi, '')
        .replace(/box-shadow:\s*[^;]+;?/gi, '')
        .replace(/padding:\s*[^;]+;?/gi, '')
        .replace(/;\s*;/g, ';')
        .trim();
      node.setAttribute('style', sanitizedStyle + '; ' + override);
    });
  });

  // 包裹容器
  const container = doc.createElement('div');
  container.setAttribute('style', style.container);
  container.innerHTML = doc.body.innerHTML;

  return container.outerHTML;
}

/**
 * 分组连续图片并创建网格布局
 */
function groupConsecutiveImages(doc) {
  const body = doc.body;
  const children = Array.from(body.children);
  let imagesToProcess = [];

  // 找出所有图片元素
  children.forEach((child, index) => {
    if (child.tagName === 'P') {
      const images = child.querySelectorAll('img');
      if (images.length > 0) {
        if (images.length > 1) {
          // 多个图片在同一个P标签内
          const group = Array.from(images).map(img => ({
            element: child,
            img: img,
            index: index,
            inSameParagraph: true,
            paragraphImageCount: images.length
          }));
          imagesToProcess.push(...group);
        } else if (images.length === 1) {
          // 单个图片在P标签内
          imagesToProcess.push({
            element: child,
            img: images[0],
            index: index,
            inSameParagraph: false,
            paragraphImageCount: 1
          });
        }
      }
    } else if (child.tagName === 'IMG') {
      // 直接是图片元素
      imagesToProcess.push({
        element: child,
        img: child,
        index: index,
        inSameParagraph: false,
        paragraphImageCount: 1
      });
    }
  });

  // 分组逻辑
  let groups = [];
  let currentGroup = [];

  imagesToProcess.forEach((item, i) => {
    if (i === 0) {
      currentGroup.push(item);
    } else {
      const prevItem = imagesToProcess[i - 1];
      let isContinuous = false;

      if (item.index === prevItem.index) {
        // 同一个P标签内的图片
        isContinuous = true;
      } else if (item.index - prevItem.index === 1) {
        // 相邻的P标签，表示连续
        isContinuous = true;
      }

      if (isContinuous) {
        currentGroup.push(item);
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [item];
      }
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  // 对每组图片进行处理
  groups.forEach(group => {
    // 只有2张及以上的图片才需要特殊布局
    if (group.length < 2) return;

    const imageCount = group.length;
    const firstElement = group[0].element;

    // 创建容器
    const gridContainer = doc.createElement('div');
    gridContainer.setAttribute('class', 'image-grid');
    gridContainer.setAttribute('data-image-count', imageCount);

    // 根据图片数量设置网格样式
    let gridStyle = '';
    let columns = 2;

    if (imageCount === 2) {
      gridStyle = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin: 20px auto;
        max-width: 100%;
        align-items: start;
      `;
      columns = 2;
    } else if (imageCount === 3) {
      gridStyle = `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin: 20px auto;
        max-width: 100%;
        align-items: start;
      `;
      columns = 3;
    } else if (imageCount === 4) {
      gridStyle = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin: 20px auto;
        max-width: 100%;
        align-items: start;
      `;
      columns = 2;
    } else {
      // 5张及以上，使用3列
      gridStyle = `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin: 20px auto;
        max-width: 100%;
        align-items: start;
      `;
      columns = 3;
    }

    gridContainer.setAttribute('style', gridStyle);
    gridContainer.setAttribute('data-columns', columns);

    // 收集所有图片元素
    const imageElements = group.map(item => item.img);

    // 为每个图片创建包装器
    imageElements.forEach(img => {
      const wrapper = doc.createElement('div');
      wrapper.setAttribute('class', 'image-wrapper');

      // 设置包装器样式
      const wrapperStyle = `
        position: relative;
        overflow: hidden;
        border-radius: 4px;
      `;
      wrapper.setAttribute('style', wrapperStyle);

      // 设置图片样式
      const imgStyle = `
        width: 100%;
        max-height: 360px;
        height: auto;
        display: block;
        object-fit: contain;
      `;
      img.setAttribute('style', imgStyle);

      // 将图片移到包装器中
      wrapper.appendChild(img.cloneNode(true));
      gridContainer.appendChild(wrapper);
    });

    // 替换原来的内容
    // 如果所有图片都在同一个P标签内，替换那个P标签
    // 如果图片分散在不同的P标签，替换第一个P标签并删除其他的
    if (group[0].inSameParagraph && group[0].paragraphImageCount === imageCount) {
      firstElement.parentNode.replaceChild(gridContainer, firstElement);
    } else {
      firstElement.parentNode.replaceChild(gridContainer, firstElement);
      // 删除后续的P标签
      for (let i = 1; i < group.length; i++) {
        const elementToRemove = group[i].element;
        if (elementToRemove.parentNode) {
          elementToRemove.parentNode.removeChild(elementToRemove);
        }
      }
    }
  });
}

/**
 * 初始化 markdown-it
 */
function createMarkdownIt() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
    highlight: function (str, lang) {
      // macOS 风格的窗口装饰
      const dots = '<div style="display: flex; align-items: center; gap: 6px; padding: 10px 12px; background: #2a2c33; border-bottom: 1px solid #1e1f24;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></span><span style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></span><span style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></span></div>';

      let codeContent = '';
      if (lang && hljs.getLanguage(lang)) {
        try {
          codeContent = hljs.highlight(str, { language: lang }).value;
        } catch (__) {
          codeContent = md.utils.escapeHtml(str);
        }
      } else {
        codeContent = md.utils.escapeHtml(str);
      }

      return `<div style="margin: 20px 0; border-radius: 8px; overflow: hidden; background: #383a42; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">${dots}<div style="padding: 16px; overflow-x: auto; background: #383a42;"><code style="display: block; color: #abb2bf; font-family: 'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace; font-size: 14px; line-height: 1.6; white-space: pre;">${codeContent}</code></div></div>`;
    }
  });

  return md;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node generate-html.js "markdown-content" --style <style-name>');
    console.error('       node generate-html.js --file <markdown-file> --style <style-name>');
    console.error('       node generate-html.js "markdown-content" --custom-style <path-to-custom-style.json>');
    console.error('');
    console.error('Options:');
    console.error('  --file, -f <path>           Read markdown content from file');
    console.error('  --style <style-name>        Use predefined style');
    console.error('  --custom-style <path>       Use custom style from JSON file');
    console.error('');
    console.error('Image Processing Options:');
    console.error('  --no-convert-images         Disable automatic image to Base64 conversion');
    console.error('  --max-image-size <MB>       Maximum image size in MB (default: 5)');
    console.error('  --image-timeout <seconds>   Network timeout for image downloads (default: 10)');
    console.error('  --image-base-path <path>    Base path for resolving relative image paths');
    console.error('');
    console.error('Available styles:');
    Object.keys(STYLES).forEach(key => {
      console.error(`  - ${key}: ${STYLES[key].name}`);
    });
    console.error('');
    console.error('Custom style format (JSON):');
    console.error('  {');
    console.error('    "name": "My Custom Style",');
    console.error('    "styles": {');
    console.error('      "container": "...",');
    console.error('      "h1": "...",');
    console.error('      "p": "..."');
    console.error('    }');
    console.error('  }');
    process.exit(1);
  }

  // 解析参数
  let markdown = '';
  let markdownFilePath = null;
  let styleKey = 'wechat-default';
  let customStylePath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--style' && i + 1 < args.length) {
      styleKey = args[i + 1];
      i++;
    } else if (args[i] === '--custom-style' && i + 1 < args.length) {
      customStylePath = args[i + 1];
      i++;
    } else if ((args[i] === '--file' || args[i] === '-f') && i + 1 < args.length) {
      markdownFilePath = args[i + 1];
      i++;
    } else if (!args[i].startsWith('-')) {
      markdown = args[i];
    }
  }

  // 如果指定了文件路径，读取文件内容
  if (markdownFilePath) {
    try {
      markdown = fs.readFileSync(markdownFilePath, 'utf-8');
    } catch (err) {
      console.error(`Error: Failed to read file "${markdownFilePath}": ${err.message}`);
      process.exit(1);
    }
  }

  // 构建选项对象
  const options = {
    noConvertImages: args.includes('--no-convert-images'),
    maxImageSize: null,
    imageTimeout: null,
    imageBasePath: null,
    markdownFilePath: markdownFilePath
  };

  // 解析图片处理选项
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--max-image-size' && i + 1 < args.length) {
      options.maxImageSize = parseFloat(args[i + 1]);
      i++;
    } else if (args[i] === '--image-timeout' && i + 1 < args.length) {
      options.imageTimeout = parseInt(args[i + 1]) * 1000;
      i++;
    } else if (args[i] === '--image-base-path' && i + 1 < args.length) {
      options.imageBasePath = args[i + 1];
      i++;
    }
  }

  // 如果 markdown 为空，从 stdin 读取
  if (!markdown) {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', async () => {
      await processMarkdown(data, styleKey, customStylePath, options);
    });
  } else {
    (async () => {
      await processMarkdown(markdown, styleKey, customStylePath, options);
    })();
  }
}

/**
 * 处理 Markdown 并输出 HTML
 * @param {string} markdown - Markdown 内容
 * @param {string} styleKey - 样式键名
 * @param {string} customStylePath - 自定义样式路径
 * @param {object} options - 选项
 * @returns {Promise<void>}
 */
async function processMarkdown(markdown, styleKey, customStylePath = null, options = {}) {
  try {
    let customStyle = null;

    // 如果提供了自定义风格路径，读取并解析
    if (customStylePath) {
      try {
        const customStyleContent = fs.readFileSync(customStylePath, 'utf-8');
        customStyle = JSON.parse(customStyleContent);

        // 验证自定义风格格式
        if (!customStyle.styles || typeof customStyle.styles !== 'object') {
          throw new Error('Custom style must have a "styles" object property');
        }

        console.error(`Using custom style from: ${customStylePath}`);
      } catch (err) {
        throw new Error(`Failed to load custom style: ${err.message}`);
      }
    }

    // 处理图片（转换为 Base64）
    markdown = await processImages(markdown, options);

    // 初始化 markdown-it
    const md = createMarkdownIt();

    // 解析 markdown 为 HTML
    const html = md.render(markdown);

    // 应用内联样式
    const styledHtml = applyInlineStyles(html, styleKey, customStyle);

    // 输出结果
    console.log(styledHtml);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

// 导出函数供测试使用
module.exports = {
  applyInlineStyles,
  groupConsecutiveImages,
  createMarkdownIt,
  processMarkdown,
  processImages,
  convertLocalImageToBase64,
  convertRemoteImageToBase64,
  detectMimeType
};
