"use client";

import { useState, useEffect } from "react";

interface SyncTask {
  id: string;
  name: string;
  sport: string;
  lastRun?: string;
  nextRun?: string;
  status: "idle" | "running" | "error";
  cronExpression: string;
}

interface SyncLog {
  id: string;
  taskId: string;
  timestamp: string;
  recordsFound: number;
  conflictsCreated: number;
  status: "success" | "error";
  message?: string;
}

const DEFAULT_TASKS: SyncTask[] = [
  {
    id: "maxpreps-football",
    name: "MaxPreps Football Data",
    sport: "football",
    status: "idle",
    cronExpression: "0 2 * * *",
  },
  {
    id: "maxpreps-basketball",
    name: "MaxPreps Basketball Data",
    sport: "basketball",
    status: "idle",
    cronExpression: "0 2 * * *",
  },
  {
    id: "maxpreps-baseball",
    name: "MaxPreps Baseball Data",
    sport: "baseball",
    status: "idle",
    cronExpression: "0 2 * * *",
  },
  {
    id: "maxpreps-soccer",
    name: "MaxPreps Soccer Data",
    sport: "soccer",
    status: "idle",
    cronExpression: "0 2 * * *",
  },
];

export default function SyncPage() {
  const [tasks, setTasks] = useState<SyncTask[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingCron, setEditingCron] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("psp-sync-tasks");
    const storedLogs = localStorage.getItem("psp-sync-logs");
    setTasks(stored ? JSON.parse(stored) : DEFAULT_TASKS);
    setLogs(storedLogs ? JSON.parse(storedLogs) : []);
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("psp-sync-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save logs to localStorage
  useEffect(() => {
    localStorage.setItem("psp-sync-logs", JSON.stringify(logs));
  }, [logs]);

  async function runNow(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Update task status to running
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "running" } : t))
    );

    // Simulate API call with delay
    setTimeout(() => {
      const recordsFound = Math.floor(Math.random() * 150) + 50;
      const conflictsCreated = Math.floor(Math.random() * 10);

      // Add log entry
      const newLog: SyncLog = {
        id: `log-${Date.now()}`,
        taskId,
        timestamp: new Date().toISOString(),
        recordsFound,
        conflictsCreated,
        status: "success",
        message: `Synced ${recordsFound} game records`,
      };

      setLogs((prev) => [newLog, ...prev]);

      // Update task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: "idle",
                lastRun: new Date().toISOString(),
                nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              }
            : t
        )
      );
    }, 2000);
  }

  function saveCronExpression(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, cronExpression: editingCron } : t
      )
    );
    setEditingTaskId(null);
    setEditingCron("");
  }

  function clearLogs() {
    if (confirm("Clear all sync logs?")) {
      setLogs([]);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
            Sync Scheduler
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--psp-gray-500)" }}>
            MaxPreps data synchronization and scheduling
          </p>
        </div>
      </div>

      {/* Sync Tasks */}
      <div className="grid gap-4 mb-8">
        {tasks.map((task) => {
          const lastRunDate = task.lastRun ? new Date(task.lastRun).toLocaleString() : "Never";
          const nextRunDate = task.nextRun ? new Date(task.nextRun).toLocaleString() : "N/A";
          const isEditing = editingTaskId === task.id;

          return (
            <div key={task.id} className="admin-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "var(--psp-navy)" }}>
                    {task.name}
                  </h2>
                  <div className="text-xs mt-1" style={{ color: "var(--psp-gray-500)" }}>
                    Sport: <span style={{ fontWeight: 600 }}>{task.sport}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: 11,
                    fontWeight: 600,
                    background:
                      task.status === "running"
                        ? "var(--psp-gold)"
                        : task.status === "error"
                          ? "#fecaca"
                          : "#dbeafe",
                    color:
                      task.status === "running"
                        ? "var(--psp-navy)"
                        : task.status === "error"
                          ? "#991b1b"
                          : "#0369a1",
                  }}
                >
                  {task.status === "running" ? "⏱️ Running..." : task.status === "error" ? "❌ Error" : "✓ Idle"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--psp-gray-400)" }}>
                    Last Run
                  </div>
                  <div className="text-sm mt-1" style={{ color: "var(--psp-gray-600)" }}>
                    {lastRunDate}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--psp-gray-400)" }}>
                    Next Scheduled
                  </div>
                  <div className="text-sm mt-1" style={{ color: "var(--psp-gray-600)" }}>
                    {nextRunDate}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--psp-gray-400)" }}>
                    Schedule (Cron)
                  </div>
                  <div className="mt-1">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingCron}
                          onChange={(e) => setEditingCron(e.target.value)}
                          placeholder="e.g., 0 2 * * *"
                          className="filter-input text-sm flex-1"
                        />
                        <button
                          onClick={() => saveCronExpression(task.id)}
                          className="btn-primary text-xs px-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="btn-outline text-xs px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        className="text-sm font-mono cursor-pointer"
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditingCron(task.cronExpression);
                        }}
                        style={{
                          background: "#f3f4f6",
                          padding: "4px 8px",
                          borderRadius: 3,
                          fontSize: 12,
                        }}
                      >
                        {task.cronExpression}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => runNow(task.id)}
                disabled={task.status === "running"}
                className="btn-primary text-sm disabled:opacity-40"
              >
                {task.status === "running" ? "Running..." : "Run Now"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Sync Log */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4 p-6 border-b" style={{ borderColor: "var(--psp-gray-200)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--psp-navy)" }}>
            Sync Log
          </h2>
          {logs.length > 0 && (
            <button onClick={clearLogs} className="btn-outline text-sm">
              Clear Log
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="p-6 text-center" style={{ color: "var(--psp-gray-400)" }}>
            No sync runs yet. Click "Run Now" on a task to start.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Task</th>
                  <th>Records Found</th>
                  <th>Conflicts Created</th>
                  <th>Status</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 20).map((log) => {
                  const task = tasks.find((t) => t.id === log.taskId);
                  const timestamp = new Date(log.timestamp).toLocaleString();
                  const statusBg = log.status === "success" ? "#dcfce7" : "#fee2e2";
                  const statusColor = log.status === "success" ? "#166534" : "#991b1b";

                  return (
                    <tr key={log.id}>
                      <td style={{ fontSize: 12 }}>{timestamp}</td>
                      <td style={{ fontSize: 12 }}>{task?.name || "Unknown"}</td>
                      <td style={{ fontSize: 12, fontWeight: 600 }}>{log.recordsFound}</td>
                      <td style={{ fontSize: 12, fontWeight: 600 }}>{log.conflictsCreated}</td>
                      <td>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 3,
                            fontSize: 11,
                            fontWeight: 600,
                            background: statusBg,
                            color: statusColor,
                          }}
                        >
                          {log.status === "success" ? "✓ Success" : "✗ Error"}
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--psp-gray-600)" }}>
                        {log.message || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {logs.length > 20 && (
              <div
                className="text-center py-4 text-xs"
                style={{ color: "var(--psp-gray-400)" }}
              >
                Showing latest 20 of {logs.length} runs. Clear log to reset.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs mt-4" style={{ color: "var(--psp-gray-400)" }}>
        <strong>Cron Format:</strong> minute hour day month dayOfWeek (e.g., &quot;0 2 * * *&quot; = 2 AM daily).
        Click the cron expression to edit. This interface is UI-only for now; actual MaxPreps syncing will be implemented in Phase 2.
      </p>
    </div>
  );
}
