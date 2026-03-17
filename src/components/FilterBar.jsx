export default function FilterBar({ filters, onChange, subscriptions, totalCount, filteredCount }) {
  function set(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="filter-bar">
      <input
        className="search-input"
        type="search"
        placeholder="Search lessons..."
        value={filters.search}
        onChange={e => set('search', e.target.value)}
      />

      <select value={filters.status} onChange={e => set('status', e.target.value)}>
        <option value="">All Statuses</option>
        <option value="not-started">Not Started</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select value={filters.source} onChange={e => set('source', e.target.value)}>
        <option value="">All Sources</option>
        {subscriptions.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={filters.sort} onChange={e => set('sort', e.target.value)}>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title">Title A–Z</option>
        <option value="rating">Highest Rated</option>
      </select>

      <span className="result-count">
        {filteredCount === totalCount
          ? `${totalCount} lesson${totalCount !== 1 ? 's' : ''}`
          : `${filteredCount} of ${totalCount}`}
      </span>
    </div>
  );
}
