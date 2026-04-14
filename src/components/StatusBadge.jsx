function StatusBadge({ status }) {
  const normalized = String(status || "unknown").toLowerCase();

  const statusMap = {
    active: "bg-emerald-100 text-emerald-700",
    online: "bg-emerald-100 text-emerald-700",
    inactive: "bg-slate-200 text-slate-700",
    offline: "bg-slate-200 text-slate-700",
    error: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMap[normalized] || "bg-amber-100 text-amber-700"}`}>
      {String(status || "UNKNOWN").toUpperCase()}
    </span>
  );
}

export default StatusBadge;
