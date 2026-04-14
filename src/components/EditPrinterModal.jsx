import { useEffect, useState } from "react";
import { emitPrintersUpdated } from "../hooks/usePrinterEvents";
import { useToast } from "../hooks/useToast";
import { printerService } from "../services/printerService";
import Modal from "./Modal";

function EditPrinterModal({ isOpen, onClose, printer, onSuccess }) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) setName(printer?.name || "");
  }, [isOpen, printer]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      addToast({ type: "error", message: "Name wajib diisi." });
      return;
    }

    if (!printer?.id && !printer?.identifier) {
      addToast({ type: "error", message: "Data printer tidak valid." });
      return;
    }

    try {
      setIsSubmitting(true);
      await printerService.updatePrinterName({
        id: printer?.id,
        identifier: printer?.identifier,
        name: name.trim(),
      });
      addToast({ type: "success", message: "Nama printer berhasil diupdate." });
      emitPrintersUpdated();
      onSuccess?.();
      onClose();
    } catch (error) {
      addToast({ type: "error", message: error.message || "Gagal update printer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Edit Printer" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="edit-printer-identifier">
            Identifier
          </label>
          <input
            id="edit-printer-identifier"
            className="input bg-slate-100"
            value={printer?.identifier || "-"}
            readOnly
          />
        </div>
        <div>
          <label className="label" htmlFor="edit-printer-name">
            Name
          </label>
          <input
            id="edit-printer-name"
            className="input"
            placeholder="Zebra Printer 2"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditPrinterModal;
