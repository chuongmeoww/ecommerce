// // import { Link } from 'react-router-dom';
// // import { useState } from 'react';
// // // Nếu bạn đã có AuthContext thì import như dưới.
// // // Nếu chưa có, file vẫn chạy vì mình có fallback bên dưới.
// // import { useAuth } from '../context/AuthContext';
// // import MegaPanel from './MegaPanel.jsx';

// // const MENU = [
// //   {
// //     label: 'Quần Áo',
// //     cols: [
// //       { title: 'Áo Thun', items: ['Cổ tròn','Polo','Tay dài','3 lỗ'] },
// //       { title: 'Áo Khoác', items: ['Parka','Kaki','Jeans','Dù','Bomber','Hoodie'] },
// //       { title: 'Sơ Mi', items: ['Tay dài','Tay ngắn','Cuban','Cổ trụ'] },
// //       { title: 'Quần', items: ['Jeans slim','Jeans straight','Tây','Jogger','Kaki'] }
// //     ]
// //   },
// //   {
// //     label: 'Phụ Kiện',
// //     cols: [
// //       { title: 'Balo', items: ['Chống sốc','Trượt nước','Bền-nhẹ','Doanh nhân'] },
// //       { title: 'Túi Đeo', items: ['Đeo chéo','Tote','Bao tử','Messenger','Duffle'] },
// //       { title: 'Nón', items: ['Lưỡi trai','Bucket','Snapback'] },
// //       { title: 'Ví / Dây nịt', items: ['Ví da','Ví canvas','Đầu gài','Đầu kim'] }
// //     ]
// //   },
// //   {
// //     label: 'Khám Phá',
// //     cols: [
// //       { title: 'Nhu cầu', items: ['Outerwear','Workwear','Denim on Denim','Gym/Thể thao'] },
// //       { title: 'Bộ sưu tập', items: ['Anime collab','Tech Lab','Phụ kiện thiết yếu'] }
// //     ]
// //   }
// // ];

// // export default function Header() {
// //   // Fallback khi chưa bọc <AuthProvider>
// //   let user = null;
// //   try {
// //     const auth = useAuth?.();
// //     user = auth?.user || null;
// //   } catch { /* ignore if context missing */ }

