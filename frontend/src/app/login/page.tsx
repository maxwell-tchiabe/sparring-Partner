'use client';

import { AuthForm } from '@/components/auth/AuthForm';
import { Layout } from '@/components/layout/Layout';

export default function LoginPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">
              Sign in to continue your learning journey
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </Layout>
  );
}
