import { useState, useRef, useMemo } from 'react';
import { useLessons } from './hooks/useLessons';
import LessonCard from './components/LessonCard';
import LessonForm from './components/LessonForm';
import FilterBar from './components/FilterBar';
import SubscriptionManager from './components/SubscriptionManager';
import './App.css';

const DEFAULT_FILTERS = { search: '', status: '', source: '', sort: 'newest' };

function applyFilters(lessons, filters) {
  let result = [...lessons];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.notes.toLowerCase().includes(q)
    );
  }
  if (filters.status) result = result.filter(l => l.status === filters.status);
  if (filters.source) result = result.filter(l => l.source === filters.source);

  result.sort((a, b) => {
    if (filters.sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (filters.sort === 'title') return a.title.localeCompare(b.title);
    if (filters.sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return result;
}

function StatsBar({ lessons }) {
  const total = lessons.length;
  const completed = lessons.filter(l => l.status === 'completed').length;
  const inProgress = lessons.filter(l => l.status === 'in-progress').length;
  const notStarted = lessons.filter(l => l.status === 'not-started').length;

  return (
    <div className="stats-bar">
      <div className="stat"><span className="stat-num">{total}</span><span>Total</span></div>
      <div className="stat stat-completed"><span className="stat-num">{completed}</span><span>Completed</span></div>
      <div className="stat stat-in-progress"><span className="stat-num">{inProgress}</span><span>In Progress</span></div>
      <div className="stat stat-not-started"><span className="stat-num">{notStarted}</span><span>Not Started</span></div>
    </div>
  );
}

export default function App() {
  const {
    lessons, subscriptions,
    addLesson, updateLesson, deleteLesson,
    addSubscription, deleteSubscription,
    exportData, importData,
  } = useLessons();

  const [editingLesson, setEditingLesson] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [importError, setImportError] = useState('');
  const importRef = useRef();

  const filtered = useMemo(() => applyFilters(lessons, filters), [lessons, filters]);

  function openAdd() {
    setEditingLesson(null);
    setShowForm(true);
    setShowSettings(false);
  }

  function openEdit(lesson) {
    setEditingLesson(lesson);
    setShowForm(true);
    setShowSettings(false);
  }

  function handleSave(fields) {
    if (editingLesson) {
      updateLesson(editingLesson.id, fields);
    } else {
      addLesson(fields);
    }
    setShowForm(false);
    setEditingLesson(null);
  }

  function handleStatusChange(id, status) {
    updateLesson(id, { status });
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImportError('');
    try {
      await importData(file);
    } catch (err) {
      setImportError(err.message);
    } finally {
      e.target.value = '';
    }
  }

  const sidebarOpen = showForm || showSettings;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">🎸</span>
          <h1>Uke Lessons</h1>
        </div>
        <nav className="header-actions">
          <button className="btn btn-primary" onClick={openAdd}>+ Add Lesson</button>
          <button
            className="btn btn-secondary"
            onClick={() => { setShowSettings(s => !s); setShowForm(false); }}
          >
            {showSettings ? 'Close Settings' : 'Settings'}
          </button>
          <button className="btn btn-ghost" onClick={exportData} title="Export all data as JSON">
            Export JSON
          </button>
          <button className="btn btn-ghost" onClick={() => importRef.current.click()} title="Import from JSON">
            Import JSON
          </button>
          <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        </nav>
      </header>

      {importError && (
        <div className="error-banner">
          Import failed: {importError}
          <button onClick={() => setImportError('')}>✕</button>
        </div>
      )}

      <main className={`app-main ${sidebarOpen ? 'with-sidebar' : ''}`}>
        {showForm && (
          <aside className="sidebar">
            <LessonForm
              lesson={editingLesson}
              subscriptions={subscriptions}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingLesson(null); }}
            />
          </aside>
        )}

        {showSettings && (
          <aside className="sidebar">
            <SubscriptionManager
              subscriptions={subscriptions}
              onAdd={addSubscription}
              onDelete={deleteSubscription}
            />
          </aside>
        )}

        <section className="content">
          <StatsBar lessons={lessons} />

          <FilterBar
            filters={filters}
            onChange={setFilters}
            subscriptions={subscriptions}
            totalCount={lessons.length}
            filteredCount={filtered.length}
          />

          {lessons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <p>No lessons yet. Add your first lesson to get started!</p>
              <button className="btn btn-primary" onClick={openAdd}>Add your first lesson</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>No lessons match your filters.</p>
              <button className="btn btn-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</button>
            </div>
          ) : (
            <div className="lesson-grid">
              {filtered.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={openEdit}
                  onDelete={deleteLesson}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
