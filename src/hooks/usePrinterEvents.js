const PRINTERS_UPDATED_EVENT = "printers:updated";

export const emitPrintersUpdated = () => {
  window.dispatchEvent(new Event(PRINTERS_UPDATED_EVENT));
};

export const onPrintersUpdated = (callback) => {
  window.addEventListener(PRINTERS_UPDATED_EVENT, callback);
  return () => window.removeEventListener(PRINTERS_UPDATED_EVENT, callback);
};
