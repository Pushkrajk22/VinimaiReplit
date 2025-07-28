import React from "react";
import { Link, useLocation } from "wouter";

export function Footer() {
  const [, setLocation] = useLocation();

  const handleNavigation = (href: string) => {
    setLocation(href);
    // Scroll to top of page smoothly
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="vinimai-logo w-fit mb-4">
              VINIMAI
            </div>
            <p className="text-gray-400 mb-4">
              Safe and trusted exchange platform connecting individuals across India.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="font-semibold mb-4">For Buyers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => handleNavigation('/browse')} className="hover:text-white">Browse Products</button></li>
              <li><button onClick={() => handleNavigation('/track-orders')} className="hover:text-white">Track Orders</button></li>
              <li><button onClick={() => handleNavigation('/return-policy')} className="hover:text-white">Return Policy</button></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => handleNavigation('/list-product')} className="hover:text-white">List Product</button></li>
              <li><button onClick={() => handleNavigation('/seller-guidelines')} className="hover:text-white">Seller Guidelines</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => handleNavigation('/contact')} className="hover:text-white">Contact Us</button></li>
              <li><button onClick={() => handleNavigation('/community-guidelines')} className="hover:text-white">Community Guidelines</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Vinimai. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 sm:mt-0">
            <button onClick={() => handleNavigation('/privacy-policy')} className="hover:text-white">Privacy Policy</button>
            <button onClick={() => handleNavigation('/cookie-policy')} className="hover:text-white">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
