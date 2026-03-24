"use client";

import { useState, useRef } from "react";

type ImportStep = "upload" | "configure" | "preview" | "confirm" | "complete";

interface ParsedRecord {
  id: number;
  data: Record<string, string | number | null>;
  warnings: string[];
  approved: boolean;
}

const SUPPORTED_TYPES = [
  { ext: ".csv", label: "CSV", mime: "text/csv" },
  { ext: ".json", label: "JSON", mime: "application/json" },
  { ext: ".xlsx", label: "Excel", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { ext: ".html", label: "HTML", mime: "text/html" },
];

const SPORT_OPTIONS = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "baseball", label: "Baseball" },
  { value: "track-field", label: "Track & Field" },
  { value: "lacrosse", label: "Lacrosse" },
  { value: "wrestling", label: "Wrestling" },
  { value: "soccer", label: "Soccer" },
];

const PARSER_OPTIONS = [
  { value: "player-stats", label: "Player Statistics" },
  { value: "team-records", label: "Team Win-Loss Records" },
  { value: "championships", label: "Championships" },
  { value: "awards", label: "Awards / All-City / All-State" },
  { value: "rosters", label: "Rosters" },
  { value: "standings", label: "Standings" },
  { value: "generic", label: "Generic (auto-detect)" },
];

