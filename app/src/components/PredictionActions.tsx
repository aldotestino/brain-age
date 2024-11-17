import DeletePrediction from './DeletePrediction';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import DownloadPrediction from './DownloadPrediction';

function PredictionActions({
  predictionId,
  isBase
}: {
  predictionId: number;
  isBase: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open the menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='w-48'>
        <DownloadPrediction predictionId={predictionId} />
        <DeletePrediction predictionId={predictionId} isBase={isBase} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PredictionActions;