import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

/**
 * Admin layout with role-based access control (RBAC).
 *
 * Enforces that only users with the 'admin' role can access the admin panel.
 * Checks user metadata first (faster), then falls back to database query if needed.
 *
 * Access control flow:
 * 1. Check if user is authenticated -> redirect to /login if not
 * 2. Check if user has admin role in metadata -> proceed if found
 * 3. Fallback: Check user_roles table in database -> proceed if admin
 * 4. Redirect non-admin users to "/" with a logged message
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authentication gate
  if (!user) {
    redirect("/login");
  }

  // Authorization gate - check for admin role (with fail-secure error handling)
  try {
    const isAdmin = await checkAdminRole(supabase, user.id, user.user_metadata);

    if (!isAdmin) {
      console.warn(
        `⚠️ Unauthorized admin access attempt by user ${user.id} (${user.email}). ` +
        `Redirecting to home page.`
      );
      redirect("/");
    }
  } catch (error) {
    // FAIL SECURE: On any error during role verification, deny access and redirect
    console.error(
      `[PSP:SECURITY] Admin role verification failed for user ${user.id} (${user.email}). ` +
      `Redirecting to home page. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    redirect("/?error=access_denied");
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar userEmail={user.email || ""} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

/**
 * Check if a user has the admin role.
 *
 * Priority order:
 * 1. user_metadata.role === 'admin' (fastest)
 * 2. app_metadata.role === 'admin' (also fast)
 * 3. Check user_roles table (for separate role management)
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @param userMetadata - User's metadata from auth.getUser()
 * @returns true if user has admin role, false otherwise
 */
async function checkAdminRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  userMetadata?: Record<string, unknown>
): Promise<boolean> {
  // Fast path: check metadata first
  if (userMetadata?.role === 'admin') {
    return true;
  }

  // Check if user_roles table exists and has admin entry for this user
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (!error && data) {
      return true;
    }

    // If error is "No rows found", that's expected - user just doesn't have admin role
    if (error && error.code === 'PGRST116') {
      return false;
    }

    // FAIL SECURE: Any other error (database connection, timeout, etc.) denies access
    // This ensures that temporary issues don't grant unintended access
    if (error) {
      console.error('[PSP:SECURITY] Failed to check admin role in database:', error);
      throw new Error(`Admin role verification failed: ${error.message}`);
    }

    return false;
  } catch (error) {
    console.error('[PSP:SECURITY] Critical error during admin role check:', error);
    // FAIL SECURE: On any error, deny access and redirect
    throw error;
  }
}
