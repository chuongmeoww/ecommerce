// frontend/src/components/CategoryPills.jsx
export default function CategoryPills({ categories = [], active = '', onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`px-3 py-1 rounded border ${!active ? 'bg-black text-white' : ''}`}
        onClick={() => onSelect('')}
      >
        Tất cả
      </button>
      {categories.map((c) => (
        <button
          key={c._id || c.slug}
          className={`px-3 py-1 rounded border ${active === c.slug ? 'bg-black text-white' : ''}`}
          onClick={() => onSelect(c.slug)}
          title={c.description || c.name}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
