'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, Home, BarChart3 } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">BTL Calculator</span>
          </div>
          <div className="flex space-x-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Property Calculator
            </Link>
            <Link
              href="/mortgage-comparison"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/mortgage-comparison'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Mortgage Comparison
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
