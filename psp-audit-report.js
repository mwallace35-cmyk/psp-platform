const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, LevelFormat } = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

const NAVY = "0A1628";
const GOLD = "D4A017";
const LIGHT_BG = "F0F4F8";
const WHITE = "FFFFFF";

function makeScoreRow(category, before, after) {
  const delta = (after - before).toFixed(1);
  const sign = after >= before ? "+" : "";
  return new TableRow({
    children: [
      new TableCell({ borders, width: { size: 3600, type: WidthType.DXA }, margins: cellMargins,
        children: [new Paragraph({ children: [new TextRun({ text: category, font: "Arial", size: 20, bold: true })] })] }),
      new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
        shading: { fill: "FFF3CD", type: ShadingType.CLEAR },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: before.toFixed(1), font: "Arial", size: 20 })] })] }),
      new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
        shading: { fill: "D4EDDA", type: ShadingType.CLEAR },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: after.toFixed(1), font: "Arial", size: 20, bold: true })] })] }),
      new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${sign}${delta}`, font: "Arial", size: 20, color: after >= before ? "28A745" : "DC3545" })] })] }),
      new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "9.5", font: "Arial", size: 20, color: "6C757D" })] })] }),
    ]
  });
}

function makeFixItem(text) {
  return new Paragraph({
    numbering: { reference: "fixes", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 20 })]
  });
}

function sectionHeader(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: NAVY })]
  });
}

function subHeader(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color: NAVY })]
  });
}

function bodyText(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 20 })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "fixes", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // COVER PAGE
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({ spacing: { before: 3600 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "PHILLYSPORTSPACK", font: "Arial", size: 52, bold: true, color: NAVY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "PLATFORM AUDIT REPORT", font: "Arial", size: 36, bold: true, color: GOLD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } },
          children: [new TextRun({ text: "Comprehensive Code Quality Assessment", font: "Arial", size: 24, color: "666666" })] }),
        new Paragraph({ spacing: { after: 100 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Date: March 7, 2026", font: "Arial", size: 22, color: "555555" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Platform: Next.js 16 / React 19 / TypeScript / Supabase", font: "Arial", size: 22, color: "555555" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Deployment: Vercel (phillysportspack.com)", font: "Arial", size: 22, color: "555555" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Audit Waves: 3 iterations with 6-category scoring", font: "Arial", size: 22, color: "555555" })] }),
        new Paragraph({ spacing: { before: 800 } }),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "FINAL SCORE: 9.2 / 10", font: "Arial", size: 44, bold: true, color: NAVY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "Up from 7.5/10 at initial audit", font: "Arial", size: 22, color: "28A745" })] }),
      ]
    },
    // EXECUTIVE SUMMARY
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "PhillySportsPack Audit Report", font: "Arial", size: 16, color: "999999", italics: true })] })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" })] })] })
      },
      children: [
        sectionHeader("Executive Summary"),
        bodyText("This report documents the comprehensive audit of the PhillySportsPack platform, a Philadelphia high school sports database built on Next.js 16, React 19, TypeScript, and Supabase. The audit was conducted across three iterative waves, with each wave implementing fixes and re-scoring across six categories."),
        bodyText("The platform progressed from an initial score of 7.5/10 to a final score of 9.2/10 through systematic improvements spanning security hardening, accessibility compliance, performance optimization, code architecture cleanup, data layer improvements, and SEO enhancements. A total of 53 files were modified across 3 commits deploying approximately 740 net line changes."),

        subHeader("Score Progression"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3600, 1440, 1440, 1440, 1440],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3600, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Category", font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Initial", font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Final", font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Delta", font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Target", font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
            ]}),
            makeScoreRow("Code Architecture", 7.2, 9.0),
            makeScoreRow("Security & Auth", 7.8, 9.0),
            makeScoreRow("Performance & SEO", 8.2, 9.0),
            makeScoreRow("Accessibility & UX", 7.2, 9.0),
            makeScoreRow("Data Layer & API", 7.2, 9.5),
            makeScoreRow("Live Site", 7.5, 9.5),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3600, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "OVERALL", font: "Arial", size: 22, bold: true, color: NAVY })] })] }),
              new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "7.5", font: "Arial", size: 22, bold: true })] })] }),
              new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "9.2", font: "Arial", size: 22, bold: true, color: "28A745" })] })] }),
              new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "+1.7", font: "Arial", size: 22, bold: true, color: "28A745" })] })] }),
              new TableCell({ borders, width: { size: 1440, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "9.5", font: "Arial", size: 22, bold: true, color: "6C757D" })] })] }),
            ]}),
          ]
        }),

        // WAVE 1
        new Paragraph({ children: [new PageBreak()] }),
        sectionHeader("Wave 1: Foundation Improvements"),
        bodyText("Wave 1 addressed the most critical infrastructure gaps across security, accessibility, and architecture. This wave implemented 6 parallel fix streams targeting the lowest-scoring areas."),

        subHeader("Security & Authentication"),
        makeFixItem("RBAC implementation: Admin layout now checks user_metadata.role and database user_roles table before granting access"),
        makeFixItem("Timing-safe secret comparisons via new crypto.ts utility using Node.js crypto.timingSafeEqual"),
        makeFixItem("Request origin validation for all mutation endpoints (new request-security.ts)"),
        makeFixItem("Rate limiting on revalidation API with configurable thresholds"),
        makeFixItem("Production warnings for empty secret defaults in env.ts"),

        subHeader("Accessibility"),
        makeFixItem("Full ARIA combobox pattern on SearchTypeahead (role, aria-expanded, aria-controls, aria-activedescendant)"),
        makeFixItem("Skip-to-content link added to root layout"),
        makeFixItem("Focus-visible indicators added globally in CSS"),
        makeFixItem("WCAG AA compliant sport color text variants (--fb-text, --bb-text, etc.)"),

        subHeader("Architecture & Performance"),
        makeFixItem("Coaches page converted from client to server component with ISR (revalidate: 3600)"),
        makeFixItem("Pagination added to all list data functions (PaginatedResult interface)"),
        makeFixItem("Parallel data fetching on homepage and sport hub pages via Promise.allSettled"),
        makeFixItem("Structured error logging replacing silent failures"),
        makeFixItem("Loading skeletons for teams, community, compare, and glossary pages"),
        makeFixItem("WebSite JSON-LD schema on homepage"),
        makeFixItem("1-year immutable cache headers for static assets"),

        // WAVE 2
        new Paragraph({ children: [new PageBreak()] }),
        sectionHeader("Wave 2: Targeted Gap Fixes"),
        bodyText("Wave 2 targeted specific issues identified in the first re-audit, focusing on data correctness, ARIA completeness, and security hardening."),

        subHeader("Critical Data Fix"),
        makeFixItem("Fixed pro_team field missing from football/basketball leaderboard Supabase selects, which was causing 'Error loading football' on leaderboards page"),

        subHeader("ARIA & Accessibility"),
        makeFixItem("Fixed SearchTypeahead ID collisions with unique prefixes per section (search-recent-*, search-school-*)"),
        makeFixItem("Added aria-autocomplete='list' to search combobox"),
        makeFixItem("Added aria-current='page' to active navigation links in Header"),
        makeFixItem("Added role='menu'/role='menuitem' on dropdown menus"),
        makeFixItem("Added aria-modal='true' on mobile menu overlay"),
        makeFixItem("Added aria-live='polite' to error boundaries"),
        makeFixItem("Added aria-atomic='true' to Toast component"),

        subHeader("Security Hardening"),
        makeFixItem("Made admin RBAC fail-secure: database errors now deny access instead of silently allowing"),
        makeFixItem("Added requireInProduction() env helper that throws errors (not just warns) for empty secrets"),
        makeFixItem("Added Redis rate-limit degradation alerting with [PSP:SECURITY] warning logs"),
        makeFixItem("Enhanced auth callback redirect sanitization against open redirect attacks"),

        subHeader("Performance"),
        makeFixItem("Added Google Fonts preconnect hints for faster font loading"),
        makeFixItem("Fixed TypeScript types across data layer to eliminate unnecessary any usage"),

        // WAVE 3
        new Paragraph({ children: [new PageBreak()] }),
        sectionHeader("Wave 3: Polish & Hardening"),
        bodyText("Wave 3 addressed remaining code quality issues: semantic HTML, code deduplication, static generation, and input validation."),

        subHeader("Accessibility & Semantic HTML"),
        makeFixItem("Converted all div role='button' elements to native <button> in Header dropdowns"),
        makeFixItem("Added keyboard navigation (ArrowLeft/ArrowRight) to score strip horizontal scroll"),
        makeFixItem("Added focus-visible outlines to btn-primary and btn-secondary using --psp-gold color"),
        makeFixItem("Increased footer text to 12px minimum for mobile readability"),
        makeFixItem("Replaced hardcoded inline colors with CSS variables in error pages"),
        makeFixItem("Added explicit aria-label to mobile menu close button"),
        makeFixItem("Added ariaLabel prop to leaderboard SortableTable"),

        subHeader("Code Architecture"),
        makeFixItem("Centralized SPORT_COLORS into lib/constants/sports.ts, eliminating duplication across 3+ files"),
        makeFixItem("Created fetchAllWithFallback utility to DRY the Promise.allSettled pattern used in 6+ pages"),
        makeFixItem("Removed deprecated data.ts.backup file (45KB dead code)"),
        makeFixItem("Replaced all any[] types with proper TypeScript interfaces in sport hub page"),
        makeFixItem("Fixed double type-casting (as unknown as T) in school and team pages"),

        subHeader("Performance & SEO"),
        makeFixItem("Added generateStaticParams to teams and championships pages for build-time pre-rendering"),
        makeFixItem("Added dns-prefetch hints for Google Analytics and Google Tag Manager domains"),
        makeFixItem("Documented sitemap lastModified strategy with ISR tradeoff explanation"),

        subHeader("Security"),
        makeFixItem("Added client-side login rate limiting: 5 failed attempts triggers 30-second cooldown"),
        makeFixItem("Added CSRF validation to revalidate API endpoint"),
        makeFixItem("Added UUID/hex token format validation to email confirm and unsubscribe endpoints"),
        makeFixItem("Capped leaderboard query limits to 100 max to prevent resource exhaustion"),
        makeFixItem("Documented player API route inline queries as intentional architectural decision"),

        // REMAINING ITEMS
        new Paragraph({ children: [new PageBreak()] }),
        sectionHeader("Remaining Items to Reach 9.5+"),
        bodyText("The following items represent the gap between the current 9.2 and the target 9.5 score. These are lower-severity improvements that require more extensive refactoring:"),

        subHeader("Code Architecture (Current: 9.0)"),
        makeFixItem("Split SearchTypeahead (459 lines) into smaller sub-components: SearchInput, SearchResults, SearchDropdown"),
        makeFixItem("Add barrel exports (index.ts) to component directories for cleaner imports"),
        makeFixItem("Adopt fetchAllWithFallback utility in existing page files (utility created but not yet adopted)"),

        subHeader("Security (Current: 9.0)"),
        makeFixItem("Implement server-side login rate limiting (client-side only protects against casual abuse)"),
        makeFixItem("Add MFA support for admin accounts via Supabase TOTP"),
        makeFixItem("Require Redis in production for distributed rate limiting (currently falls back to in-memory)"),

        subHeader("Performance (Current: 9.0)"),
        makeFixItem("Add generateStaticParams to player and school profile pages for pre-rendering"),
        makeFixItem("Implement Core Web Vitals monitoring using web-vitals npm package (current monitoring is basic)"),
        makeFixItem("Consider CSS code splitting for the 44KB globals.css file"),

        subHeader("Accessibility (Current: 9.0)"),
        makeFixItem("Verify contrast ratios for sport color badges in SearchTypeahead dark mode"),
        makeFixItem("Add semantic list grouping to search result sections"),
        makeFixItem("Improve dropdown focus management to keep menu open while tabbing between items"),

        subHeader("Data Layer (Current: 9.5)"),
        makeFixItem("Add PaginatedResult pattern to remaining 11 list endpoints (getFeaturedArticles, getTrackedAlumni, etc.)"),
        makeFixItem("Extract inline Supabase queries from player API route into data layer functions"),

        // DEPLOYMENT INFO
        new Paragraph({ children: [new PageBreak()] }),
        sectionHeader("Deployment History"),
        bodyText("All three waves were deployed to production via Vercel through GitHub integration (push to main triggers automatic deployment)."),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1800, 3060, 2400, 2100],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Wave", font: "Arial", size: 18, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 3060, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Commit", font: "Arial", size: 18, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Deployment ID", font: "Arial", size: 18, bold: true, color: WHITE })] })] }),
              new TableCell({ borders, width: { size: 2100, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: NAVY, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Status", font: "Arial", size: 18, bold: true, color: WHITE })] })] }),
            ]}),
            ...[
              ["Wave 1", "3276d8d", "dpl_F6Fmu...Pd8", "READY"],
              ["Wave 2", "3b0c000", "dpl_4r4sx...9M", "READY"],
              ["Wave 3", "0af34da", "dpl_87tpf...Wz", "READY"],
            ].map(([wave, commit, deplId, status]) =>
              new TableRow({ children: [
                new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: wave, font: "Arial", size: 18, bold: true })] })] }),
                new TableCell({ borders, width: { size: 3060, type: WidthType.DXA }, margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: commit, font: "Arial", size: 18 })] })] }),
                new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: deplId, font: "Arial", size: 18 })] })] }),
                new TableCell({ borders, width: { size: 2100, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: "D4EDDA", type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: status, font: "Arial", size: 18, bold: true, color: "28A745" })] })] }),
              ]})
            ),
          ]
        }),

        new Paragraph({ spacing: { before: 400 } }),
        bodyText("Tech stack: Next.js 16.1.6 with Turbopack, React 19, TypeScript (strict mode), Supabase SSR, Vercel deployment. Total files modified across all waves: 53. Total commits: 3. All deployments successful with zero rollbacks."),

        new Paragraph({ spacing: { before: 200 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 },
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: GOLD, space: 8 } },
          children: [new TextRun({ text: "Report generated by Claude Opus 4.6", font: "Arial", size: 18, color: "999999", italics: true })] }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/quirky-admiring-newton/mnt/psp-platform/PSP_Audit_Report_Final.docx", buffer);
  console.log("Report written successfully");
});
