import { createContext, useCallback, useMemo, useState } from "react";

export const ToastContext = createContext({
  addToast: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (payload) => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast = {
        id,
        type: payload.type || "success",
        message: payload.message || "",
      };
      setToasts((current) => [...current, toast]);
      setTimeout(() => removeToast(id), 3200);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl px-4 py-3 text-sm text-white shadow-lg ${
              toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
            }`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
