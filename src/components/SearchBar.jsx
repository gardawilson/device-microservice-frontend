function SearchBar({ value, onChange }) {
  return (
    <div className="panel p-4">
      <label htmlFor="search" className="label">
        Cari Printer
      </label>
      <input
        id="search"
        className="input"
        placeholder="Cari berdasarkan identifier atau name..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;
