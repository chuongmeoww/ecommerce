import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { extractError } from '../../services/api';

const empty = { name:'', slug:'', price:'', salePrice:'', category:'', brand:'', stock:'0', imagesText:'', description:'', colorsText:'', sizesText:'', status:'active', sku:'' };

export default function ProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [values, setValues] = useState(empty);
  const [err, setErr] = useState(null);
  const editing = !!id;

  useEffect(() => {
    if (!editing) return;
    (async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        setValues({
          ...empty,
          name: p.name, slug: p.slug, price: p.price, salePrice: p.salePrice ?? '',
          category: p.category ?? '', brand: p.brand ?? '', stock: p.stock ?? 0,
          imagesText: (p.images||[]).map(i=>i.url).join('\n'),
          description: p.description ?? '',
          colorsText: (p.colors||[]).join(','),
          sizesText: (p.sizes||[]).join(','),
          status: p.status, sku: p.sku ?? ''
        });
      } catch (e) { setErr(extractError(e)); }
    })();
  }, [editing, id]);

  const handleChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setErr(null);
    try {
      const payload = {
        name: values.name,
        slug: values.slug || undefined,
        price: Number(values.price),
        salePrice: values.salePrice ? Number(values.salePrice) : undefined,
        category: values.category || undefined,
        brand: values.brand || undefined,
        stock: Number(values.stock || 0),
        images: values.imagesText ? values.imagesText.split(/\n+/).map(u => ({ url: u.trim() })).filter(Boolean) : [],
        description: values.description || undefined,
        colors: values.colorsText ? values.colorsText.split(',').map(s=>s.trim()).filter(Boolean) : [],
        sizes: values.sizesText ? values.sizesText.split(',').map(s=>s.trim()).filter(Boolean) : [],
        status: values.status,
        sku: values.sku || undefined
      };
      if (editing) await api.put(`/admin/products/${id}`, payload);
      else await api.post(`/admin/products`, payload);
      nav('/admin/products');
    } catch (e) { setErr(extractError(e)); }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
      {err && <div className="error-text mb-3">{err.message}</div>}

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div><div className="label">Tên</div><input name="name" value={values.name} onChange={handleChange} className="input" required /></div>
          <div><div className="label">Slug (bỏ trống để tự tạo)</div><input name="slug" value={values.slug} onChange={handleChange} className="input" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="label">Giá</div><input name="price" type="number" value={values.price} onChange={handleChange} className="input" required /></div>
            <div><div className="label">Giá sale</div><input name="salePrice" type="number" value={values.salePrice} onChange={handleChange} className="input" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="label">Danh mục</div><input name="category" value={values.category} onChange={handleChange} className="input" /></div>
            <div><div className="label">Thương hiệu</div><input name="brand" value={values.brand} onChange={handleChange} className="input" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="label">Kho</div><input name="stock" type="number" value={values.stock} onChange={handleChange} className="input" /></div>
            <div><div className="label">SKU</div><input name="sku" value={values.sku} onChange={handleChange} className="input" /></div>
          </div>
          <div><div className="label">Màu (phân cách bằng dấu phẩy)</div><input name="colorsText" value={values.colorsText} onChange={handleChange} className="input" placeholder="Đen, Trắng, Xanh..." /></div>
          <div><div className="label">Size (phân cách bằng dấu phẩy)</div><input name="sizesText" value={values.sizesText} onChange={handleChange} className="input" placeholder="S, M, L, XL..." /></div>
          <div><div className="label">Mô tả</div><textarea name="description" value={values.description} onChange={handleChange} className="input min-h-[120px]" /></div>
        </div>

        <div className="space-y-3">
          <div><div className="label">Ảnh (mỗi dòng 1 URL)</div><textarea name="imagesText" value={values.imagesText} onChange={handleChange} className="input min-h-[220px]" placeholder="https://..." /></div>
          <div><div className="label">Trạng thái</div>
            <select name="status" value={values.status} onChange={handleChange} className="input">
              <option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option>
            </select>
          </div>
          <div className="pt-2"><button className="btn-primary w-full">{editing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</button></div>
        </div>
      </form>
    </div>
  );
}
// export default function ProductForm() {
//   return <div className="card">Form sản phẩm (admin)</div>;
// }
