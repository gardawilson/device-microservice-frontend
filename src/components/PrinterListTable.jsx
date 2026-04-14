import { Link } from "react-router-dom";
import { formatDateTime, formatDisplayValue } from "../utils/formatters";
import StatusBadge from "./StatusBadge";

function PrinterListTable({ printers, onOpenEdit, onDelete }) {
  return (
    <>
      <div className="panel hidden overflow-hidden md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Identifier</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Print Usage</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Last Used At</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {printers.map((printer) => (
              <tr key={printer.id || printer.identifier} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{formatDisplayValue(printer.identifier || printer.id)}</td>
                <td className="px-4 py-3">{formatDisplayValue(printer.name)}</td>
                <td className="px-4 py-3">{formatDisplayValue(printer.printUsage)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={printer.status} />
                </td>
                <td className="px-4 py-3">{formatDateTime(printer.lastUsedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link className="btn-secondary" to={`/printers/${encodeURIComponent(printer.id || printer.identifier)}`}>
                      Detail
                    </Link>
                    <button className="btn-secondary" type="button" onClick={() => onOpenEdit(printer)}>
                      Edit
                    </button>
                    <button className="btn-secondary" type="button" onClick={() => onDelete(printer)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {printers.map((printer) => (
          <article key={printer.id || printer.identifier} className="panel p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{formatDisplayValue(printer.identifier || printer.id)}</p>
                <h3 className="text-base font-semibold text-slate-900">{formatDisplayValue(printer.name)}</h3>
              </div>
              <StatusBadge status={printer.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-slate-500">Print Usage</p>
              <p className="text-right font-medium text-slate-800">{formatDisplayValue(printer.printUsage)}</p>
              <p className="text-slate-500">Last Used</p>
              <p className="text-right font-medium text-slate-800">{formatDateTime(printer.lastUsedAt)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link className="btn-secondary" to={`/printers/${encodeURIComponent(printer.id || printer.identifier)}`}>
                Detail
              </Link>
              <button className="btn-secondary" type="button" onClick={() => onOpenEdit(printer)}>
                Edit
              </button>
              <button className="btn-secondary" type="button" onClick={() => onDelete(printer)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default PrinterListTable;
