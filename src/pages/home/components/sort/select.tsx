export const options = [
  { label: "Name", value: "title" },
  { label: "Version", value: "version" },
  { label: "Date", value: "date" },
];

export function SortingSelect({ onChange }: { onChange: (e: Event) => void }) {
  return (
    <div>
      <label id="select-label">Sort by:</label>
      <select
        id="sort-select"
        aria-labelledby="select-label"
        onChange={onChange}
      >
        <option disabled selected>Select one…</option>
        {options.map(({ label, value }) => (
          <option value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