// //   const [openIdx, setOpenIdx] = useState(null);
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   return (
// //     <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
// //       <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
// //         {/* Mobile hamburger */}
// //         <button
// //           className="md:hidden rounded-lg border border-gray-300 px-3 py-2"
// //           onClick={() => setMobileOpen(v => !v)}
// //           aria-label="Toggle menu"
// //         >
// //           ☰
// //         </button>

// //         <Link to="/" className="text-xl font-bold text-black">Clothing-Shop</Link>

// //         {/* Search (ẩn trên mobile nhỏ) */}
// //         <div className="hidden sm:flex items-center gap-2 ml-4 flex-1">
// //           <input
// //             placeholder="Tìm sản phẩm..."
// //             className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-black/20"
// //           />
// //         </div>

// //         {/* Desktop nav + mega menu */}
// //         <nav className="ml-auto hidden md:flex items-center gap-6 relative">
// //           {MENU.map((m, i) => (
// //             <div
// //               key={m.label}
// //               className="relative"
// //               onMouseEnter={() => setOpenIdx(i)}
// //               onMouseLeave={() => setOpenIdx(null)}
// //             >
// //               <button className="hover:text-black text-gray-700">{m.label}</button>
// //               {openIdx === i && <MegaPanel cols={m.cols} />}
// //             </div>
// //           ))}

// //           {user ? (
// //             <Link to="/account" className="btn-ghost">Tài khoản</Link>
// //           ) : (
// //             <Link to="/login" className="btn-primary">Đăng nhập</Link>
// //           )}
// //           <Link to="/cart" className="btn-ghost">Giỏ</Link>
// //         </nav>
// //       </div>

// //       {/* Mobile panel */}
// //       {mobileOpen && (
// //         <div className="md:hidden border-t border-gray-200">
// //           <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
// //             <input
// //               placeholder="Tìm sản phẩm..."
// //               className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-black/20"
// //             />
// //             <div className="grid grid-cols-2 gap-2">
// //               {MENU.map(m => (
// //                 <Link key={m.label} to="/collection" className="btn-ghost text-center">{m.label}</Link>
// //               ))}
// //               {user ? (
// //                 <Link to="/account" className="btn-ghost text-center">Tài khoản</Link>
// //               ) : (
// //                 <Link to="/login" className="btn-primary text-center">Đăng nhập</Link>
// //               )}
// //               <Link to="/cart" className="btn-ghost text-center">Giỏ</Link>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   );
// // }


// // import { Link } from 'react-router-dom';
// // import { useState } from 'react';
// // import { useAuth } from '../context/AuthContext';
// // import MegaPanel from './MegaPanel.jsx';

// // const MENU = [
// //   {
// //     label: 'Quần Áo',
// //     cols: [
// //       { title: 'Áo Thun', items: ['Cổ tròn','Polo','Tay dài','3 lỗ'] },
// //       { title: 'Áo Khoác', items: ['Parka','Kaki','Jeans','Dù','Bomber','Hoodie'] },
// //       { title: 'Sơ Mi', items: ['Tay dài','Tay ngắn','Cuban','Cổ trụ'] },
// //       { title: 'Quần', items: ['Jeans slim','Jeans straight','Tây','Jogger','Kaki'] }
// //     ]
// //   },
// //   {
// //     label: 'Phụ Kiện',
// //     cols: [
// //       { title: 'Balo', items: ['Chống sốc','Trượt nước','Bền-nhẹ','Doanh nhân'] },
// //       { title: 'Túi Đeo', items: ['Đeo chéo','Tote','Bao tử','Messenger','Duffle'] },
// //       { title: 'Nón', items: ['Lưỡi trai','Bucket','Snapback'] },
// //       { title: 'Ví / Dây nịt', items: ['Ví da','Ví canvas','Đầu gài','Đầu kim'] }
// //     ]
// //   },
// //   {
// //     label: 'Khám Phá',
// //     cols: [
// //       { title: 'Nhu cầu', items: ['Outerwear','Workwear','Denim on Denim','Gym/Thể thao'] },
// //       { title: 'Bộ sưu tập', items: ['Anime collab','Tech Lab','Phụ kiện thiết yếu'] }
// //     ]
// //   }
// // ];

// // export default function Header() {
// //   const { user, logout } = useAuth();
// //   const [openIdx, setOpenIdx] = useState(null);
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   return (
// //     <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
// //       <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
// //         {/* Mobile hamburger */}
// //         <button
// //           className="md:hidden rounded-lg border border-gray-300 px-3 py-2"
// //           onClick={() => setMobileOpen(v => !v)}
// //           aria-label="Toggle menu"
// //         >
// //           ☰
// //         </button>

// //         <Link to="/" className="text-xl font-bold text-black">Clothing-Shop</Link>

// //         {/* Search */}
// //         <div className="hidden sm:flex items-center gap-2 ml-4 flex-1">
// //           <input
// //             placeholder="Tìm sản phẩm..."
// //             className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-black/20"
// //           />
// //         </div>

// //         {/* Desktop nav */}
// //         <nav className="ml-auto hidden md:flex items-center gap-6 relative">
// //           {MENU.map((m, i) => (
// //             <div
// //               key={m.label}
// //               className="relative"
// //               onMouseEnter={() => setOpenIdx(i)}
// //               onMouseLeave={() => setOpenIdx(null)}
// //             >
// //               <button className="hover:text-black text-gray-700">{m.label}</button>
// //               {openIdx === i && <MegaPanel cols={m.cols} />}
// //             </div>
// //           ))}

// //           {/* Khi CHƯA đăng nhập -> hiện Đăng nhập */}
// //           {!user && <Link to="/login" className="btn-primary">Đăng nhập</Link>}

// //           {/* Khi ĐÃ đăng nhập -> hiện Admin (nếu có), Account, Logout */}
// //           {user && (
// //             <>
// //               {user.role === 'admin' && (
// //                 <Link to="/admin/products" className="btn-ghost">Admin</Link>
// //               )}
// //               <Link to="/account" className="btn-ghost">Tài khoản</Link>
// //               <button onClick={logout} className="btn-ghost">Đăng xuất</button>
// //             </>
// //           )}

// //           <Link to="/cart" className="btn-ghost">Giỏ</Link>
// //         </nav>
// //       </div>

// //       {/* Mobile panel */}
// //       {mobileOpen && (
// //         <div className="md:hidden border-top border-gray-200">
// //           <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
// //             <input
// //               placeholder="Tìm sản phẩm..."
// //               className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-black/20"
// //             />
// //             <div className="grid grid-cols-2 gap-2">
// //               {MENU.map(m => (
// //                 <Link key={m.label} to="/collection" className="btn-ghost text-center">{m.label}</Link>
// //               ))}

// //               {/* Mobile: giống desktop logic */}
// //               {!user && <Link to="/login" className="btn-primary text-center">Đăng nhập</Link>}
// //               {user && (
// //                 <>
// //                   {user.role === 'admin' && <Link to="/admin/products" className="btn-ghost text-center">Admin</Link>}
// //                   <Link to="/account" className="btn-ghost text-center">Tài khoản</Link>
// //                   <button onClick={logout} className="btn-ghost">Đăng xuất</button>
// //                 </>
// //               )}

// //               <Link to="/cart" className="btn-ghost text-center">Giỏ</Link>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   );
// // }
// // src/components/Header.jsx
// import { useState } from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// function Avatar({ user }) {
//   if (user?.avatarUrl) {
//     return (
//       <img
//         src={user.avatarUrl}
//         alt="avatar"
//         className="w-8 h-8 rounded-full object-cover border"
//       />
//     );
//   }
//   const initial = (user?.name || user?.email || 'U')[0].toUpperCase();
//   return (
//     <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 grid place-items-center font-semibold border">
//       {initial}
//     </div>
//   );
// }

// function NavItem({ to, label, onClick }) {
//   return (
//     <NavLink
//       to={to}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'font-semibold' : ''}`
//       }
//       end
//     >
//       {label}
//     </NavLink>
//   );
// }

// function UserActions({ onDone }) {
//   const { user, logout } = useAuth();

//   if (!user) {
//     return (
//       <div className="flex items-center gap-2">
//         <Link to="/login" className="px-3 py-2 rounded hover:bg-gray-100" onClick={onDone}>
//           Đăng nhập
//         </Link>
//         <Link to="/register" className="px-3 py-2 rounded hover:bg-gray-100" onClick={onDone}>
//           Đăng ký
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center gap-2">
//       {/* Admin link nếu là admin */}
//       {user.role === 'admin' && (
//         <Link
//           to="/admin/products"
//           className="px-3 py-2 rounded hover:bg-gray-100 text-center"
//           onClick={onDone}
//         >
//           Admin
//         </Link>
//       )}

//       {/* Avatar + tài khoản */}
//       <Link
//         to="/profile"
//         className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
//         onClick={onDone}
//         title="Tài khoản"
//       >
//         <Avatar user={user} />
//         <span className="hidden sm:block">Tài khoản</span>
//       </Link>

//       {/* Đăng xuất */}
//       <button
//         onClick={() => {
//           logout();
//           onDone?.();
//         }}
//         className="px-3 py-2 rounded hover:bg-gray-100"
//       >
//         Đăng xuất
//       </button>
//     </div>
//   );
// }

// export default function Header() {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
//         {/* Left: brand + hamburger */}
//         <div className="flex items-center gap-3">
//           <button
//             className="md:hidden rounded-lg border border-gray-300 px-3 py-2"
//             onClick={() => setOpen((v) => !v)}
//             aria-label="Toggle menu"
//           >
//             ☰
//           </button>
//           <Link to="/" className="text-xl font-semibold">
//             KLTN Shop
//           </Link>
//         </div>

//         {/* Center: main nav (desktop) */}
//         <nav className="hidden md:flex items-center gap-1">
//           <NavItem to="/" label="Trang chủ" />
//           <NavItem to="/collection" label="Sản phẩm" />
//           <NavLink to="/collection" className="px-3 py-2 rounded hover:bg-gray-100">
//   Sản phẩm
// </NavLink>
//           {/* Thêm các mục khác nếu cần */}
//         </nav>

//         {/* Right: actions */}
//         <div className="flex items-center gap-2">
//           <Link to="/cart" className="px-3 py-2 rounded hover:bg-gray-100 text-center">
//             Giỏ
//           </Link>
//           <UserActions />
//         </div>
//       </div>

//       {/* Mobile drawer */}
//       {open && (
//         <div className="md:hidden border-t border-gray-200">
//           <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
//             <NavItem to="/" label="Trang chủ" onClick={() => setOpen(false)} />
//             <NavItem to="/collection" label="Sản phẩm" onClick={() => setOpen(false)} />
//             <NavLink to="/collection" className="px-3 py-2 rounded hover:bg-gray-100">
//   Sản phẩm
// </NavLink>
//             <div className="pt-2">
//               <UserActions onDone={() => setOpen(false)} />
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }
