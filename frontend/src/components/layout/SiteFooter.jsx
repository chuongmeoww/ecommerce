export default function SiteFooter(){
  return (
    <footer className="mt-12 border-t">
      <div className="container py-8 grid md:grid-cols-4 gap-6 text-sm text-gray-600">
        <div>
          <div className="font-semibold text-gray-800 mb-2">Ecommerce</div>
          <p>Thương hiệu thời trang • Giao nhanh • Đổi trả 7 ngày</p>
        </div>
        <div>
          <div className="font-semibold text-gray-800 mb-2">Hỗ trợ</div>
          <ul className="space-y-1">
            <li>Hotline: 0123 456 789</li>
            <li>Email: support@example.com</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-800 mb-2">Chính sách</div>
          <ul className="space-y-1">
            <li>Vận chuyển</li><li>Đổi trả</li><li>Bảo mật</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-800 mb-2">Kết nối</div>
          <div className="flex gap-3 text-gray-500">FB • IG • Tiktok</div>
        </div>
      </div>
    </footer>
  );
}
