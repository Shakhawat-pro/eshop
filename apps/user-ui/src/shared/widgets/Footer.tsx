import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="w-[80%] mx-auto py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-white font-semibold mb-3">E-Shop</h3>
          <p className="leading-relaxed">Your one-stop shop for all things e-commerce. Discover products, compare prices, and enjoy fast delivery.</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Support</h4>
          <ul className="space-y-1">
            <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="/returns" className="hover:text-white transition-colors">Returns</a></li>
            <li><a href="/shipping" className="hover:text-white transition-colors">Shipping</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Company</h4>
          <ul className="space-y-1">
            <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Stay Updated</h4>
          <form className="flex flex-col gap-2">
            <input type="email" required placeholder="Email address" className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center">
        <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
