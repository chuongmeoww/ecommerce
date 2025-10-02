import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // dùng card sẵn của bạn; nếu chưa có, tạo tối giản
import api from "../services/api";
import { useEffect, useState } from "react";

export default function Home(){
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{
    try{ const {data}=await api.get('/products',{params:{limit:8,sort:'latest'}}); setItems(data.items||[]);}
    finally{setLoading(false);}
  })()},[]);

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <div className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Shop the Best Products Online
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover amazing deals on thousands of products. Fast delivery and excellent customer service.
              </p>
              <div className="flex gap-4">
                <Link to="/collection" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition">Shop Now</Link>
                <a href="#featured" className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium transition">Learn More</a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1600&auto=format&fit=crop" alt="Hero" className="rounded-lg shadow-xl max-w-full h-auto"/>
            </div>
          </div>
        </div>
      </div>

      {/* Categories (icon tiles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Browse through our wide range of product categories</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {label:'Electronics',to:'/collection?category=electronics',icon:'https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/devices.svg'},
            {label:'Fashion',to:'/collection?category=fashion',icon:'https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/shirt.svg'},
            {label:'Home & Kitchen',to:'/collection?category=home-kitchen',icon:'https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/home.svg'},
            {label:'Health & Beauty',to:'/collection?category=beauty',icon:'https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/heart.svg'},
          ].map(c=>(
            <Link key={c.label} to={c.to} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-40 bg-gray-100 grid place-items-center">
                <img src={c.icon} className="h-12 w-12 text-primary-500" alt=""/>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{c.label}</h3>
                <p className="text-sm text-gray-500 mt-1">Explore</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section id="featured" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Check out our most popular products this week</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse"/>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"/>
                    <div className="h-4 bg-gray-200 rounded w-1/2"/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {items.map(p=>(
                <div key={p._id||p.slug} className="product-card bg-white rounded-lg shadow-md overflow-hidden transition">
                  <Link to={`/product/${p.slug}`}>
                    <div className="relative">
                      <img src={p.images?.[0]?.url || p.images?.[0] || ''} alt={p.name} className="w-full h-48 object-cover"/>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{p.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">
                          {(p.salePrice||p.price||0).toLocaleString()}₫
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {p.salePrice ? (p.price||0).toLocaleString()+'₫' : ''}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/collection" className="inline-block border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-6 py-3 rounded-lg font-medium transition">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:flex items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-primary-100">Get the latest updates on new products and upcoming sales</p>
          </div>
          <div className="md:w-1/2">
            <form className="flex">
              <input type="email" placeholder="Your email address" className="px-4 py-3 w-full rounded-l-lg focus:outline-none"/>
              <button type="submit" className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-r-lg font-medium transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
