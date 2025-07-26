import React from "react";
import { Link } from "wouter";

export function Footer() {
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
              <li><Link href="/" className="hover:text-white">Browse Products</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white">Make Offers</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Track Orders</Link></li>
              <li><Link href="/returns" className="hover:text-white">Return Policy</Link></li>
              <li><Link href="/safety" className="hover:text-white">Buyer Protection</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/products/new" className="hover:text-white">List Products</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Manage Offers</Link></li>
              <li><Link href="/seller-guidelines" className="hover:text-white">Seller Guidelines</Link></li>
              <li><Link href="/commission" className="hover:text-white">Commission Structure</Link></li>
              <li><Link href="/support" className="hover:text-white">Seller Support</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/safety" className="hover:text-white">Safety Tips</Link></li>
              <li><Link href="/disputes" className="hover:text-white">Dispute Resolution</Link></li>
              <li><Link href="/community" className="hover:text-white">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Vinimai. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
