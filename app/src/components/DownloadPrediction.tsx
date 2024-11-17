import { Download } from 'lucide-react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import Link from 'next/link';

function DownloadPrediction({ predictionId }: {predictionId: number}) {

  return (
    <Link href={`/api/download/${predictionId}`} target='_blank'>
      <DropdownMenuItem>
        <Download className="size-4 mr-2" />
        Download prediction
      </DropdownMenuItem>
    </Link>
  );
}

export default DownloadPrediction;