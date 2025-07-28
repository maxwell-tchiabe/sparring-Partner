import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { LogoA } from '../logos/LogoA';

export function Footer() {
  return (
    <footer className="py-8 px-6 bg-gray-900 text-gray-400">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center cursor-pointer">
              <div className="flex items-center">
                <LogoA
                  width={100}
                  height={100}
                  className="hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-bold text-white">LangAI</h3>
            </div>
            <p className="text-sm mt-2">© 2025 All rights reserved</p>
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white">
              Terms
            </Link>
            <Link href="#" className="hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
