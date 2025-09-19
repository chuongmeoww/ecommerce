export default function MegaPanel({ cols = [] }) {
  return (
    <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {cols.map((col, i) => (
          <div key={i}>
            <div className="font-semibold mb-2">{col.title}</div>
            <ul className="space-y-1 text-sm text-gray-600">
              {col.items.map((it) => (
                <li key={it}>
                  <a href="#" className="hover:text-black">{it}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
