export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
        
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-semibold mb-2">Mua sắm</div>
          <ul className="space-y-1 text-gray-600">
            <li><a href="#" className="hover:text-black">Quần áo</a></li>
            <li><a href="#" className="hover:text-black">Phụ kiện</a></li>
            <li><a href="#" className="hover:text-black">Sale</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Hướng dẫn</div>
          <ul className="space-y-1 text-gray-600">
            <li><a href="#" className="hover:text-black">Chọn size</a></li>
            <li><a href="#" className="hover:text-black">Chính sách đổi trả</a></li>
            <li><a href="#" className="hover:text-black">Vận chuyển</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Về chúng tôi</div>
          <ul className="space-y-1 text-gray-600">
            <li><a href="#" className="hover:text-black">Cửa hàng</a></li>
            <li><a href="#" className="hover:text-black">Tuyển dụng</a></li>
            <li><a href="#" className="hover:text-black">Liên hệ</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Kết nối</div>
          <div className="space-x-2">
            <a href="#" className="btn-ghost">Facebook</a>
            <a href="#" className="btn-ghost">Instagram</a>
            
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center pb-6">© {new Date().getFullYear()} Clothing-Shop</div>
      
    </footer>
  );
}
