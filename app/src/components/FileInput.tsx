'use client';

import { FileJson2, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import Dropzone from 'react-dropzone';
import { cn } from '@/lib/utils';

function FileInput({
  onChange,
  onRemoveFile,
  onError
}: {
  onChange: (...event: any[]) => void;
  onRemoveFile: () => void;
  onError: () => void;
}) {

  const [file, setFile] = useState<File | null>(null);
  
  function handleOnDrop(files: File[]) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const json = JSON.parse(e.target?.result as string);
        onChange(json);
        setFile(file);
      } catch (error) {
        onError();
      }
    };
    reader.readAsText(file);
  }

  if(file) {
    return (
      <div className='flex items-center justify-between gap-2 p-4 border-2 border-dashed rounded-md w-full'>
        <div className='flex items-center gap-2 w-full'>
          <FileJson2 className='w-6 h-6' />
          <span className='text-sm'>{file.name}</span>
        </div>
        <Button 
          variant='ghost' 
          size="sm"
          className='space-x-2 text-destructive hover:text-destructive'
          onClick={() => {
            setFile(null);
            onRemoveFile();
          }}>
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>
    );
  }

  return (
    <Dropzone 
      onDrop={handleOnDrop} 
      multiple={false} 
      accept={{
        'application/json': ['.json']
      }}>
      {({ getRootProps, getInputProps, isDragAccept }) => (
        <section {...getRootProps()} className={cn('h-40 rounded-md border-2 border-dashed grid place-items-center text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', isDragAccept && 'border-primary')}>
          <input {...getInputProps()} />
          <div className='space-y-2 flex flex-col items-center'>
            <Upload className={cn('w-8 h-8', isDragAccept && 'animate-bounce')} />
            {!isDragAccept ? 
              <p className='max-w-48 text-center'>
                Drag &apos;n&apos; Drop the json data file or click here
              </p> : 
              <p className='max-w-48 text-center'>
                Release to upload
              </p>
            }
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default FileInput;