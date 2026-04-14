import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import ResetPrinterModal from "../components/ResetPrinterModal";
import StatusBadge from "../components/StatusBadge";
import Tabs from "../components/Tabs";
import { printerService } from "../services/printerService";
import { formatDateTime, formatDisplayValue } from "../utils/formatters";

const LIMIT = 10;

const APP_PALETTE = [
  {
    color: "#1087dc",
    bg: "bg-brand-500",
    text: "text-brand-600",
    trackBg: "bg-brand-100",
  },
  {
    color: "#7c3aed",
    bg: "bg-violet-500",
    text: "text-violet-600",
    trackBg: "bg-violet-100",
  },
  {
    color: "#059669",
    bg: "bg-emerald-500",
    text: "text-emerald-600",
    trackBg: "bg-emerald-100",
  },
  {
    color: "#d97706",
    bg: "bg-amber-500",
    text: "text-amber-600",
    trackBg: "bg-amber-100",
  },
  {
    color: "#e11d48",
    bg: "bg-rose-500",
    text: "text-rose-600",
    trackBg: "bg-rose-100",
  },
];

function SourceAppSummary({ summary }) {
  if (!Array.isArray(summary) || summary.length === 0) return null;

  const sorted = [...summary].sort((a, b) => b.count - a.count);
  const total = sorted.reduce((sum, s) => sum + (s.count ?? 0), 0);
  const max = sorted[0]?.count ?? 1;

  const enriched = sorted.map((s, i) => ({
    ...s,
    pct: total > 0 ? ((s.count / total) * 100).toFixed(1) : "0.0",
    barWidth: total > 0 ? Math.round((s.count / total) * 100) : 0,
    palette: APP_PALETTE[i % APP_PALETTE.length],
    rank: i + 1,
  }));

  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
        <div className="flex items-center gap-2">
          {/* bar-chart icon */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className="text-brand-600"
          >
            <rect
              x="1"
              y="7"
              width="3"
              height="7"
              rx="1"
              fill="currentColor"
              opacity=".4"
            />
            <rect
              x="6"
              y="4"
              width="3"
              height="10"
              rx="1"
              fill="currentColor"
              opacity=".7"
            />
            <rect
              x="11"
              y="1"
              width="3"
              height="13"
              rx="1"
              fill="currentColor"
            />
          </svg>
          <span className="text-sm font-semibold text-slate-700">
            Print by Source App
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{enriched.length} app</span>
          <span className="rounded-full bg-brand-50 px-3 py-0.5 text-xs font-bold text-brand-700">
            {total} total
          </span>
        </div>
      </div>

      {/* ── Bar Race ── */}
      <div className="divide-y divide-slate-50 px-5 py-2">
        {enriched.map((s) => (
          <div key={s.sourceApp} className="flex items-center gap-4 py-3">
            {/* Rank */}
            <span className="w-4 shrink-0 text-center text-xs font-bold text-slate-300">
              #{s.rank}
            </span>

            {/* App name */}
            <div className="w-24 shrink-0">
              <span className={`text-sm font-semibold ${s.palette.text}`}>
                {s.sourceApp}
              </span>
            </div>

            {/* Bar track */}
            <div
              className={`h-7 flex-1 overflow-hidden rounded-lg ${s.palette.trackBg}`}
            >
              <div
                className={`flex h-full items-center justify-end rounded-lg px-2.5 ${s.palette.bg} transition-all duration-700 ease-out`}
                style={{ width: `${s.barWidth}%`, minWidth: "2.5rem" }}
              >
                <span className="text-xs font-bold text-white drop-shadow-sm">
                  {s.count}
                </span>
              </div>
            </div>

            {/* Percentage */}
            <div className="w-12 shrink-0 text-right">
              <span className="text-sm font-bold text-slate-700">{s.pct}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-2.5">
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">
            Bar width relatif terhadap app terbanyak
          </span>
          <div className="ml-auto flex items-center gap-3">
            {enriched.map((s) => (
              <div key={s.sourceApp} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${s.palette.bg}`} />
                <span className="text-xs text-slate-500">{s.sourceApp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange, loading }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between gap-2 text-sm">
      <span className="text-slate-500">
        Halaman {page} dari {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          className="btn-secondary"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
        >
          &larr; Prev
        </button>
        <button
          className="btn-secondary"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

function PrinterDetailPage() {
  const { printerId } = useParams();
  const [printer, setPrinter] = useState(null);
  const [printLogs, setPrintLogs] = useState([]);
  const [resetLogs, setResetLogs] = useState([]);
  const [printMeta, setPrintMeta] = useState({ page: 1, totalPages: 1 });
  const [resetMeta, setResetMeta] = useState({ page: 1, totalPages: 1 });
  const [sourceAppSummary, setSourceAppSummary] = useState([]);
  const [activeTab, setActiveTab] = useState("print-logs");
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);
  const [error, setError] = useState("");

  const [lookupId, setLookupId] = useState(null);
  const [resetOpen, setResetOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!printerId) return;
    setLoading(true);
    setError("");
    try {
      const routeValue = decodeURIComponent(printerId);
      let printerData = null;
      let lookupValue = routeValue;

      try {
        printerData = await printerService.getPrinterDetail(routeValue);
      } catch (detailError) {
        const message = String(detailError?.message || "").toLowerCase();
        if (!message.includes("not found")) throw detailError;

        const printers = await printerService.getPrinters();
        const matched = printers.find((item) => {
          const id = String(item.id || "").toLowerCase();
          const identifier = String(item.identifier || "").toLowerCase();
          const target = routeValue.toLowerCase();
          return id === target || identifier === target;
        });
        if (matched?.id) {
          try {
            printerData = await printerService.getPrinterDetail(matched.id);
          } catch {
            printerData = matched;
          }
          lookupValue = matched.identifier || matched.id || routeValue;
        }
      }

      lookupValue = printerData?.identifier || lookupValue;
      setLookupId(lookupValue);

      const [printLogResult, resetResult] = await Promise.allSettled([
        printerService.getPrinterLogsPayload(lookupValue, 1, LIMIT),
        printerService.getResetLogsPayload(lookupValue, 1, LIMIT),
      ]);

      const printPayload =
        printLogResult.status === "fulfilled" ? printLogResult.value : null;
      const resetPayload =
        resetResult.status === "fulfilled" ? resetResult.value : null;

      const resolvedPrinter =
        printerData || printPayload?.printer || resetPayload?.printer || null;

      if (!resolvedPrinter) throw new Error("Printer not found");

      setPrinter(resolvedPrinter);

      setPrintLogs(
        Array.isArray(printPayload?.logs)
          ? printPayload.logs
          : Array.isArray(printPayload)
            ? printPayload
            : [],
      );
      setPrintMeta({
        page: printPayload?.pagination?.page ?? 1,
        totalPages: printPayload?.pagination?.totalPages ?? 1,
      });
      setSourceAppSummary(
        Array.isArray(printPayload?.sourceAppSummary)
          ? printPayload.sourceAppSummary
          : [],
      );

      setResetLogs(
        Array.isArray(resetPayload?.resetLogs)
          ? resetPayload.resetLogs
          : Array.isArray(resetPayload)
            ? resetPayload
            : [],
      );
      setResetMeta({
        page: resetPayload?.pagination?.page ?? 1,
        totalPages: resetPayload?.pagination?.totalPages ?? 1,
      });
    } catch (loadError) {
      setError(loadError.message || "Gagal mengambil detail printer.");
    } finally {
      setLoading(false);
    }
  }, [printerId]);

  const loadPrintPage = useCallback(
    async (page) => {
      if (!lookupId) return;
      setLogLoading(true);
      try {
        const payload = await printerService.getPrinterLogsPayload(
          lookupId,
          page,
          LIMIT,
        );
        setPrintLogs(
          Array.isArray(payload?.logs)
            ? payload.logs
            : Array.isArray(payload)
              ? payload
              : [],
        );
        setPrintMeta({
          page: payload?.pagination?.page ?? page,
          totalPages: payload?.pagination?.totalPages ?? 1,
        });
        setSourceAppSummary(
          Array.isArray(payload?.sourceAppSummary)
            ? payload.sourceAppSummary
            : [],
        );
      } finally {
        setLogLoading(false);
      }
    },
    [lookupId],
  );

  const loadResetPage = useCallback(
    async (page) => {
      if (!lookupId) return;
      setLogLoading(true);
      try {
        const payload = await printerService.getResetLogsPayload(
          lookupId,
          page,
          LIMIT,
        );
        setResetLogs(
          Array.isArray(payload?.resetLogs)
            ? payload.resetLogs
            : Array.isArray(payload)
              ? payload
              : [],
        );
        setResetMeta({
          page: payload?.pagination?.page ?? page,
          totalPages: payload?.pagination?.totalPages ?? 1,
        });
      } finally {
        setLogLoading(false);
      }
    },
    [lookupId],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <Loader text="Memuat detail printer..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!printer)
    return (
      <EmptyState
        title="Printer tidak ditemukan"
        description={`Data printer ${printerId} tidak tersedia.`}
      />
    );

  const logRows = activeTab === "print-logs" ? printLogs : resetLogs;
  const meta = activeTab === "print-logs" ? printMeta : resetMeta;
  const onPageChange =
    activeTab === "print-logs" ? loadPrintPage : loadResetPage;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link to="/printers" className="btn-secondary">
          Kembali ke List
        </Link>
        <div className="flex gap-2">
          <button
            className="btn-danger"
            type="button"
            onClick={() => setResetOpen(true)}
          >
            Reset Printer
          </button>
        </div>
      </div>

      <article className="panel p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Device</p>
            <h1 className="text-2xl font-bold text-slate-900">
              {formatDisplayValue(printer.name)}
            </h1>
            <p className="mt-1 text-slate-600">
              {formatDisplayValue(printer.identifier)}
            </p>
          </div>
          <StatusBadge status={printer.status} />
        </div>

        <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-slate-500">Print Usage</p>
            <p className="font-semibold text-slate-900">
              {formatDisplayValue(printer.printUsage)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Last Used At</p>
            <p className="font-semibold text-slate-900">
              {formatDateTime(printer.lastUsedAt)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Created At</p>
            <p className="font-semibold text-slate-900">
              {formatDateTime(printer.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Updated At</p>
            <p className="font-semibold text-slate-900">
              {formatDateTime(printer.updatedAt)}
            </p>
          </div>
        </div>
      </article>

      <article className="panel p-5">
        <Tabs
          tabs={[
            { value: "print-logs", label: "Print Logs" },
            { value: "reset-logs", label: "Reset Logs" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-4">
          {activeTab === "print-logs" && (
            <SourceAppSummary summary={sourceAppSummary} />
          )}

          {logLoading && (
            <div className="py-6 text-center text-sm text-slate-400">
              Memuat log...
            </div>
          )}

          {!logLoading && logRows.length === 0 && (
            <EmptyState
              title={
                activeTab === "print-logs"
                  ? "Print logs kosong"
                  : "Reset logs kosong"
              }
              description="Belum ada data log untuk printer ini."
            />
          )}

          {!logLoading && logRows.length > 0 && (
            <div className="overflow-x-auto">
              {activeTab === "print-logs" ? (
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-left text-slate-600">
                    <tr>
                      <th className="px-3 py-2 font-semibold">ID</th>
                      <th className="px-3 py-2 font-semibold">sourceApp</th>
                      <th className="px-3 py-2 font-semibold">printBy</th>
                      <th className="px-3 py-2 font-semibold">totalLabel</th>
                      <th className="px-3 py-2 font-semibold">printedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printLogs.map((log) => {
                      const appIndex = sourceAppSummary.findIndex(
                        (s) => s.sourceApp === log.sourceApp,
                      );
                      const palette =
                        APP_PALETTE[
                          (appIndex >= 0 ? appIndex : 0) % APP_PALETTE.length
                        ];
                      return (
                        <tr key={log.id} className="border-t border-slate-100">
                          <td className="px-3 py-2 font-mono text-xs text-slate-500">
                            {formatDisplayValue(log.id)}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-medium ${palette.badge}`}
                            >
                              {formatDisplayValue(log.sourceApp)}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {formatDisplayValue(log.printBy)}
                          </td>
                          <td className="px-3 py-2">
                            {formatDisplayValue(log.totalLabel)}
                          </td>
                          <td className="px-3 py-2">
                            {formatDateTime(log.printedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-left text-slate-600">
                    <tr>
                      <th className="px-3 py-2 font-semibold">ID</th>
                      <th className="px-3 py-2 font-semibold">doneBy</th>
                      <th className="px-3 py-2 font-semibold">doneAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resetLogs.map((log) => (
                      <tr key={log.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-mono text-xs text-slate-500">
                          {formatDisplayValue(log.id)}
                        </td>
                        <td className="px-3 py-2">
                          {formatDisplayValue(log.doneBy)}
                        </td>
                        <td className="px-3 py-2">
                          {formatDateTime(log.doneAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={onPageChange}
                loading={logLoading}
              />
            </div>
          )}
        </div>
      </article>

      <ResetPrinterModal
        isOpen={resetOpen}
        printer={printer}
        onClose={() => setResetOpen(false)}
        onSuccess={loadData}
      />
    </section>
  );
}

export default PrinterDetailPage;
