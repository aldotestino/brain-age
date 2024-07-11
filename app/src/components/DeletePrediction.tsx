'use client';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Spinner from '@/components/ui/spinner';
import { Trash2 } from 'lucide-react';
import { deletePrediction } from '@/server/actions';

function DeletePrediction({
  predictionId
}: {
  predictionId: number;
}) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function onDelete() {
    setIsSubmitting(true);
    await deletePrediction(predictionId);
    setIsSubmitting(false);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="link" className='text-destructive space-x-2 p-0'>
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </Button>
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