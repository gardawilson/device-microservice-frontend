import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import { printerService } from "../services/printerService";
import Modal from "./Modal";

function SettingMaxPrintCountModal({ isOpen, onClose, value, onUpdated }) {
  const [draft, setDraft] = useState(value ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) setDraft(value ?? "");
  }, [isOpen, value]);

  const currentValue = value ?? "-";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = Number(draft);

    if (!Number.isFinite(next) || next <= 0) {
      addToast({ type: "error", message: "Max print count harus berupa angka > 0." });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await printerService.updateMaxPrintCountSetting(next);
      addToast({ type: "success", message: "Setting max print count berhasil diupdate." });
      onUpdated?.(result?.maxPrintCount ?? next);
      onClose();
    } catch (error) {
      addToast({ type: "error", message: error.message || "Gagal update setting." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Setting Max Print Count" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="text-sm text-slate-600">
          Current value: <span className="font-semibold text-slate-900">{currentValue}</span>
        </p>
        <div>
          <label className="label" htmlFor="max-print-count">
            Max Print Count
          </label>
          <input
            id="max-print-count"
            className="input"
            type="number"
            min="1"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Masukkan nilai baru"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default SettingMaxPrintCountModal;
