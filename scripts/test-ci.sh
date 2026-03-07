#!/bin/bash

# CI Testing Script
# Runs vitest tests and performs type checking
# Exit codes:
#   0 = all tests passed and type checking passed
#   1 = tests failed
#   2 = type checking failed

set -e

echo "============================================"
echo "Running Tests..."
echo "============================================"

# Run vitest tests
if npm run test; then
  echo ""
  echo "✓ Tests passed"
else
  echo ""
  echo "✗ Tests failed"
  exit 1
fi

echo ""
echo "============================================"
echo "Running TypeScript Type Checking..."
echo "============================================"

# Run TypeScript type checking
if npx tsc --noEmit; then
  echo ""
  echo "✓ Type checking passed"
else
  echo ""
  echo "✗ Type checking failed"
  exit 2
fi

echo ""
echo "============================================"
echo "CI Checks Complete"
echo "============================================"
echo "✓ All tests passed"
echo "✓ Type checking passed"
echo ""
echo "Note: To enable coverage reporting, install:"
echo "  npm install --save-dev @vitest/coverage-v8"
echo "Then run: npm run test -- --coverage"
exit 0
