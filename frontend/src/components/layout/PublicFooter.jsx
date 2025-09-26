import Container from './Container';
export default function PublicFooter(){
  return (
    <footer className="mt-12 border-t border-[var(--border)] bg-white">
      <Container className="py-10 text-sm text-slate-600">
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold text-slate-900 mb-2">Ecommerce</div>
            <p>Hàng đẹp · Giá tốt · Giao nhanh.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-2">Hỗ trợ</div>
            <ul className="space-y-1">
              <li>Chính sách đổi trả</li>
              <li>Phương thức thanh toán</li>
              <li>Liên hệ</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-2">Kết nối</div>
            <p>Facebook · Instagram · Zalo</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}