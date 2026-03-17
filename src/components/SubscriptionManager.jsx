import { useState } from 'react';

export default function SubscriptionManager({ subscriptions, onAdd, onDelete }) {
  const [newName, setNewName] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    onAdd(name);
    setNewName('');
  }

  return (
    <div className="subscription-manager">
      <h3>Subscriptions / Sources</h3>
      <ul className="subscription-list">
        {subscriptions.map(s => (
          <li key={s}>
            <span>{s}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                if (window.confirm(`Remove "${s}" from sources?`)) onDelete(s);
              }}
              aria-label={`Remove ${s}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <form className="add-subscription" onSubmit={handleAdd}>
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Add new source..."
        />
        <button type="submit" className="btn btn-sm btn-primary">Add</button>
      </form>
    </div>
  );
}
