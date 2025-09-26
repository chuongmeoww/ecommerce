import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { extractError } from '../../services/api';

const empty = {
  name:'', slug:'', sku:'', price:'', salePrice:'', weight:'',
  collection:'', description:'',
  imagesText:'',
  sizesText:'', colorsText:'',
  status:'active', stock:'0'
};

function Field({ label, children, required }) {
  return (
    <label className="block">
      <div className="text-sm text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      {children}
    </label>
  );
}

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
        setValues(v => ({
          ...v,
          name: p.name,
          slug: p.slug || '',
          sku: p.sku || '',
          price: p.price ?? '',
          salePrice: p.salePrice ?? '',
          weight: p.weight ?? '',
          collection: p.collection ?? '',
          description: p.description ?? '',
          imagesText: (p.images || []).map(i => i.url).join('\n'),
          sizesText: (p.sizes || []).join(','),
          colorsText: (p.colors || []).join(','),
          status: p.status || 'active',
          stock: p.stock ?? 0
        }));
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
        sku: values.sku || undefined,
        price: Number(values.price) || 0,
        salePrice: values.salePrice ? Number(values.salePrice) : undefined,
        weight: values.weight ? Number(values.weight) : undefined,
        collection: values.collection || undefined,
        description: values.description || undefined,
        images: values.imagesText
          ? values.imagesText.split(/\n+/).map(u => ({ url: u.trim() })).filter(Boolean)
          : [],
        sizes: values.sizesText ? values.sizesText.split(',').map(s=>s.trim()).filter(Boolean) : [],
        colors: values.colorsText ? values.colorsText.split(',').map(s=>s.trim()).filter(Boolean) : [],
        status: values.status,
        stock: Number(values.stock || 0)
      };
      if (editing) await api.patch(`/admin/products/${id}`, payload);
      else await api.post(`/admin/products`, payload);
      nav('/admin/products');
    } catch (e) { setErr(extractError(e)); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="section-h1">{editing ? 'Edit product' : 'Create a new product'}</div>
        <div className="flex items-center gap-2">
          <Link to="/admin/products" className="btn">Cancel</Link>
          <button className="btn-primary">{editing ? 'Save changes' : 'Create'}</button>
        </div>
      </div>

      {err && <div className="text-red-600 text-sm">{err.message}</div>}

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* LEFT */}
        <div className="space-y-4">
          {/* General */}
          <div className="card">
            <div className="card-hd">General</div>
            <div className="card-bd grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Name" required>
                  <input className="input" name="name" value={values.name} onChange={handleChange} required />
                </Field>
              </div>
              <Field label="SKU">
                <input className="input" name="sku" value={values.sku} onChange={handleChange} />
              </Field>
              <Field label="Slug">
                <input className="input" name="slug" value={values.slug} onChange={handleChange} />
              </Field>

              <Field label="Price">
                <input className="input" type="number" name="price" value={values.price} onChange={handleChange} />
              </Field>
              <Field label="Sale price">
                <input className="input" type="number" name="salePrice" value={values.salePrice} onChange={handleChange} />
              </Field>

              <Field label="Collection">
                <input className="input" name="collection" placeholder="ao | quan | phu-kien-thoi-trang | khuyen-mai"
                  value={values.collection} onChange={handleChange} />
              </Field>
              <Field label="Weight (kg)">
                <input className="input" type="number" step="0.001" name="weight" value={values.weight} onChange={handleChange} />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Description">
                  <textarea className="textarea" name="description" value={values.description} onChange={handleChange} />
                </Field>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="card">
            <div className="card-hd">Media</div>
            <div className="card-bd">
              <Field label="Image URLs (1 per line)">
                <textarea className="textarea" name="imagesText" placeholder="https://..." value={values.imagesText} onChange={handleChange} />
              </Field>
              <div className="muted mt-2">* Hỗ trợ dán nhiều dòng. Ảnh đầu tiên là ảnh chính.</div>
            </div>
          </div>

          {/* Attributes */}
          <div className="card">
            <div className="card-hd">Attributes</div>
            <div className="card-bd grid sm:grid-cols-2 gap-4">
              <Field label="Sizes (comma separated)">
                <input className="input" name="sizesText" placeholder="S, M, L, XL" value={values.sizesText} onChange={handleChange} />
              </Field>
              <Field label="Colors (comma separated)">
                <input className="input" name="colorsText" placeholder="Đen, Trắng, Xanh" value={values.colorsText} onChange={handleChange} />
              </Field>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {/* Product status */}
          <div className="card">
            <div className="card-hd">Product status</div>
            <div className="card-bd space-y-4">
              <Field label="Status">
                <select name="status" value={values.status} onChange={handleChange} className="select">
                  <option value="active">Enabled</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
              <div>
                <div className="text-sm text-gray-700 mb-1">Visibility</div>
                <div className="muted">Visible</div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="card">
            <div className="card-hd">Inventory</div>
            <div className="card-bd space-y-4">
              <div className="switch">
                <input type="checkbox" checked readOnly />
                <span>Manage stock</span>
              </div>
              <Field label="Stock availability">
                <div className="muted">In stock</div>
              </Field>
              <Field label="Quantity">
                <input className="input" type="number" name="stock" value={values.stock} onChange={handleChange} />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}