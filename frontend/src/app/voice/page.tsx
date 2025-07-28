import { BackgroundCircleProvider } from '@/components/background-circle-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ResetChat } from '@/components/ui/reset-chat';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeTransition } from '@/components/ui/theme-transition';

export default function VoicePage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <h1 className="text-xl font-semibold">Voice Interaction</h1>
      </header>
      <BackgroundCircleProvider />
      <ThemeTransition />
    </div>
  );
}
