'use client';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import Spinner from '@/components/ui/spinner';
import { deletePatient } from '@/server/actions';
import { useToast } from './ui/use-toast';

function DeletePatientAlert({
  patientId
}: {
  patientId: number;
}) {

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function onDelete() {
    setIsSubmitting(true);
    await deletePatient(patientId);
    setIsSubmitting(false);
    setOpen(false);
    toast({
      title: 'Sucess',
      description: 'Patient deleted successfully',
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className='gap-8'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the patient with id {patientId} and remove his data from the server.
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

export default DeletePatientAlert;