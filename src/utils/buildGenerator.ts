import { WebsiteConfig } from '../types/website';
import JSZip from 'jszip';

export const generateBuild = async (config: WebsiteConfig, pageId?: string): Promise<Blob> => {
  const zip = new JSZip();
  
  // Create HTML file
  const htmlContent = generateHTML(config, pageId);
  zip.file('index.html', htmlContent);
  
  // Create CSS file
  const cssContent = generateCSS(config);
  zip.file('styles.css', cssContent);
  
  // Create a simple JavaScript file for interactivity
  const jsContent = generateJS();
  zip.file('script.js', jsContent);
  
  // Generate the zip file
  return await zip.generateAsync({ type: 'blob' });
};

const generateHTML = (config: WebsiteConfig, pageId?: string): string => {
  const { content, style } = config;
  
  // If pageId is provided, only include that page
  const pages = pageId 
    ? { [pageId]: content.pages[pageId] }
    : content.pages;

  const pageContent = Object.entries(pages).map(([id, page]) => `
    <div class="page" id="${id}">
      <h1>${page.title}</h1>
      <div class="content">
        ${page.content}
      </div>
      ${Object.entries(page.images).map(([imageId, image]) => 
        image.src ? `<img src="${image.src}" alt="${image.alt}" style="width: ${image.width}px; height: ${image.height}px;" />` : ''
      ).join('')}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageId ? content.pages[pageId].title : 'Website'}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=${style.typography.fontFamily.replace(/\s+/g, '+')}&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        ${pageContent}
    </div>
    <script src="script.js"></script>
</body>
</html>`;
};

const generateCSS = (config: WebsiteConfig): string => {
  const { style } = config;
  return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: ${style.typography.fontFamily};
    font-size: ${style.typography.fontSize};
    background-color: ${style.colors.background};
    color: ${style.colors.text};
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: ${style.spacing.padding};
}

h1 {
    color: ${style.colors.primary};
    margin-bottom: ${style.spacing.margin};
}

.content {
    padding: ${style.spacing.padding};
}`;
};

const generateJS = (): string => {
  return `// Add any necessary JavaScript here
console.log('Website loaded successfully');`;
}; 