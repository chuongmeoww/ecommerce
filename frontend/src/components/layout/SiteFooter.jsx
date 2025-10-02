export default function SiteFooter(){
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-6">MERN Mart</h3>
            <p className="text-gray-400 mb-4">Your one-stop shop for all your needs. Quality products at affordable prices.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Shop</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white">All Products</a></li>
              <li><a href="#" className="hover:text-white">Featured</a></li>
              <li><a href="#" className="hover:text-white">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white">Sale Items</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Customer Service</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white">Track Order</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">About</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} MERN Mart. All rights reserved.</p>
          <div className="flex gap-6 opacity-80">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-8"/>
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" className="h-8"/>
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/paypal/paypal-original.svg" alt="PayPal" className="h-8"/>
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple Pay" className="h-8"/>
          </div>
        </div>
      </div>
    </footer>
  );
}
