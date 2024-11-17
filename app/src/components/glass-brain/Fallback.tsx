import Spinner from '@/components/ui/spinner';

function Fallback() {
  return (
    <main className='h-full grid place-items-center'>
      <div className="flex items-center justify-center flex-col text-muted-foreground gap-2">
        <Spinner className='size-6'/>
        <p className='font-semibold text-center'>Loading Glass Brain...</p>
      </div>
    </main>
  );
}

export default Fallback;