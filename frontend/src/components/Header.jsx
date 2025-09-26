import { useState } from 'react';
import MiniCart from './MiniCart';

// ...
export default function Header() {
  const [openCart, setOpenCart] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* left: logo */}
        <Link to="/" className="font-semibold">Shop</Link>

        {/* right: actions */}
        <div className="flex items-center gap-3">
          <Link to="/collection" className="text-sm hover:underline">Sản phẩm</Link>
          <button onClick={() => setOpenCart(true)} className="relative">
            <span className="sr-only">Giỏ hàng</span>
            🛒
          </button>
        </div>
      </div>

      <MiniCart open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  );
}
