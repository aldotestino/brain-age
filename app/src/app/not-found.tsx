import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

function NotFoundPage() {
  return (
    <main className='h-screen flex flex-col items-center justify-center gap-1'>
      <h1 className='text-4xl font-semibold'>404</h1>
      <h3 className='text-lg text-muted-foreground pb-3'>Patient not found.</h3>
      <Link href='/dashboard' className={buttonVariants({ size: 'lg' })}>Go to Dashboard</Link>
    </main>
  );
}

export default NotFoundPage;