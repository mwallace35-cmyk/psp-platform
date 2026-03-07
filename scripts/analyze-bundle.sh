#!/bin/bash

# =============================================================================
# Bundle Analysis Script
# =============================================================================
# Analyzes the Next.js bundle size to identify optimization opportunities
#
# Usage:
#   chmod +x scripts/analyze-bundle.sh
#   ./scripts/analyze-bundle.sh
#
# This will:
# 1. Run a production build with bundle analysis enabled
# 2. Generate reports in .next/analyze/
# 3. Display bundle composition and potential issues
# =============================================================================

set -e

echo "================================================"
echo "PhillySportsPack Bundle Analysis"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Cleaning previous builds...${NC}"
rm -rf .next/analyze 2>/dev/null || true

echo -e "${BLUE}Step 2: Building with bundle analyzer enabled...${NC}"
ANALYZE=true npm run build

echo ""
echo -e "${GREEN}Build complete!${NC}"
echo ""
echo -e "${BLUE}Analysis reports generated in .next/analyze/${NC}"
echo ""

# Check if reports exist
if [ -f ".next/analyze/client.html" ] || [ -f ".next/analyze/server.html" ]; then
  echo -e "${GREEN}Reports available:${NC}"
  [ -f ".next/analyze/client.html" ] && echo "  - Client bundle: .next/analyze/client.html"
  [ -f ".next/analyze/server.html" ] && echo "  - Server bundle: .next/analyze/server.html"
  echo ""
  echo -e "${YELLOW}Next steps:${NC}"
  echo "  1. Open the HTML reports in your browser to visualize bundle composition"
  echo "  2. Look for large dependencies that can be lazy loaded"
  echo "  3. Check for duplicate modules across bundles"
  echo "  4. Identify unused exports and refactor imports"
else
  echo -e "${RED}Warning: Bundle analysis reports not found${NC}"
  echo "Ensure @next/bundle-analyzer is installed as a dev dependency"
fi

echo ""
echo -e "${BLUE}Tips for optimization:${NC}"
echo "  - Use dynamic() for components not needed on initial load"
echo "  - Prefer specific imports: import { x } from '@/lib/module'"
echo "  - Avoid importing entire barrel files when possible"
echo "  - Check for server-only code in client bundles"
echo ""
