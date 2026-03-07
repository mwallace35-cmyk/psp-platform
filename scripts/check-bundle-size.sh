#!/bin/bash

# =============================================================================
# Bundle Size Checker Script
# =============================================================================
# Enforces bundle size limits for production builds
#
# Usage:
#   chmod +x scripts/check-bundle-size.sh
#   npm run check-bundle
#   ./scripts/check-bundle-size.sh
#
# This script:
# 1. Runs a production build with bundle analysis
# 2. Parses bundle sizes from the build output
# 3. Compares against defined thresholds
# 4. Exits with error code 1 if limits exceeded
# 5. Provides detailed output with actionable suggestions
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Bundle size limits (in KB, gzipped)
MAIN_JS_LIMIT=150
ROUTE_CHUNK_LIMIT=50
CSS_LIMIT=30

# Initialize counters
FAILED=0
PASSED=0

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}PhillySportsPack Bundle Size Check${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Step 1: Clean previous builds
echo -e "${BLUE}Step 1: Cleaning previous builds...${NC}"
rm -rf .next 2>/dev/null || true
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 2: Run production build
echo -e "${BLUE}Step 2: Running production build...${NC}"
npm run build > /dev/null 2>&1
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Step 3: Extract bundle sizes from .next/static
echo -e "${BLUE}Step 3: Analyzing bundle sizes...${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Track any files that exceed limits
EXCEEDED_FILES=()

# Check JavaScript files in .next/static/chunks
if [ -d ".next/static/chunks" ]; then
  for file in .next/static/chunks/*.js; do
    if [ -f "$file" ]; then
      # Get file size in bytes, convert to KB
      size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
      size_kb=$(echo "scale=2; $size_bytes / 1024" | bc)
      filename=$(basename "$file")

      # Determine limit based on filename
      if [[ "$filename" == "main"* ]]; then
        limit=$MAIN_JS_LIMIT
        bundle_type="Main JS"
      else
        limit=$ROUTE_CHUNK_LIMIT
        bundle_type="Route Chunk"
      fi

      # Compare against limit
      if (( $(echo "$size_kb > $limit" | bc -l) )); then
        echo -e "${RED}✗ FAIL${NC} $filename (${bundle_type})"
        echo -e "  Size: ${RED}${size_kb} KB${NC} / Limit: ${YELLOW}${limit} KB${NC}"
        echo -e "  ${RED}Exceeds limit by $(echo "scale=2; $size_kb - $limit" | bc) KB${NC}"
        EXCEEDED_FILES+=("$filename")
        ((FAILED++))
      else
        echo -e "${GREEN}✓ PASS${NC} $filename (${bundle_type})"
        echo -e "  Size: ${GREEN}${size_kb} KB${NC} / Limit: ${limit} KB"
        ((PASSED++))
      fi
      echo ""
    fi
  done
else
  echo -e "${YELLOW}⚠ No JavaScript chunks found${NC}"
fi

# Check CSS files in .next/static
if [ -d ".next/static" ]; then
  for file in $(find .next/static -name "*.css" 2>/dev/null); do
    if [ -f "$file" ]; then
      size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
      size_kb=$(echo "scale=2; $size_bytes / 1024" | bc)
      filename=$(basename "$file")

      if (( $(echo "$size_kb > $CSS_LIMIT" | bc -l) )); then
        echo -e "${RED}✗ FAIL${NC} $filename (CSS)"
        echo -e "  Size: ${RED}${size_kb} KB${NC} / Limit: ${YELLOW}${CSS_LIMIT} KB${NC}"
        echo -e "  ${RED}Exceeds limit by $(echo "scale=2; $size_kb - $CSS_LIMIT" | bc) KB${NC}"
        EXCEEDED_FILES+=("$filename")
        ((FAILED++))
      else
        echo -e "${GREEN}✓ PASS${NC} $filename (CSS)"
        echo -e "  Size: ${GREEN}${size_kb} KB${NC} / Limit: ${CSS_LIMIT} KB"
        ((PASSED++))
      fi
      echo ""
    fi
  done
fi

# Step 4: Summary
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
  echo -e "${RED}Bundle size limits exceeded!${NC}"
  echo ""
  echo -e "${YELLOW}Suggestions to reduce bundle size:${NC}"
  echo "1. Use dynamic() imports for components not needed on initial load"
  echo "2. Check for unused dependencies: npm ls --depth=0"
  echo "3. Use specific imports instead of barrel exports"
  echo "4. Enable code splitting in next.config.ts"
  echo "5. Review the bundle analyzer: ANALYZE=true npm run build"
  echo ""
  echo -e "${YELLOW}Files to optimize:${NC}"
  for file in "${EXCEEDED_FILES[@]}"; do
    echo "  - $file"
  done
  echo ""
  exit 1
else
  echo -e "${GREEN}All bundle sizes within limits!${NC}"
  echo ""
  exit 0
fi
