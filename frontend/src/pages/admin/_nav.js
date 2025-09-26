// src/pages/admin/_nav.js
const nav = [
  { type: 'item', to: '/admin', label: 'Tổng quan', icon: 'cil-speedometer' },
  { type: 'group', label: 'Sản phẩm', items: [
    { to: '/admin/products', label: 'Danh sách' },
    { to: '/admin/products/new', label: 'Thêm mới' },
  ]},
  { type: 'item', to: '/admin/orders', label: 'Đơn hàng', icon: 'cil-basket' },
  { type: 'item', to: '/admin/users', label: 'Người dùng', icon: 'cil-people' },
]
export default nav
