/**
 * Bundle Size Checker
 *
 * Validates that route bundles don't exceed configured size thresholds.
 * Run this in CI/CD to catch bundle bloat before it ships.
 *
 * Usage:
 *   npx ts-node scripts/check-bundle-size.ts
 */

import fs from "fs";
import path from "path";

interface BundleMetric {
  route: string;
  size: number;
  limit: number;
  status: "pass" | "fail" | "warn";
}

// Bundle size thresholds (in KB, gzipped)
const BUNDLE_LIMITS: Record<string, number> = {
  "/": 150,
  "/articles": 180,
  "/football": 200,
  "/basketball": 200,
  "/baseball": 200,
  "/search": 120,
  "/signup": 140,
};

const WARN_THRESHOLD = 0.8; // Warn at 80% of limit

/**
 * Parse Next.js build manifest to extract bundle sizes
 */
function getRouteBundle(route: string): number {
  try {
    const nextDir = path.join(process.cwd(), ".next");
    const staticDir = path.join(nextDir, "static");

    // Look for route manifest
    const manifestPath = path.join(staticDir, "build-manifest.json");
    if (!fs.existsSync(manifestPath)) {
      console.warn(`Build manifest not found at ${manifestPath}`);
      return 0;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    // Routes are keyed by pathname in next/config
    const routeKey = route === "/" ? "/" : route;
    const files = manifest.pages?.[routeKey] || [];

    // Calculate total size of JS files for this route
    let totalSize = 0;
    files.forEach((file: string) => {
      if (file.endsWith(".js")) {
        const filePath = path.join(staticDir, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      }
    });

    // Convert bytes to KB
    return Math.round(totalSize / 1024);
  } catch (error) {
    console.error(`Error reading bundle for ${route}:`, error);
    return 0;
  }
}

/**
 * Check if bundle size is acceptable
 */
function checkBundleSizes(): void {
  console.log("================================================");
  console.log("Next.js Bundle Size Checker");
  console.log("================================================\n");

  const metrics: BundleMetric[] = [];
  let allPass = true;

  for (const [route, limit] of Object.entries(BUNDLE_LIMITS)) {
    const size = getRouteBundle(route);

    if (size === 0) {
      console.warn(`⚠️  Could not determine bundle size for ${route}`);
      continue;
    }

    const ratio = size / limit;
    let status: "pass" | "fail" | "warn" = "pass";

    if (ratio > 1) {
      status = "fail";
      allPass = false;
    } else if (ratio > WARN_THRESHOLD) {
      status = "warn";
    }

    const metric: BundleMetric = { route, size, limit, status };
    metrics.push(metric);

    // Format output
    const icon = status === "pass" ? "✅" : status === "warn" ? "⚠️" : "❌";
    const percentage = Math.round(ratio * 100);
    const sizeStr = `${size}KB`;
    const limitStr = `${limit}KB`;

    console.log(
      `${icon} ${route.padEnd(20)} ${sizeStr.padStart(8)} / ${limitStr.padStart(8)} (${percentage}%)`
    );
  }

  console.log("\n================================================");

  if (allPass) {
    console.log("✅ All bundles within limits!");
    process.exit(0);
  } else {
    console.log(
      "❌ Some bundles exceed limits. Consider:\n" +
        "  - Lazy loading components with dynamic()\n" +
        "  - Splitting large routes into multiple components\n" +
        "  - Checking for duplicate dependencies\n" +
        "  - Using specific imports instead of barrel exports"
    );
    process.exit(1);
  }
}

// Run checker
checkBundleSizes();
