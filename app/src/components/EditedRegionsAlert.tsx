import { DataChangeSchema } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileSliders } from 'lucide-react';
import { useMemo } from 'react';

function EditedRegionsAlert({ dataChange }: {dataChange: DataChangeSchema}) {

  const modifiedRegions = useMemo(() => Object.entries(dataChange).flatMap(([side, regions]) => 
    Object.entries(regions)
      .filter(([, value]) => value.percentage !== 0) // Filter regions with percentage !== 0
      .map(([region]) => `${side}_${region}`)  // Create strings like "lh_region"
  ), [dataChange]);

  if (modifiedRegions.length === 0) {
    return null;
  }

  return (
    <Alert>
      <FileSliders className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        {modifiedRegions[0]} {modifiedRegions.length > 1 && `and ${modifiedRegions.length - 1} other regions`} have already been modified. To use the original values select the &quot;Base&quot; prediction.
      </AlertDescription>
    </Alert>
  );
}

export default EditedRegionsAlert;