// // src/components/HeaderYame.jsx
// import { useEffect, useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { countItems as cartCount } from "../services/cart";

// const NAV = [
//   { label: "Khuyến mãi", to: "/collection?collection=khuyen-mai" },
//   { label: "GU", to: "/collection?collection=gu" },
//   { label: "Áo", to: "/collection?collection=ao" },
//   { label: "Quần", to: "/collection?collection=quan" },
//   { label: "Phụ kiện", to: "/collection?collection=phu-kien-thoi-trang" },
// ];

// function useCartBadge() {
//   const [n, setN] = useState(cartCount());
//   useEffect(() => {
//     const onChange = () => setN(cartCount());
//     window.addEventListener("cart_changed", onChange);
//     return () => window.removeEventListener("cart_changed", onChange);
//   }, []);
//   return n;
// }

// export default function HeaderYame() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const cartN = useCartBadge();

//   const [q, setQ] = useState("");
//   const [openMobile, setOpenMobile] = useState(false);
//   const [openUser, setOpenUser] = useState(false);

//   const isAdmin = user?.role === "admin" || user?.isAdmin;

//   const submitSearch = (e) => {
//     e.preventDefault();
//     const term = q.trim();
//     navigate(term ? `/collection?q=${encodeURIComponent(term)}` : "/collection");
//     setOpenMobile(false);
//   };

//   const linkCls = ({ isActive }) =>
//     `px-3 py-2 rounded-lg text-sm ${
//       isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
//     }`;

//   return (
//     <header className="sticky top-0 z-[60] border-b bg-white">
//       {/* Top bar */}
//       <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center gap-3">
//         {/* Mobile menu button */}
//         <button
//           className="md:hidden -ml-2 p-2 rounded-lg hover:bg-gray-100"
//           aria-label="Menu"
//           onClick={() => setOpenMobile((v) => !v)}
//         >
//           ☰
//         </button>

//         {/* Logo */}
//         <Link to="/" className="font-extrabold text-lg tracking-tight">
//           YAME
//         </Link>

//         {/* Search (desktop) */}
//         <form onSubmit={submitSearch} className="hidden md:flex items-center gap-2 flex-1">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Tìm sản phẩm…"
//             className="w-full h-10 rounded-xl border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-black"
//           />
//           <button className="h-10 px-3 rounded-lg border hover:bg-gray-50">Tìm</button>
//         </form>

//         {/* Right actions */}
//         <div className="ml-auto flex items-center gap-1">
//           {!user ? (
//             <>
//               <Link to="/login" className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
//                 Đăng nhập
//               </Link>
//               <Link to="/register" className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
//                 Đăng ký
//               </Link>
//             </>
//           ) : (
//             <div className="relative">
//               <button
//                 onClick={() => setOpenUser((v) => !v)}
//                 className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
//               >
//                 👤 {user.name || "Tài khoản"}
//               </button>
//               {openUser && (
//                 <div
//                   className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-lg overflow-hidden"
//                   onMouseLeave={() => setOpenUser(false)}
//                 >
//                   <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50">
//                     Hồ sơ
//                   </Link>
//                   <Link to="/orders" className="block px-3 py-2 text-sm hover:bg-gray-50">
//                     Đơn hàng
//                   </Link>
//                   {user?.role === 'admin' && (
//   <Link to="/admin" className="btn-ghost">Quản trị</Link>
// )}
//                   <button
//                     onClick={() => {
//                       logout();
//                       setOpenUser(false);
//                     }}
//                     className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
//                   >
//                     Đăng xuất
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           <Link to="/cart" className="relative px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
//             🛒
//             {cartN > 0 && (
//               <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-black text-white text-[11px] grid place-items-center">
//                 {cartN}
//               </span>
//             )}
//           </Link>
//         </div>
//       </div>

//       {/* Primary nav: đơn giản, không dropdown, có thể scroll ngang khi hẹp */}
//       <nav className="border-t bg-white">
//         <div className="max-w-screen-2xl mx-auto px-2 h-11 flex items-center gap-1 overflow-x-auto no-scrollbar">
//           {NAV.map((n) => (
//             <NavLink key={n.to} to={n.to} className={linkCls}>
//               {n.label}
//             </NavLink>
//           ))}
//         </div>
//       </nav>

//       {/* Mobile panel: tìm kiếm + link thẳng */}
//       {openMobile && (
//         <div className="md:hidden border-t bg-white">
//           <div className="px-4 py-3">
//             <form onSubmit={submitSearch} className="flex gap-2">
//               <input
//                 value={q}
//                 onChange={(e) => setQ(e.target.value)}
//                 placeholder="Tìm sản phẩm…"
//                 className="flex-1 h-10 rounded-xl border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-black"
//               />
//               <button className="h-10 px-3 rounded-lg border hover:bg-gray-50">Tìm</button>
//             </form>
//           </div>
//           <div className="px-2 pb-3 grid gap-1">
//             {NAV.map((n) => (
//               <NavLink
//                 key={n.to}
//                 to={n.to}
//                 className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
//                 onClick={() => setOpenMobile(false)}
//               >
//                 {n.label}
//               </NavLink>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
