import { ArrowLeft } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import FeaturesForm from './FeaturesForm';
import { DataSchema } from '@/lib/types';
import Link from 'next/link';

function Sidebar({
  patientId,
  baseData,
  basePercentages,
  baseCalculatedData,
  email,
  firstName,
  lastName
}: {
  patientId: number;
  baseData: DataSchema;
  basePercentages: DataSchema | null;
  baseCalculatedData: DataSchema | null;
  email: string;
  firstName: string;
  lastName: string;
}) {
  return (
    <div className="w-80 border-r grid grid-rows-[auto,1fr] overflow-y-hidden">
      <div className="p-4 flex items-center justify-between gap-2 border-b">
        <div className="grid grid-cols-[auto,1fr] gap-2">
          <Link href="/dashboard" className={buttonVariants({ size:'icon', variant:'ghost', className:'w-8 h-8 p-0' })}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className='min-w-0'>
            <h1 className="text-xl font-semibold truncate">{firstName} {lastName}</h1>
            <p className='text-muted-foreground text-sm truncate'>{email}</p>
          </div>
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