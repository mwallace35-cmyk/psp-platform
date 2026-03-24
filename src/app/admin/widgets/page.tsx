"use client";

import { useEffect, useState } from "react";
import { getAllWidgets, type WidgetConfig } from "@/lib/data";

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const data = await getAllWidgets();
        setWidgets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load widgets");
      } finally {
        setLoading(false);
      }
    };

    loadWidgets();
  }, []);

  if (loading) {
    return (
      <div
        className="p-8 rounded-lg text-center"
        style={{ background: "var(--psp-navy-mid)" }}
      >
        <p className="text-gray-300">Loading widgets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-8 rounded-lg text-center border border-red-500/30 bg-red-500/10"
      >
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Embeddable Widgets</h1>
        <p className="text-gray-300 mt-2">
          Create and manage embeddable widgets for schools
        </p>
      </div>

      {widgets.length === 0 ? (
        <div
          className="p-8 rounded-lg text-center"
          style={{ background: "var(--psp-navy-mid)" }}
        >
          <p className="text-gray-300">No widgets created yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="p-6 rounded-lg border"
              style={{
                background: "var(--psp-navy-mid)",
                borderColor: "var(--psp-navy)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-white capitalize">
                    {widget.widget_type} Widget
                  </h2>
                  <p className="text-sm text-gray-300 mt-1">
                    School ID: {widget.school_id} • Views: {widget.views}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Copy embed code to clipboard
                    const embedCode = `<iframe src="${process.env.NEXT_PUBLIC_SITE_URL}/api/widgets/${widget.embed_key}" width="100%" height="400" frameborder="0"></iframe>`;
                    navigator.clipboard.writeText(embedCode);
                    alert("Embed code copied to clipboard!");
                  }}
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    background: "var(--psp-gold)",
                    color: "var(--psp-navy)",
                  }}
                >
                  Copy Embed Code
                </button>
              </div>

              <div className="p-3 rounded bg-black/20 font-mono text-xs text-gray-300 overflow-auto">
                &lt;iframe src="{process.env.NEXT_PUBLIC_SITE_URL}/api/widgets/
                {widget.embed_key}" width="100%" height="400" frameborder="0"&gt;&lt;/iframe&gt;
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
