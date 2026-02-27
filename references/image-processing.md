# Image Processing Guide

This guide explains automatic image conversion to Base64 for WeChat compatibility.

## Overview

Images in Markdown are automatically converted to Base64 data URIs during HTML generation. This ensures images display correctly in WeChat's editor, which doesn't support external image references (except from WeChat's own material library).

## How Image Processing Works

### Supported Image Types

- ✅ **Local images** (e.g., `./images/photo.jpg`) - Automatically read and converted to Base64
- ✅ **Remote images** (e.g., `https://example.com/img.jpg`) - Downloaded and converted to Base64
- ✅ **WeChat material URLs** - Preserved as-is (detected automatically when URL contains `mp.weixin.qq.com`)
- ⚠️ **Error handling** - If conversion fails, original reference is preserved with a warning to stderr

### Image Format Support

The following image formats are automatically detected and converted:

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)
- BMP (.bmp)
- TIFF (.tiff)
- ICO (.ico)

### Default Constraints

- **Maximum image size**: 5MB (configurable with `--max-image-size`)
- **Network timeout**: 10 seconds (configurable with `--image-timeout`)
- **Error behavior**: Failed conversions preserve original references (warnings output to stderr)

## Command-Line Options

### Disable Automatic Conversion

```bash
node scripts/generate-html.js --file article.md --style wechat-default --no-convert-images
```

Use this when you want to keep original image references (e.g., for testing or when using WeChat material library URLs).

### Set Maximum Image Size

```bash
node scripts/generate-html.js --file article.md --style wechat-default --max-image-size 10
```

Sets the maximum image size in megabytes. Default: 5MB. Images exceeding this limit will be skipped with a warning.

### Set Network Timeout

```bash
node scripts/generate-html.js --file article.md --style wechat-default --image-timeout 30
```

Sets the network timeout for downloading remote images in seconds. Default: 10 seconds.

### Set Base Path for Relative Images

```bash
node scripts/generate-html.js --file article.md --style wechat-default --image-base-path ./images
```

Sets the base directory for resolving relative image paths. Useful when images are stored in a different directory than the markdown file.

## Image Path Resolution

### Local Images

Local image paths are resolved relative to the markdown file location:

```markdown
# If markdown file is at: /docs/article.md
# And image reference is: ![photo](./images/photo.jpg)
# The image will be resolved from: /docs/images/photo.jpg
```

You can override this behavior with `--image-base-path`:

```bash
# Resolve images from specific directory
node scripts/generate-html.js --file article.md --image-base-path /path/to/images
```

### Remote Images

Remote images (http/https URLs) are automatically downloaded:

```markdown
![Remote Image](https://example.com/image.png)
```

**Note**: Some websites may block downloads due to CORS or hotlinking protection. In such cases, the original URL is preserved with a warning.

## Error Handling

### File Not Found

**Warning**: `Warning: Image file not found: ./images/photo.jpg (resolved: /full/path/to/images/photo.jpg)`

**Solution**: Check that the image path is correct relative to the markdown file location, or use `--image-base-path` to specify the correct base directory.

### Download Failed

**Warning**: `Warning: Failed to download image: https://example.com/img.jpg (HTTP 404)`

**Solution**: Verify the URL is accessible. Try opening it in a browser first.

### Image Too Large

**Warning**: `Warning: Image exceeds maximum size (8.5MB > 5MB): ./images/large-photo.jpg`

**Solution**: Either compress the image or increase the limit with `--max-image-size`.

### Network Timeout

**Warning**: `Warning: Image download timeout (10000ms): https://slow-server.com/img.jpg`

**Solution**: Increase timeout with `--image-timeout 30` or check your network connection.

## Best Practices

1. **Optimize images before using** - Compress images to reduce file size and improve processing speed
2. **Use WeChat material library when possible** - URLs from `mp.weixin.qq.com` are preserved as-is and don't need conversion
3. **Test image accessibility** - Ensure remote images are publicly accessible
4. **Check stderr warnings** - Review conversion warnings to identify problematic images
5. **Use relative paths for local images** - Makes the markdown more portable

## Troubleshooting

### Images not displaying in WeChat

- Check if `--no-convert-images` was used (remove it to enable conversion)
- Verify images were successfully converted (no warnings in stderr)
- Try opening the generated HTML in a browser to verify images display

### Large number of images causing slow processing

- Consider using `--max-image-size` to skip very large images
- Compress images before including them in markdown
- Use fewer images or link to external galleries

### Memory issues with many images

- Process articles with fewer images at a time
- Increase available memory if running as a script
- Consider using WeChat material library URLs instead of embedding
