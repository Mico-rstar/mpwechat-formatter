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
    console.error('       node generate-html.js "markdown-content" --custom-style <path-to-custom-style.json>');
    console.error('');
    console.error('Options:');
    console.error('  --style <style-name>        Use predefined style');
    console.error('  --custom-style <path>       Use custom style from JSON file');
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
  let styleKey = 'wechat-default';
  let customStylePath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--style' && i + 1 < args.length) {
      styleKey = args[i + 1];
      i++;
    } else if (args[i] === '--custom-style' && i + 1 < args.length) {
      customStylePath = args[i + 1];
      i++;
    } else if (!args[i].startsWith('-')) {
      markdown = args[i];
    }
  }

  // 如果 markdown 为空，从 stdin 读取
  if (!markdown) {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => {
      processMarkdown(data, styleKey, customStylePath);
    });
  } else {
    processMarkdown(markdown, styleKey, customStylePath);
  }
}

/**
 * 处理 Markdown 并输出 HTML
 */
function processMarkdown(markdown, styleKey, customStylePath = null) {
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
  processMarkdown
};
