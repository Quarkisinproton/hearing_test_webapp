import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { History, Waves } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Waves className="h-7 w-7 mr-3 text-primary" />
          <h1 className="text-2xl font-bold font-headline tracking-tight">AudioClear</h1>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 ml-auto">
          <Button asChild variant="ghost">
            <Link href="/history">
              <History className="mr-2 h-4 w-4" />
              History
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
