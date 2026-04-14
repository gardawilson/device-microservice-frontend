import { useState } from "react";
import { emitPrintersUpdated } from "../hooks/usePrinterEvents";
import { useToast } from "../hooks/useToast";
import { printerService } from "../services/printerService";
import Modal from "./Modal";

function ResetPrinterModal({ isOpen, onClose, printer, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm("Reset printer akan dijalankan. Lanjut?");
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      await printerService.resetPrinter({
        printerId: printer?.identifier || printer?.id || "",
      });
      addToast({ type: "success", message: "Reset printer berhasil dijalankan." });
      emitPrintersUpdated();
      onSuccess?.();
      onClose();
    } catch (error) {
      addToast({ type: "error", message: error.message || "Reset printer gagal." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Reset Printer" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Reset printer akan memanggil endpoint reset khusus.
        </p>
        <div>
          <label className="label" htmlFor="reset-printer-id">
            Printer ID
          </label>
          <input
            id="reset-printer-id"
            className="input bg-slate-100"
            value={printer?.identifier || printer?.id || ""}
            readOnly
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn-danger" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Reset Printer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ResetPrinterModal;
