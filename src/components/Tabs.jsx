function Tabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`rounded-t-xl px-4 py-2 text-sm font-medium transition-colors ${
              active === tab.value ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
