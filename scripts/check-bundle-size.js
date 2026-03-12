#!/usr/bin/env node

/**
 * Bundle size checker for Next.js
 * Warns if any page bundle exceeds 300KB (gzipped estimate)
 * Fails builds if total size is too large
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BUNDLE_LIMIT_KB = 300;
const TOTAL_LIMIT_MB = 10;

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function getGzipSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(content);
    return gzipped.length;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return 0;
  }
}

function checkBundleSize() {
  const nextBuildDir = path.join(process.cwd(), '.next');

  if (!fs.existsSync(nextBuildDir)) {
    console.error(
      `${colors.red}${colors.bold}✗ Error: .next directory not found${colors.reset}`
    );
    console.error('  Run "npm run build" first');
    process.exit(1);
  }

  const staticDir = path.join(nextBuildDir, 'static', 'chunks');
  if (!fs.existsSync(staticDir)) {
    console.error(`${colors.red}${colors.bold}✗ Error: No chunks found${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.cyan}${colors.bold}📦 Bundle Size Analysis${colors.reset}\n`);

  const chunks = fs.readdirSync(staticDir).filter((f) => f.endsWith('.js'));
  const bundles = {};
  let totalSize = 0;
  let pageCount = 0;

  // Group chunks by route
  chunks.forEach((chunk) => {
    const gzipSize = getGzipSize(path.join(staticDir, chunk));
    totalSize += gzipSize;

    // Categorize chunks
    if (chunk.includes('main')) {
      bundles['Main'] = (bundles['Main'] || 0) + gzipSize;
    } else if (chunk.includes('pages')) {
      pageCount++;
      const pageName = chunk.split('-')[0] || 'page';
      bundles[`Page: ${pageName}`] = (bundles[`Page: ${pageName}`] || 0) + gzipSize;
    } else if (chunk.includes('middleware')) {
      bundles['Middleware'] = (bundles['Middleware'] || 0) + gzipSize;
    } else {
      bundles['Other'] = (bundles['Other'] || 0) + gzipSize;
    }
  });

  // Display results
  const sortedBundles = Object.entries(bundles).sort((a, b) => b[1] - a[1]);

  let hasWarnings = false;
  let hasErrors = false;

  sortedBundles.forEach(([name, size]) => {
    const sizeKb = size / 1024;
    const percent = ((size / totalSize) * 100).toFixed(1);

    let statusIcon = '✓';
    let statusColor = colors.green;

    if (sizeKb > BUNDLE_LIMIT_KB) {
      statusIcon = '⚠';
      statusColor = colors.yellow;
      hasWarnings = true;
    }

    console.log(
      `  ${statusColor}${statusIcon}${colors.reset} ${name.padEnd(25)} ${formatBytes(size).padStart(12)} (${percent}%)`
    );
  });

  const totalSizeMb = totalSize / (1024 * 1024);

  console.log('\n' + '-'.repeat(60));
  if (totalSizeMb > TOTAL_LIMIT_MB) {
    console.log(
      `  ${colors.red}✗ Total${colors.reset} ${formatBytes(totalSize).padStart(12)} ${colors.red}(exceeds ${TOTAL_LIMIT_MB}MB limit)${colors.reset}`
    );
    hasErrors = true;
  } else {
    console.log(
      `  ${colors.green}✓ Total${colors.reset} ${formatBytes(totalSize).padStart(12)} (${((totalSizeMb / TOTAL_LIMIT_MB) * 100).toFixed(0)}% of limit)`
    );
  }

  console.log(
    `  Files: ${chunks.length} chunks, ~${pageCount} pages\n`
  );

  // Recommendations
  if (hasWarnings) {
    console.log(
      `${colors.yellow}⚠️  Warning: Some bundles exceed ${BUNDLE_LIMIT_KB}KB${colors.reset}`
    );
    console.log('  Recommendations:');
    console.log('  • Use dynamic imports for heavy components');
    console.log('  • Review third-party dependencies');
    console.log('  • Consider code splitting strategies\n');
  }

  if (hasErrors) {
    console.log(
      `${colors.red}${colors.bold}✗ Build failed: Total bundle size exceeds limit${colors.reset}\n`
    );
    process.exit(1);
  }

  if (!hasWarnings && !hasErrors) {
    console.log(`${colors.green}${colors.bold}✓ All bundle sizes within limits!${colors.reset}\n`);
  }
}

// Run the check
checkBundleSize();
