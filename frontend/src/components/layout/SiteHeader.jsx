import { Link } from "react-router-dom";
import { Search, User, ShoppingCart, Menu, ShoppingBag } from "lucide-react";
export default function SiteHeader(){
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <ShoppingBag className="text-primary-500 h-6 w-6"/>
          <span className="ml-2 text-xl font-bold text-gray-900">MERN Mart</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-900 hover:text-primary-500 text-sm">Home</Link>
          <Link to="/collection" className="text-gray-900 hover:text-primary-500 text-sm">Shop</Link>
          <Link to="/collection?tab=categories" className="text-gray-900 hover:text-primary-500 text-sm">Categories</Link>
          <a className="text-gray-900 hover:text-primary-500 text-sm" href="#about">About</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-900 hover:text-primary-500" aria-label="Search"><Search/></button>
          <Link to="/login" className="p-2 text-gray-900 hover:text-primary-500" aria-label="Account"><User/></Link>
          <Link to="/cart" className="p-2 text-gray-900 hover:text-primary-500 relative" aria-label="Cart">
            <ShoppingCart/>
            <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 grid place-items-center">3</span>
          </Link>
          <button className="md:hidden p-2 text-gray-900 hover:text-primary-500" aria-label="Menu"><Menu/></button>
        </div>
      </div>
    </nav>
  );
}
