import { PredictionWithExplanation } from '@/lib/types';
import { Inbox } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PredictionCard from './PredictionCard';
import GlassBrain from './GlassBrain';

function PredExp({
  predictionWithExplanation
}: {
  predictionWithExplanation: PredictionWithExplanation | null;
}) {

  if(!predictionWithExplanation) {
    return (
      <main className='p-4 grid place-items-center'>
        <div className="flex items-center justify-center flex-col text-muted-foreground gap-2">
          <Inbox size={50} />
          <p className='font-semibold text-center'>Upload patient data to get started...</p>
        </div>
      </main>
    );
  }

  console.log(predictionWithExplanation);

  return (
    <main className='p-4 grid grid-rows-[auto,1fr] gap-4'>
      <PredictionCard prediction={predictionWithExplanation.prediction} />
      <Tabs defaultValue="glassbrain" className='grid grid-rows-[auto,1fr]'>
        <TabsList className='w-fit'>
          <TabsTrigger value="waterfall">Waterfall Explanation</TabsTrigger>
          <TabsTrigger value="glassbrain">Glass Brain</TabsTrigger>
        </TabsList>
        <TabsContent value="waterfall">Waterfall graph</TabsContent>
        <TabsContent value="glassbrain">
          <GlassBrain />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default PredExp;