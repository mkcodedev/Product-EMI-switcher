import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      {/* Benefit Badges Bar */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">100% Genuine</p>
              <p className="text-[11px] text-gray-500">Official Brand Warranty</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Free Insured Delivery</p>
              <p className="text-[11px] text-gray-500">Tracked Express Courier</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">2-Day Service Guarantee</p>
              <p className="text-[11px] text-gray-500">Brand Center Replacement</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Encrypted Transactions</p>
              <p className="text-[11px] text-gray-500">Mutual Fund-Backed EMI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-gray-500">
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">Smartphones on EMI</h4>
            <ul className="space-y-2">
              <li>Apple iPhone Series</li>
              <li>Samsung Galaxy Ultra</li>
              <li>Flagship Pro Models</li>
              <li>Refurbished Certified</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">EMI Tenure Plans</h4>
            <ul className="space-y-2">
              <li>3 & 6 Months (0% Interest)</li>
              <li>12 Months No Cost</li>
              <li>24 to 60 Months Extended</li>
              <li>Instant Mutual Fund Approval</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">Customer Support</h4>
            <ul className="space-y-2">
              <li>Shipping & Order Tracking</li>
              <li>Replacement Guidelines</li>
              <li>Unboxing Video Rules</li>
              <li>Service Center Locators</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">Privacy & Terms</h4>
            <ul className="space-y-2">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Credit Security</li>
              <li>Grievance Officer</li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">About Platform</h4>
            <p className="leading-relaxed text-[11px]">
              Dynamic EMI & product presentation engine backed by mutual fund investments and direct MongoDB catalog management.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} 1Fi / Snapmint Partner Platform. All rights reserved.</p>
          <p>Strict Schema Verification • MongoDB GridFS Streaming</p>
        </div>
      </div>
    </footer>
  );
}