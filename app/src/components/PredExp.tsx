import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PredictionWithExplanation } from '@/lib/types';
import GlassBrain from './GlassBrain';
import PredictionCard from './PredictionCard';
import WaterfallGraph from './WaterfallGraph';
import { Inbox } from 'lucide-react';

function PredExp({
  prediction,
  waterfallSV,
  brainSV
}: {
  prediction: PredictionWithExplanation['prediction'];
  waterfallSV: PredictionWithExplanation['waterfall_sv'];
  brainSV: PredictionWithExplanation['brain_sv'];
}) {

  return (
    <main className='p-4 grid grid-rows-[auto,1fr] gap-4 overflow-y-scroll'>
      <PredictionCard prediction={prediction} />
      <Tabs defaultValue="waterfall" className='grid grid-rows-[auto,1fr]'>
        <TabsList className='w-fit'>
          <TabsTrigger value="waterfall">Waterfall Explanation</TabsTrigger>
          <TabsTrigger value="glassbrain">Glass Brain</TabsTrigger>
        </TabsList>
        <TabsContent value="waterfall">
          <WaterfallGraph values={waterfallSV} />
        </TabsContent>
        <TabsContent value="glassbrain">
          <GlassBrain values={brainSV} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export function EmptyPredExp() {
  return (
    <main className='p-4 grid place-items-center'>
      <div className="flex items-center justify-center flex-col text-muted-foreground gap-2">
        <Inbox size={50} />
        <p className='font-semibold text-center'>Select a prediction or create a new one</p>
      </div>
    </main>
  );
}

export default PredExp;