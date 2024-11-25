import { Loader2 } from 'lucide-react';

function LoadingDashbard() {
  return (
    <main className="h-screen grid place-items-center text-muted-foreground">
      <div className="flex items-center gap-2">
        <Loader2 className="size-6 animate-spin" />
        <p className="font-semibold text-lg">Loading patients...</p>
      </div>
    </main>
  );
}

export default LoadingDashbard;