import { Download } from 'lucide-react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import Link from 'next/link';

function DownloadPrediction({ predictionId }: {predictionId: number}) {

  return (
    <Link href={`/api/download/${predictionId}`} target='_blank'>
      <DropdownMenuItem>
        <Download className="mr-2 h-4 w-4" />
        <span>Download prediction</span>
      </DropdownMenuItem>
    </Link>
  );
}

export default DownloadPrediction;