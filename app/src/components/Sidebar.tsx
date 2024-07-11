import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturesForm from './FeaturesForm';
import { DataSchema } from '@/lib/types';

function Sidebar({
  patientId,
  baseData,
  basePercentages,
  baseCalculatedData,
}: {
  patientId: number;
  baseData: DataSchema;
  basePercentages: DataSchema | null;
  baseCalculatedData: DataSchema | null;
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
      <FeaturesForm 
        patientId={patientId}
        baseData={baseData}
        basePercentages={basePercentages}
        baseCalculatedData={baseCalculatedData}
      />
    </div>
  );
}

export default Sidebar;