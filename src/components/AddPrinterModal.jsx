import { useEffect, useState } from "react";
import { emitPrintersUpdated } from "../hooks/usePrinterEvents";
import { useToast } from "../hooks/useToast";
import { printerService } from "../services/printerService";
import Modal from "./Modal";

function AddPrinterModal({ isOpen, onClose, onSuccess }) {
  const [mac, setMac] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setMac("");
      setName("");
    }
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mac.trim()) {
      addToast({ type: "error", message: "MAC address is required." });
      return;
    }
    if (!name.trim()) {
      addToast({ type: "error", message: "Name is required." });
      return;
    }

    try {
      setIsSubmitting(true);
      await printerService.addPrinter({
        mac: mac.trim(),
        name: name.trim(),
      });
      addToast({ type: "success", message: "Printer added successfully." });
      emitPrintersUpdated();
      onSuccess?.();
      onClose();
    } catch (error) {
      addToast({
        type: "error",
        message: error.message || "Failed to add printer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Add Printer" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="add-printer-mac">
            MAC
          </label>
          <input
            id="add-printer-mac"
            className="input"
            placeholder="AA:BB:CC:DD:EE:FF"
            value={mac}
            onChange={(event) => setMac(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="add-printer-name">
            Name
          </label>
          <input
            id="add-printer-name"
            className="input"
            placeholder="Zebra Printer 1"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Printer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddPrinterModal;
