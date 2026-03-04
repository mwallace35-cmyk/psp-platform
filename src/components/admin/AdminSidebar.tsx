"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/articles", label: "Articles", icon: "📰" },
  { href: "/admin/events", label: "Events", icon: "📅" },
  { href: "/admin/potw", label: "Player of Week", icon: "⭐" },
  { href: "/admin/import", label: "Import", icon: "📥" },
  { href: "/admin/data", label: "Data Browser", icon: "🔍" },
  { href: "/admin/comments", label: "Comments", icon: "💬" },
  { href: "/admin/corrections", label: "Corrections", icon: "✏️" },
  { href: "/admin/conflicts", label: "Conflicts", icon: "⚠️" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/sync", label: "Sync", icon: "🔄" },
  { href: "/admin/audit", label: "Audit Log", icon: "📋" },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="w-64 flex flex-col justify-between min-h-screen"
      style={{ background: "var(--psp-navy)" }}
    >
      <div>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: "var(--psp-navy-mid)" }}>
          <Link href="/admin">
            <h1 className="text-2xl text-white tracking-wider">PSP Admin</h1>
            <p className="text-xs mt-1" style={{ color: "var(--psp-gold)" }}>
              PhillySportsPack.com
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                style={isActive ? { background: "var(--psp-navy-mid)", color: "var(--psp-gold)" } : {}}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User section */}
      <div className="p-4 border-t" style={{ borderColor: "var(--psp-navy-mid)" }}>
        <div className="text-xs text-gray-400 mb-2 truncate">{userEmail}</div>
        <button
          onClick={handleLogout}
          className="btn-outline w-full text-sm text-gray-400 border-gray-600 hover:text-white hover:border-gray-400"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
