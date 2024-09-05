import DeletePrediction from './DeletePrediction';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Download, MoreHorizontal } from 'lucide-react';
import DownloadPrediction from './DownloadPrediction';

function PredictionActions({
  predictionId
}: {
  predictionId: number
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-8 w-8 p-0">
          <span className="sr-only">Open the menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='w-48'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DownloadPrediction predictionId={predictionId} />
        <DeletePrediction predictionId={predictionId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PredictionActions;