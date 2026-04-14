function ErrorState({ message = "Terjadi kesalahan.", onRetry }) {
  return (
    <div className="panel p-8 text-center">
      <h3 className="text-base font-semibold text-rose-700">Gagal memuat data</h3>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      {onRetry && (
        <button className="btn-secondary mt-4" type="button" onClick={onRetry}>
          Coba Lagi
        </button>
      )}
    </div>
  );
}

export default ErrorState;
