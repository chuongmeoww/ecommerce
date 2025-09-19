// src/components/StarRating.jsx
import { useEffect, useMemo, useState } from 'react';

export default function StarRating({ value = 0, onChange, readOnly = false, size = 18 }) {
  const [internal, setInternal] = useState(value);
  useEffect(() => { setInternal(value); }, [value]);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);
  const w = size, h = size;

  const handleClick = (v) => {
    if (readOnly) return;
    setInternal(v);
    onChange?.(v);
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => handleClick(s)}
          className={readOnly ? 'pointer-events-none' : 'cursor-pointer'}
          aria-label={`rate-${s}`}
        >
          <svg width={w} height={h} viewBox="0 0 20 20" fill="currentColor"
               className={(internal >= s ? 'text-yellow-500' : 'text-gray-300')}>
            <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.954L10 0l2.948 5.956 6.562.954-4.755 4.635 1.123 6.545z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}