export default function ImportWizard() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [sport, setSport] = useState("football");
  const [parserType, setParserType] = useState("generic");
  const [records, setRecords] = useState<ParsedRecord[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ inserted: number; skipped: number; errors: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setStep("configure");
    }
  }

  async function handleParse() {
    if (!file) return;

    // In a real implementation, this would call an API route that parses the file
    // For now, simulate parsed records
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());

    // Simple CSV parser for demonstration
    if (file.name.endsWith(".csv") && lines.length > 1) {
      const headers = lines[0].split(",").map((h) => h.trim());
      const parsed: ParsedRecord[] = lines.slice(1).map((line, i) => {
        const vals = line.split(",").map((v) => v.trim());
        const data: Record<string, string | number | null> = {};
        headers.forEach((h, j) => {
          data[h] = vals[j] || null;
        });
        return {
          id: i + 1,
          data,
          warnings: [],
          approved: true,
        };
      });
      setRecords(parsed);
    } else {
      // For non-CSV files, show placeholder
      setRecords([
        {
          id: 1,
          data: { file: file.name, type: file.type, size: `${(file.size / 1024).toFixed(1)} KB` },
          warnings: ["Parser for this file type will be implemented with Supabase connection"],
          approved: true,
        },
      ]);
    }

    setStep("preview");
  }

  function toggleRecord(id: number) {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  }

  function toggleAll(approved: boolean) {
    setRecords((prev) => prev.map((r) => ({ ...r, approved })));
  }

  async function handleImport() {
    setImporting(true);
    const approvedRecords = records.filter((r) => r.approved);

    // In a real implementation, this would call an API route to insert into Supabase
    // Simulate import
    await new Promise((r) => setTimeout(r, 1500));

    setImportResult({
      inserted: approvedRecords.length,
      skipped: records.length - approvedRecords.length,
      errors: 0,
    });
    setStep("complete");
    setImporting(false);
  }

  function resetWizard() {
    setFile(null);
    setStep("upload");
    setRecords([]);
    setImportResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const approvedCount = records.filter((r) => r.approved).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
          Import Wizard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--psp-gray-500)" }}>
          Upload and import data files into the database
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(["upload", "configure", "preview", "confirm", "complete"] as ImportStep[]).map(
          (s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s
                    ? "text-white"
                    : (["upload", "configure", "preview", "confirm", "complete"].indexOf(step) > i)
                    ? "text-white"
                    : "text-gray-300 bg-gray-200"
                }`}
                style={
                  step === s
                    ? { background: "var(--psp-gold)", color: "var(--psp-navy)" }
                    : ["upload", "configure", "preview", "confirm", "complete"].indexOf(step) > i
                    ? { background: "var(--psp-navy)" }
                    : {}
                }
              >
                {i + 1}
              </div>
              <span className="text-xs font-medium capitalize hidden sm:inline" style={{ color: step === s ? "var(--psp-navy)" : "var(--psp-gray-400)" }}>
                {s}
              </span>
              {i < 4 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          )
        )}
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <div className="admin-card text-center py-16">
          <div className="text-5xl mb-4">📁</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
            Select a file to import
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--psp-gray-500)" }}>
            Supported formats: {SUPPORTED_TYPES.map((t) => t.label).join(", ")}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept={SUPPORTED_TYPES.map((t) => t.ext).join(",")}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button onClick={() => fileRef.current?.click()} className="btn-primary text-lg px-8 py-3">
            Choose File
          </button>
        </div>
      )}

      {/* Step: Configure */}
      {step === "configure" && file && (
        <div className="admin-card">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--psp-navy)" }}>
            Configure Import
          </h2>

          <div className="p-4 rounded-lg mb-6" style={{ background: "var(--psp-gray-50)" }}>
            <div className="text-sm">
              <strong>File:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--psp-gray-700)" }}>
                Sport
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="filter-select w-full"
              >
                {SPORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--psp-gray-700)" }}>
                Data Type
              </label>
              <select
                value={parserType}
                onChange={(e) => setParserType(e.target.value)}
                className="filter-select w-full"
              >
                {PARSER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("upload")} className="btn-outline">
              Back
            </button>
            <button onClick={handleParse} className="btn-primary">
              Parse File &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: "var(--psp-navy)" }}>
              Preview Records
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                {approvedCount} of {records.length} selected
              </span>
              <button onClick={() => toggleAll(true)} className="btn-outline text-xs px-2 py-1">
                Select All
              </button>
              <button onClick={() => toggleAll(false)} className="btn-outline text-xs px-2 py-1">
                Deselect All
              </button>
            </div>
          </div>

          {records.length > 0 && (
            <div className="overflow-x-auto mb-6">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-12">✓</th>
                    <th>#</th>
                    {Object.keys(records[0].data).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                    <th>Warnings</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 50).map((record) => (
                    <tr
                      key={record.id}
                      className={!record.approved ? "opacity-40" : ""}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={record.approved}
                          onChange={() => toggleRecord(record.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="font-mono text-xs">{record.id}</td>
                      {Object.values(record.data).map((val, i) => (
                        <td key={i}>{val?.toString() || "—"}</td>
                      ))}
                      <td>
                        {record.warnings.length > 0 && (
                          <span className="admin-badge badge-warning">
                            {record.warnings.length} warning{record.warnings.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {records.length > 50 && (
                <p className="text-sm text-center mt-4" style={{ color: "var(--psp-gray-400)" }}>
                  Showing first 50 of {records.length} records
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep("configure")} className="btn-outline">
              Back
            </button>
            <button
              onClick={() => setStep("confirm")}
              disabled={approvedCount === 0}
              className="btn-primary"
            >
              Continue ({approvedCount} records) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && (
        <div className="admin-card text-center py-12">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
            Ready to Import
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--psp-gray-500)" }}>
            <strong>{approvedCount}</strong> records will be imported into{" "}
            <strong>{sport}</strong> as <strong>{parserType}</strong> data.
            <br />
            {records.length - approvedCount > 0 &&
              `${records.length - approvedCount} records will be skipped.`}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setStep("preview")} className="btn-outline">
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn-secondary text-lg px-8 py-3"
            >
              {importing ? "Importing..." : "Import Now"}
            </button>
          </div>
        </div>
      )}

      {/* Step: Complete */}
      {step === "complete" && importResult && (
        <div className="admin-card text-center py-12">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
            Import Complete
          </h2>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
            <div>
              <div className="admin-stat text-green-600">{importResult.inserted}</div>
              <div className="text-xs" style={{ color: "var(--psp-gray-500)" }}>Inserted</div>
            </div>
            <div>
              <div className="admin-stat text-yellow-600">{importResult.skipped}</div>
              <div className="text-xs" style={{ color: "var(--psp-gray-500)" }}>Skipped</div>
            </div>
            <div>
              <div className="admin-stat text-red-600">{importResult.errors}</div>
              <div className="text-xs" style={{ color: "var(--psp-gray-500)" }}>Errors</div>
            </div>
          </div>
          <button onClick={resetWizard} className="btn-primary">
            Import Another File
          </button>
        </div>
      )}
    </div>
  );
}
