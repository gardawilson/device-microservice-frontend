function SearchBar({ value, onChange }) {
  return (
    <div className="panel p-4">
      <label htmlFor="search" className="label">
        Search Printer
      </label>
      <input
        id="search"
        className="input"
        placeholder="Search by mac address or name..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;
