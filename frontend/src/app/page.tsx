'use client';
import { Button } from '@/components/common/Button';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, BarChart2, MessageSquare, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProtectedAction = (path: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                AI-Powered Language Learning Assistant
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                A multimodal platform for personalized language learning with
                real-time feedback and adaptive exercises.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => handleProtectedAction('/chat')}
                  className="bg-white text-blue-700 hover:bg-blue-50 cursor-pointer"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleProtectedAction('/dashboard')}
                  className="border-white text-white hover:bg-blue-600 cursor-pointer"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl">
                <div className="bg-white text-gray-800 p-4 rounded-lg mb-4">
                  <p className="font-medium">
                    Hello! How can I help you learn today?
                  </p>
                </div>
                <div className="bg-blue-500 p-4 rounded-lg text-right">
                  <p>I'd like to practice my Spanish conversation skills.</p>
                </div>
                <div className="bg-white text-gray-800 p-4 rounded-lg mt-4">
                  <p className="font-medium">
                    ¡Claro! Vamos a practicar. ¿Cómo estuvo tu día hoy?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-blue-500" />}
              title="Multimodal Chat"
              description="Interact using text, voice, images, and PDFs for a comprehensive learning experience."
            />
            <FeatureCard
              icon={<BarChart2 className="h-8 w-8 text-green-500" />}
              title="Progress Tracking"
              description="Monitor your vocabulary growth, grammar improvements, and overall language proficiency."
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8 text-purple-500" />}
              title="Personalized Learning"
              description="AI-tailored exercises and feedback based on your specific learning patterns and needs."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="This platform has revolutionized how I learn languages. The real-time feedback is incredibly helpful!"
              author="Sarah K."
              role="Spanish Learner"
            />
            <TestimonialCard
              quote="As a teacher, the admin tools make it easy to track my students' progress and create personalized assignments."
              author="Michael T."
              role="Language Instructor"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your language learning?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of learners who have accelerated their language
            proficiency with our AI assistant.
          </p>

          <Button
            onClick={() => handleProtectedAction('/chat')}
            className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg cursor-pointer"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </Layout>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <p className="text-gray-700 mb-4">"{quote}"</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}
