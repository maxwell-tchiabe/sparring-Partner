import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const features = [
  'Unlimited chat messages',
  'Priority AI responses',
  'Access to advanced AI models',
  'Voice message support',
  'Image and PDF uploads',
  'Personalized learning insights',
  'Early access to new features',
  'Premium support',
];

export default function UpgradePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-lg w-full p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Upgrade to Premium
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Unlock the full power of your AI Sparring Partner with Premium
          features:
        </p>
        <ul className="w-full mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 py-2">
              <CheckCircle className="text-green-500 w-5 h-5" />
              <span className="text-gray-800 text-lg">{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="/checkout">
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-lg transition-all shadow-md">
            Upgrade Now
          </button>
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Cancel anytime. 30-day money-back guarantee.
        </p>
      </div>
    </div>
  );
}
