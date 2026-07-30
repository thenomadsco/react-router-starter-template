import { useLoaderData } from "react-router";
import { getSupabaseClient } from "../lib/supabase.server";

export function meta() {
  return [
    { title: "Admin — The Nomads Co." },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export async function loader({
  request,
  context,
}: {
  request: Request;
  context: { cloudflare: { env: Env } };
}) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") ?? "";
  const adminKey = context.cloudflare.env.ADMIN_KEY;

  if (!adminKey || key !== adminKey) {
    throw new Response("Unauthorized — pass ?key=<ADMIN_KEY> in the URL", { status: 401 });
  }

  const supabase = getSupabaseClient(context.cloudflare.env);
  const today = new Date().toISOString().slice(0, 10);

  const [leadsRes, tasksRes, followUpsRes] = await Promise.all([
    supabase
      .from("leads")
      .select(
        "id, name, email, phone, destination, lead_score, urgency_level, lead_status, ai_summary, contact_method, budget, created_at"
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("tasks")
      .select("id, task_type, priority, due_date, status, notes, leads(name, destination, phone, email)")
      .eq("status", "Open")
      .lte("due_date", today)
      .order("due_date", { ascending: true })
      .limit(30),
    supabase
      .from("follow_ups")
      .select("id", { count: "exact", head: true })
      .eq("completed", false),
  ]);

  const leads: any[] = leadsRes.data ?? [];
  const tasks: any[] = tasksRes.data ?? [];
  const pendingFollowUps = followUpsRes.count ?? 0;

  const hot = leads.filter((l) => (l.lead_score ?? 0) >= 75).length;
  const warm = leads.filter((l) => (l.lead_score ?? 0) >= 50 && (l.lead_score ?? 0) < 75).length;
  const cold = leads.filter((l) => l.lead_score === null || (l.lead_score ?? 0) < 50).length;

  return { leads, tasks, pendingFollowUps, stats: { total: leads.length, hot, warm, cold }, key };
}

function scoreChip(score: number | null) {
  if (score === null) return { bg: "bg-gray-100", text: "text-gray-500", label: "—" };
  if (score >= 75) return { bg: "bg-red-100", text: "text-red-700", label: String(score) };
  if (score >= 50) return { bg: "bg-amber-100", text: "text-amber-700", label: String(score) };
  return { bg: "bg-blue-100", text: "text-blue-700", label: String(score) };
}

function priorityChip(priority: string | null) {
  if (priority === "High") return "bg-red-100 text-red-700";
  if (priority === "Medium") return "bg-amber-100 text-amber-700";
  return "bg-green-100 text-green-700";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPage() {
  const { leads, tasks, pendingFollowUps, stats, key } = useLoaderData<typeof loader>();

  const statsCards = [
    { label: "Total Leads", value: stats.total, color: "text-[#2D3191]", bg: "bg-[#EEF0FF]" },
    { label: "Hot ≥ 75", value: stats.hot, color: "text-red-700", bg: "bg-red-50" },
    { label: "Warm 50–74", value: stats.warm, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "Cold < 50", value: stats.cold, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Open Follow-ups", value: pendingFollowUps, color: "text-purple-700", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f2f2f5] antialiased" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-[#2D3191] text-white px-6 py-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-0.5">
            The Nomads Co.
          </div>
          <h1 className="text-xl font-bold">Lead Dashboard</h1>
        </div>
        <div className="text-sm text-white/50 hidden sm:block">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </header>

      {/* Stats */}
      <section className="px-4 sm:px-6 pt-6 pb-2 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statsCards.map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-2xl p-4 border border-white/60 shadow-sm`}
            >
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Due Tasks */}
        {tasks.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-[#1F2328] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Due &amp; Overdue Tasks
              <span className="ml-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                {tasks.length}
              </span>
            </h2>
            <div className="bg-white rounded-2xl border border-[#E6E8EF] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E6E8EF] bg-[#FAFAF8] text-left">
                      <th className="px-4 py-3 text-gray-500 font-medium">Task Type</th>
                      <th className="px-4 py-3 text-gray-500 font-medium">Lead</th>
                      <th className="px-4 py-3 text-gray-500 font-medium">Contact</th>
                      <th className="px-4 py-3 text-gray-500 font-medium">Due</th>
                      <th className="px-4 py-3 text-gray-500 font-medium">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task: any) => (
                      <tr
                        key={task.id}
                        className="border-b border-[#E6E8EF] hover:bg-[#FAFAF8] transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-[#1F2328]">{task.task_type}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#1F2328]">{task.leads?.name ?? "—"}</div>
                          <div className="text-xs text-gray-400">{task.leads?.destination ?? ""}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>{task.leads?.phone ?? "—"}</div>
                          <div className="text-xs text-gray-400">{task.leads?.email ?? ""}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{task.due_date}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityChip(task.priority)}`}
                          >
                            {task.priority ?? "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Leads Table */}
        <section>
          <h2 className="text-base font-semibold text-[#1F2328] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2D3191] inline-block" />
            Recent Leads
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#2D3191] text-xs font-bold">
              {stats.total}
            </span>
          </h2>
          <div className="bg-white rounded-2xl border border-[#E6E8EF] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E6E8EF] bg-[#FAFAF8] text-left">
                    <th className="px-4 py-3 text-gray-500 font-medium">Name</th>
                    <th className="px-4 py-3 text-gray-500 font-medium">Contact</th>
                    <th className="px-4 py-3 text-gray-500 font-medium">Destination</th>
                    <th className="px-4 py-3 text-gray-500 font-medium">Score</th>
                    <th className="px-4 py-3 text-gray-500 font-medium">AI Summary</th>
                    <th className="px-4 py-3 text-gray-500 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                        No leads yet. Submissions through the funnel will appear here.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead: any) => {
                      const chip = scoreChip(lead.lead_score);
                      return (
                        <tr
                          key={lead.id}
                          className="border-b border-[#E6E8EF] hover:bg-[#FAFAF8] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#1F2328]">{lead.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{lead.contact_method}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            <div>{lead.phone || "—"}</div>
                            <div className="text-xs text-gray-400">{lead.email}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{lead.destination || "—"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${chip.bg} ${chip.text}`}
                            >
                              {chip.label}
                            </span>
                            {lead.urgency_level && (
                              <div className="text-xs text-gray-400 mt-0.5">{lead.urgency_level}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-w-[220px]">
                            <span title={lead.ai_summary ?? ""}>
                              {lead.ai_summary
                                ? lead.ai_summary.length > 90
                                  ? lead.ai_summary.slice(0, 90) + "…"
                                  : lead.ai_summary
                                : "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                            {formatDate(lead.created_at)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center">
          Showing latest 50 leads · Cron runs at 8am, 9am &amp; 9:30am IST daily ·{" "}
          <a
            href={`/admin?key=${key}`}
            className="underline hover:text-[#2D3191]"
          >
            Refresh
          </a>
        </p>
      </div>
    </div>
  );
}
