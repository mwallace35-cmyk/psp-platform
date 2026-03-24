import { createClient } from "@/lib/supabase/server";
import {
  getPendingAccessRequests,
  respondToAccessRequest,
  type AccessRequest,
} from "@/lib/data";
import { redirect } from "next/navigation";

export const metadata = {
  title: "School Admins | PSP Admin",
};

export default async function SchoolAdminsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const requests = await getPendingAccessRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">School Admin Requests</h1>
        <p className="text-gray-300 mt-2">
          Manage school admin access requests
        </p>
      </div>

      {requests.length === 0 ? (
        <div
          className="p-8 rounded-lg text-center"
          style={{ background: "var(--psp-navy-mid)" }}
        >
          <p className="text-gray-300">No pending requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request: AccessRequest) => (
            <div
              key={request.id}
              className="p-6 rounded-lg border"
              style={{
                background: "var(--psp-navy-mid)",
                borderColor: "var(--psp-navy)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">
                    {request.school_name}
                  </h2>
                  <p className="text-sm text-gray-300 mt-1">
                    Role: {request.role} • Requested on{" "}
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await respondToAccessRequest(request.id, true, user.id);
                      // In a real app, would trigger a refresh or revalidate
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                      background: "var(--psp-gold)",
                      color: "var(--psp-navy)",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      await respondToAccessRequest(request.id, false, "");
                      // In a real app, would trigger a refresh or revalidate
                    }}
                    className="px-4 py-2 rounded-lg font-medium border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
