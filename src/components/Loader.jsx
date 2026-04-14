function Loader({ text = "Loading..." }) {
  return (
    <div className="panel p-8 text-center">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}

export default Loader;
