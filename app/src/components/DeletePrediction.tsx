'use client';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Spinner from '@/components/ui/spinner';
import { Trash2 } from 'lucide-react';
import { deletePrediction } from '@/server/actions';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { useToast } from './ui/use-toast';

function DeletePrediction({
  predictionId,
  isBase
}: {
  predictionId: number;
  isBase: boolean;
}) {

  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function onDelete() {
    setIsSubmitting(true);
    await deletePrediction(predictionId);
    setIsSubmitting(false);
    setOpen(false);
    toast({
      title: 'Success',
      description: 'Prediction deleted successfully',
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()} disabled={isBase}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete prediction</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the prediction and remove its data from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>     
          <Button onClick={onDelete} variant="destructive" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="mr-2" />}
              Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeletePrediction;