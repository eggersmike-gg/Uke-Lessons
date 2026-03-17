const STATUS_META = {
  'not-started': { label: 'Not Started', className: 'status-not-started' },
  'in-progress': { label: 'In Progress', className: 'status-in-progress' },
  'completed': { label: 'Completed', className: 'status-completed' },
};

function Stars({ rating }) {
  if (!rating) return null;
  return (
    <span className="stars" title={`${rating}/5`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function LessonCard({ lesson, onEdit, onDelete, onStatusChange }) {
  const status = STATUS_META[lesson.status] || STATUS_META['not-started'];

  return (
    <div className={`lesson-card ${status.className}`}>
      <div className="card-header">
        <div className="card-title-row">
          <span className={`status-badge ${status.className}`}>{status.label}</span>
          {lesson.source && <span className="source-tag">{lesson.source}</span>}
        </div>
        <h3 className="card-title">
          {lesson.url ? (
            <a href={lesson.url} target="_blank" rel="noopener noreferrer">
              {lesson.title}
            </a>
          ) : (
            lesson.title
          )}
        </h3>
        {lesson.description && <p className="card-description">{lesson.description}</p>}
      </div>

      <div className="card-meta">
        <Stars rating={lesson.rating} />
        {lesson.notes && <p className="card-notes">{lesson.notes}</p>}
      </div>

      <div className="card-actions">
        <select
          className="status-select"
          value={lesson.status}
          onChange={e => onStatusChange(lesson.id, e.target.value)}
          aria-label="Change status"
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="btn btn-sm btn-secondary" onClick={() => onEdit(lesson)}>
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            if (window.confirm(`Delete "${lesson.title}"?`)) onDelete(lesson.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
