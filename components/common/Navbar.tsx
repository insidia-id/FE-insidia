import Link from 'next/link';
import { BookOpen, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" aria-hidden="true" />
          </span>
          <span>Insidia</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild size="lg">
            <Link href="/login">
              <LogIn className="size-4" aria-hidden="true" />
              Masuk
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
