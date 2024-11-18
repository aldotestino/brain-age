import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function LoadingPatient() {
  return (
    <div className='h-screen p-4 grid grid-cols-[1fr,auto] gap-4'>
      <div className='grid grid-rows-[auto,1fr] gap-4'>
        <div className='h-52 w-full grid grid-cols-5 gap-4'>
          <Skeleton className='col-span-2' />
          <Skeleton className='col-span-3' />
        </div>
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="h-full w-80" />
    </div>
  )
}

export default LoadingPatient