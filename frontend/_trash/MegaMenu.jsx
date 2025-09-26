const MENU = [
  {
    label: 'Quần Áo',
    cols: [
      { title: 'Áo Thun', items: ['Cổ tròn', 'Polo', 'Tay dài', '3 lỗ'] },
      { title: 'Áo Khoác', items: ['Parka', 'Kaki', 'Jeans', 'Dù', 'Bomber', 'Hoodie'] },
      { title: 'Áo Sơ Mi', items: ['Tay dài', 'Tay ngắn', 'Cuban', 'Cổ trụ'] },
      { title: 'Quần Dài', items: ['Jeans slim', 'Jeans straight', 'Tây', 'Jogger', 'Kaki'] }
    ]
  },
  {
    label: 'Phụ Kiện',
    cols: [
      { title: 'Balo', items: ['Chống sốc','Trượt nước','Bền-nhẹ','Doanh nhân'] },
      { title: 'Túi Đeo', items: ['Đeo chéo','Tote','Bao tử','Messenger','Duffle'] },
      { title: 'Nón', items: ['Lưỡi trai','Bucket','Snapback'] },
      { title: 'Ví / Dây nịt', items: ['Ví da','Ví canvas','Đầu gài','Đầu kim'] }
    ]
  },
  {
    label: 'Khám Phá',
    cols: [
      { title: 'Nhu cầu', items: ['Gym/Thể thao','Outerwear','Workwear','Denim on Denim'] },
      { title: 'Bộ sưu tập', items: ['Anime collab','Tech Lab','Phụ kiện thiết yếu'] }
    ]
  }
];

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

