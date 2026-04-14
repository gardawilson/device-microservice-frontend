function EmptyState({ title = "No data", description = "Data belum tersedia." }) {
  return (
    <div className="panel p-8 text-center">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyState;
