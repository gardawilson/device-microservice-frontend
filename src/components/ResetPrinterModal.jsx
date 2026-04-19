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

    const confirmed = window.confirm("This will reset the printer. Continue?");
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      await printerService.resetPrinter({
        printerId: printer?.identifier || printer?.id || "",
      });
      addToast({ type: "success", message: "Printer reset successfully." });
      emitPrintersUpdated();
      onSuccess?.();
      onClose();
    } catch (error) {
      addToast({
        type: "error",
        message: error.message || "Failed to reset printer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Reset Printer" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This will reset the print count and status.
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
            Cancel
          </button>
          <button type="submit" className="btn-danger" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Reset Printer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ResetPrinterModal;
