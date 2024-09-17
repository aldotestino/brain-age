import DotPattern from '@/components/magicui/dot-pattern';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import AppScreen from './app.png';
import Link from 'next/link';

function page() {
  return (
    <div className="relative w-full h-screen container grid place-items-center">
      <div className='z-10 grid gap-4 place-items-center'>
        <h1 className="text-4xl sm:text-7xl font-bold z-20 bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-500 pb-2">
          Brain Age
        </h1>
        <div className='w-3/5 shadow-lg p-1.5 bg-muted rounded-lg'>
          <Image priority src={AppScreen} quality={90} alt='app screenshot' className="object-cover" />
        </div>
        <Link href="/dashboard">
          <Button variant="expandIcon" size="lg" Icon={ArrowRightIcon} iconPlacement="right">
            Go to Dashboard
          </Button>
        </Link>
      </div>
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]',
        )}
      />
    </div>
  );
}

export default page;