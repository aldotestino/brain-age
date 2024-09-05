'use client';

import { Download } from 'lucide-react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { useToast } from './ui/use-toast';

function DownloadPrediction({ predictionId }: {predictionId: number}) {

  const { toast } = useToast();

  async function onDownload() {
    const response = await fetch(`/api/download/${predictionId}`);
    if (!response.ok) {
      toast({
        title: 'Error',
        description: 'Failed to download prediction',
        variant: 'destructive'
      });
      return;
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prediction_${predictionId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <DropdownMenuItem onClick={onDownload}>
      <Download className="mr-2 h-4 w-4" />
      <span>Download prediction</span>
    </DropdownMenuItem>
  );
}

export default DownloadPrediction;