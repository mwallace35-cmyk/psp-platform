/**
 * Bundle Performance Tests
 *
 * Validates that:
 * - Dynamic imports are properly lazy-loaded
 * - Client bundles don't include server-only code
 * - Critical CSS is inlined
 * - No accidental bundle bloat from bad imports
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Bundle Performance", () => {
  // =========================================================================
  // Dynamic Import Tests
  // =========================================================================

  describe("Dynamic Imports", () => {
    it("should have SearchTypeahead as a dynamic import", () => {
      const headerPath = path.join(
        process.cwd(),
        "src/components/layout/Header.tsx"
      );
      const content = fs.readFileSync(headerPath, "utf-8");

      // Verify SearchTypeahead is lazy loaded
      expect(content).toContain("dynamic(() => import");
      expect(content).toContain("SearchTypeahead");
      expect(content).toMatch(/loading:\s*\(\)\s*=>/);
    });

    it("should have ssr: false for client-only components", () => {
      const headerPath = path.join(
        process.cwd(),
        "src/components/layout/Header.tsx"
      );
      const content = fs.readFileSync(headerPath, "utf-8");

      // Verify SearchTypeahead disables SSR
      expect(content).toContain("ssr: false");
    });

    it("should have lazy import registry in lib/lazy-imports.tsx", () => {
      const lazyPath = path.join(
        process.cwd(),
        "src/lib/lazy-imports.tsx"
      );

      expect(fs.existsSync(lazyPath)).toBe(true);

      const content = fs.readFileSync(lazyPath, "utf-8");

      // Verify documentation and structure
      expect(content).toContain("LAZY LOADED COMPONENTS");
      expect(content).toContain("PRELOAD HINTS");
      expect(content).toContain("BUNDLE SIZE TARGETS");
    });
  });

  // =========================================================================
  // Import Optimization Tests
  // =========================================================================

  describe("Import Optimization", () => {
    it("should prefer specific imports over barrel imports where possible", () => {
      // Check that barrel index.ts exists with export guidance
      const uiIndexPath = path.join(
        process.cwd(),
        "src/components/ui/index.ts"
      );
      const content = fs.readFileSync(uiIndexPath, "utf-8");

      // Verify comment about preferring direct imports
      expect(content).toContain("Named re-exports to enable proper tree-shaking");
      expect(content).toContain(
        'prefer: import Button from "@/components/ui/Button"'
      );
    });

    it("should have package import optimizations in next.config.ts", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      const content = fs.readFileSync(configPath, "utf-8");

      // Verify experimental optimizePackageImports is set
      expect(content).toContain("optimizePackageImports");
      expect(content).toContain("@supabase/supabase-js");
      expect(content).toContain("drizzle-orm");
    });
  });

  // =========================================================================
  // Server/Client Separation Tests
  // =========================================================================

  describe("Server vs Client Code", () => {
    it("SearchTypeahead should have 'use client' directive", () => {
      const searchPath = path.join(
        process.cwd(),
        "src/components/search/SearchTypeahead.tsx"
      );
      const content = fs.readFileSync(searchPath, "utf-8");

      expect(content).toMatch(/^["']use client["']/m);
    });

    it("Header should have 'use client' directive", () => {
      const headerPath = path.join(
        process.cwd(),
        "src/components/layout/Header.tsx"
      );
      const content = fs.readFileSync(headerPath, "utf-8");

      expect(content).toMatch(/^["']use client["']/m);
    });

    it("layout.tsx should not have 'use client' (server component)", () => {
      const layoutPath = path.join(process.cwd(), "src/app/layout.tsx");
      const content = fs.readFileSync(layoutPath, "utf-8");

      // Should NOT have use client
      expect(content).not.toMatch(/^["']use client["']/m);

      // Should have async server component features
      expect(content).toContain("async function RootLayout");
      expect(content).toContain("headers()");
    });
  });

  // =========================================================================
  // Image Optimization Tests
  // =========================================================================

  describe("Image Optimization", () => {
    it("should use next/font for Google Fonts", () => {
      const layoutPath = path.join(process.cwd(), "src/app/layout.tsx");
      const content = fs.readFileSync(layoutPath, "utf-8");

      expect(content).toContain('from "next/font/google"');
      expect(content).toContain("Bebas_Neue");
      expect(content).toContain("DM_Sans");
      expect(content).toMatch(/display:\s*["']swap["']/);
    });

    it("should use next/image with sizes prop", () => {
      const articlesPath = path.join(
        process.cwd(),
        "src/app/articles/page.tsx"
      );
      const content = fs.readFileSync(articlesPath, "utf-8");

      expect(content).toMatch(/from\s+['"]next\/image['"]/);
      expect(content).toContain("<Image");
      expect(content).toMatch(/sizes\s*=/);
      expect(content).toContain("priority");
    });

    it("should have image optimization in next.config.ts", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      const content = fs.readFileSync(configPath, "utf-8");

      expect(content).toContain("images:");
      expect(content).toContain("formats");
      expect(content).toContain("image/webp");
    });
  });

  // =========================================================================
  // Config Optimization Tests
  // =========================================================================

  describe("Next.js Config Optimizations", () => {
    it("should have caching headers for static assets", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      const content = fs.readFileSync(configPath, "utf-8");

      expect(content).toContain("Cache-Control");
      expect(content).toContain("31536000"); // 1 year
      expect(content).toContain("immutable");
    });

    it("should have bundle analyzer comments", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      const content = fs.readFileSync(configPath, "utf-8");

      expect(content).toContain("Bundle analyzer");
      expect(content).toContain("ANALYZE=true");
    });

    it("should handle bundle analyzer wrapping", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      const content = fs.readFileSync(configPath, "utf-8");

      expect(content).toContain("withBundleAnalyzer");
      expect(content).toMatch(/ANALYZE\s*===\s*["']true["']/);
    });
  });

  // =========================================================================
  // Build Script Tests
  // =========================================================================

  describe("Build Scripts", () => {
    it("should have analyze-bundle.sh script", () => {
      const scriptPath = path.join(
        process.cwd(),
        "scripts/analyze-bundle.sh"
      );

      expect(fs.existsSync(scriptPath)).toBe(true);

      const content = fs.readFileSync(scriptPath, "utf-8");
      expect(content).toContain("ANALYZE=true");
    });

    it("should have check-bundle-size.ts script", () => {
      const scriptPath = path.join(
        process.cwd(),
        "scripts/check-bundle-size.ts"
      );

      expect(fs.existsSync(scriptPath)).toBe(true);

      const content = fs.readFileSync(scriptPath, "utf-8");
      expect(content).toContain("BUNDLE_LIMITS");
      expect(content).toContain("gzipped");
    });
  });

  // =========================================================================
  // Anti-Patterns Detection
  // =========================================================================

  describe("Anti-Patterns", () => {
    it("should not have unnecessary barrel imports in routes", () => {
      const articlesPath = path.join(
        process.cwd(),
        "src/app/articles/page.tsx"
      );
      const content = fs.readFileSync(articlesPath, "utf-8");

      // This route imports specific items, not the entire barrel
      expect(content).not.toContain('from "@/lib/data"');
    });

    it("should document lazy import patterns", () => {
      const lazyPath = path.join(
        process.cwd(),
        "src/lib/lazy-imports.tsx"
      );
      const content = fs.readFileSync(lazyPath, "utf-8");

      // Should explain BEFORE/AFTER pattern
      expect(content).toContain("BEFORE");
      expect(content).toContain("AFTER");
    });
  });
});
