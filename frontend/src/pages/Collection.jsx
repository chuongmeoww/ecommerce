import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Container from "../components/layout/Container";
import ProductGrid from "../components/commerce/ProductGrid";
import { listProducts } from "../services/products";

const SORTS = [
  { v: "latest", label: "Mới nhất" },
  { v: "priceAsc", label: "Giá tăng dần" },
  { v: "priceDesc", label: "Giá giảm dần" },
  { v: "best", label: "Bán chạy" },
];

const COLLECTIONS = [
  { slug: "khuyen-mai", label: "Khuyến mãi" },
  { slug: "ao", label: "Áo" },
  { slug: "quan", label: "Quần" },
  { slug: "phu-kien-thoi-trang", label: "Phụ kiện" },
];

export default function Collection() {
  const [sp, setSp] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0 });

  const state = useMemo(() => {
    return {
      q: sp.get("q") || "",
      collection: sp.get("collection") || "",
      priceMin: sp.get("min") || "",
      priceMax: sp.get("max") || "",
      sort: sp.get("sort") || "latest",
      page: Number(sp.get("page") || 1),
      limit: Number(sp.get("limit") || 24),
    };
  }, [sp]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const { items, pagination } = await listProducts({
          q: state.q || undefined,
          collection: state.collection || undefined,
          priceMin: state.priceMin || undefined,
          priceMax: state.priceMax || undefined,
          sort: state.sort || undefined,
          page: state.page,
          limit: state.limit,
        });
        if (!alive) return;
        setItems(items || []);
        setPagination(pagination || { page: 1, limit: state.limit, total: items?.length || 0 });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [state.q, state.collection, state.priceMin, state.priceMax, state.sort, state.page, state.limit]);

  function patch(params) {
    const next = new URLSearchParams(sp);
    Object.entries(params).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    // reset page khi đổi filter/sort
    if (params.collection !== undefined || params.min !== undefined || params.max !== undefined || params.sort !== undefined) {
      next.set("page", "1");
    }
    setSp(next, { replace: true });
  }

  const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / state.limit));

  return (
    <Container className="py-6 grid lg:grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-3 space-y-6">
        <div className="rounded-xl border bg-white p-4">
          <div className="font-semibold mb-3">Bộ sưu tập</div>
          <div className="flex flex-col gap-2 text-sm">
            <button
              className={`text-left px-2 py-1 rounded ${!state.collection ? "bg-black text-white" : "hover:bg-gray-50"}`}
              onClick={() => patch({ collection: "" })}
            >Tất cả</button>
            {COLLECTIONS.map(c => (
              <button
                key={c.slug}
                className={`text-left px-2 py-1 rounded ${state.collection === c.slug ? "bg-black text-white" : "hover:bg-gray-50"}`}
                onClick={() => patch({ collection: c.slug })}
              >{c.label}</button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="font-semibold mb-3">Khoảng giá</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              inputMode="numeric"
              placeholder="Từ"
              value={state.priceMin}
              onChange={(e) => patch({ min: e.target.value })}
            />
            <input
              className="input"
              inputMode="numeric"
              placeholder="Đến"
              value={state.priceMax}
              onChange={(e) => patch({ max: e.target.value })}
            />
          </div>
        </div>
      </aside>

      {/* Content */}
      <section className="lg:col-span-9 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {pagination.total || 0} sản phẩm
            {state.collection ? <> · <span className="font-medium">{state.collection}</span></> : null}
          </div>
          <div className="flex items-center gap-2">
            <select
              className="input"
              value={state.sort}
              onChange={(e) => patch({ sort: e.target.value })}
            >
              {SORTS.map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-500">Đang tải…</div>
        ) : items.length ? (
          <ProductGrid items={items} />
        ) : (
          <div className="text-sm text-gray-500">Không có sản phẩm phù hợp.</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-3 flex items-center justify-center gap-2">
            <button
              className="btn-ghost"
              disabled={state.page <= 1}
              onClick={() => patch({ page: state.page - 1 })}
            >Trước</button>
            <div className="text-sm">Trang {state.page}/{totalPages}</div>
            <button
              className="btn-ghost"
              disabled={state.page >= totalPages}
              onClick={() => patch({ page: state.page + 1 })}
            >Sau</button>
          </div>
        )}
      </section>
    </Container>
  );
}
