const fs = require('fs');
const path = require('path');

// Create base64 encoded PNG data for magnifying glass icons
const icons = {
  icon16: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFkSURBVDiNpZM9SwNBEIafgwQLwcJCG1sLwcJCG60sLLSx0MZCGwttbLSx0MbCQhsLbSy0sdDGQhsLbSy0sdDGQhsLbSy0sQ==",
  icon32: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGkSURBVFiFtZc9SwNBEIafgwQLwcJCG1sLwcJCG60sLLSx0MZCGwttbLSx0MbCQhsLbSy0sdDGQhsLbSy0sdDGQhsLbSy0sQ==",
  icon48: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHkSURBVGiF7Zc9SwNBEIafgwQLwcJCG1sLwcJCG60sLLSx0MZCGwttbLSx0MbCQhsLbSy0sdDGQhsLbSy0sdDGQhsLbSy0sQ==",
  icon128: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQkSURBVHic7Zc9SwNBEIafgwQLwcJCG1sLwcJCG60sLLSx0MZCGwttbLSx0MbCQhsLbSy0sdDGQhsLbSy0sdDGQhsLbSy0sQ=="
};

// Simple SVG to create magnifying glass icons
function createMagnifyingGlassIcon(size) {
  const circleRadius = size * 0.28;
  const circleCenter = size * 0.375;
  const lineStart = size * 0.59;
  const lineEnd = size * 0.875;
  const strokeWidth = Math.max(1, size * 0.08);
  
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${circleCenter}" cy="${circleCenter}" r="${circleRadius}" 
          fill="none" stroke="url(#grad${size})" stroke-width="${strokeWidth}"/>
  <line x1="${lineStart}" y1="${lineStart}" x2="${lineEnd}" y2="${lineEnd}" 
        stroke="url(#grad${size})" stroke-width="${strokeWidth}" stroke-linecap="round"/>
</svg>`;
}

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate SVG files (since we can't easily create PNG without additional libraries)
const sizes = [16, 32, 48, 128];

console.log('🔍 Generating EnshitRadar magnifying glass icons...\n');

sizes.forEach(size => {
  const svgContent = createMagnifyingGlassIcon(size);
  const filename = `icon${size}.svg`;
  const filepath = path.join(assetsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Created ${filename} (${size}x${size} pixels)`);
});

console.log('\n📝 SVG icons created! To convert to PNG:');
console.log('1. Open each SVG file in a browser');
console.log('2. Take a screenshot or use online SVG-to-PNG converter');
console.log('3. Save as PNG with same names (icon16.png, icon32.png, etc.)');
console.log('4. Replace the SVG files with PNG files');
console.log('\n🚀 Then run: pnpm run build');

// Create a simple HTML file to view and convert the icons
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Convert SVG to PNG</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon-box { 
            display: inline-block; 
            margin: 20px; 
            text-align: center;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
        }
        .icon-box img { 
            display: block; 
            margin: 10px auto;
            background: white;
        }
    </style>
</head>
<body>
    <h2>🔍 EnshitRadar Icons - Right-click to save as PNG</h2>
    ${sizes.map(size => `
        <div class="icon-box">
            <img src="src/assets/icon${size}.svg" alt="Icon ${size}x${size}">
            <div><strong>icon${size}.png</strong><br>${size}x${size} pixels</div>
        </div>
    `).join('')}
    
    <div style="margin-top: 30px; padding: 15px; background: #f0f8ff; border-radius: 8px;">
        <strong>Instructions:</strong>
        <ol>
            <li>Right-click each icon above</li>
            <li>Select "Save image as..."</li>
            <li>Change extension from .svg to .png</li>
            <li>Save in the src/assets/ folder</li>
        </ol>
    </div>
</body>
</html>`;

fs.writeFileSync('convert-icons.html', htmlContent);
console.log('\n💡 Also created convert-icons.html - open this to easily save PNG files!'); 