import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/sections/HeroSection';
export default async function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
    </main>
  );
}
