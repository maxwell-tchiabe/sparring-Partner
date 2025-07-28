'use client';
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

const plans = [
  {
    name: 'Basic',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Limited chat messages',
      'Standard AI responses',
      'Community support',
    ],
    cta: 'Current Plan',
    highlight: false,
    disabled: true,
  },
  {
    name: 'Pro',
    price: { monthly: 9.99, yearly: 99.99 },
    features: [
      'Unlimited chat messages',
      'Priority AI responses',
      'Access to advanced AI models',
      'Voice message support',
      'Image and PDF uploads',
      'Personalized learning insights',
      'Early access to new features',
      'Premium support',
    ],
    cta: 'Upgrade Now',
    highlight: true,
    disabled: false,
  },
  {
    name: 'Enterprise',
    price: { monthly: 39.99, yearly: 399.99 },
    features: [
      'All Pro features',
      'Custom integrations',
      'Dedicated account manager',
      'Team management',
      'SLA & priority support',
    ],
    cta: 'Contact Sales',
    highlight: false,
    disabled: false,
  },
];

export default function UpgradePage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-4xl w-full p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Upgrade Your Plan
        </h1>
        <div className="flex gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-l-lg font-semibold border transition-all ${billing === 'monthly' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg font-semibold border transition-all ${billing === 'yearly' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            onClick={() => setBilling('yearly')}
          >
            Yearly
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col items-center rounded-2xl border shadow-md p-6 bg-white relative ${plan.highlight ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}
            >
              {plan.highlight && (
                <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                  Most Popular
                </span>
              )}
              <h2 className="text-xl font-bold mb-2 text-indigo-700">
                {plan.name}
              </h2>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl font-extrabold text-indigo-700">
                  {plan.price[billing] === 0
                    ? 'Free'
                    : `$${plan.price[billing]}`}
                </span>
                {plan.price[billing] !== 0 && (
                  <span className="text-base text-gray-500 mb-1">
                    / {billing}
                  </span>
                )}
              </div>
              <ul className="mb-6 w-full">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 py-1">
                    <CheckCircle className="text-green-500 w-4 h-4" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.disabled ? (
                <Button
                  disabled
                  variant="secondary"
                  className="w-full opacity-60 cursor-not-allowed"
                >
                  {plan.cta}
                </Button>
              ) : plan.name === 'Enterprise' ? (
                <a href="mailto:sales@example.com" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-600 text-indigo-700 font-bold"
                  >
                    {plan.cta}
                  </Button>
                </a>
              ) : (
                <Link href="/checkout" className="w-full">
                  <Button
                    variant={plan.highlight ? 'primary' : 'outline'}
                    className={`w-full ${plan.highlight ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold' : 'border-indigo-600 text-indigo-700 font-bold'}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-8 text-center">
          Cancel anytime. 30-day money-back guarantee.
        </p>
      </div>
    </div>
  );
}
