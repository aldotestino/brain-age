import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturesForm from './FeaturesForm';
import { Values } from '@/lib/types';

function Sidebar({
  onSubmit,
  isLoading
}: {
  onSubmit: (values: Values) => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <div className="w-80 border-r grid grid-rows-[auto,1fr] overflow-y-hidden">
      <div className="p-4 flex items-center justify-between gap-2 border-b">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="w-8 h-8 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Patient 1</h1>
        </div>
      </div>
      <FeaturesForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}

export default Sidebar;