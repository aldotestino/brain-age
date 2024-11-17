import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassBrain from './glass-brain/GlassBrain';
import WaterfallGraph from './WaterfallGraph';
import { PredictionWithExplanation } from '@/lib/types';
import { Brain, ChartBar } from 'lucide-react';
import WithTooltip from '@/components/WithTooltip';

function ExplanationCard({
  waterfallSV,
  brainSV
}: {
  waterfallSV: PredictionWithExplanation['waterfall_sv'];
  brainSV: PredictionWithExplanation['brain_sv'];
}) {
  return (
    <Card className='h-full grid grid-rows-[auto,1fr]'>
      <CardHeader>
        <CardTitle>Explanation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs orientation='vertical' defaultValue="waterfall" className='h-full grid grid-cols-[auto,1fr] gap-4'>
          <TabsList className='flex flex-col h-full'>
            <TabsTrigger value="waterfall" className='flex-1'>
              <WithTooltip tooltip='Waterfall Chart' side='right'>
                <div className='h-full grid place-items-center'>
                  <ChartBar className='size-6' />
                </div>
              </WithTooltip>
            </TabsTrigger>
            <TabsTrigger value="glassbrain" className='flex-1'>
              <WithTooltip tooltip='Glass Brain' side='right'>
                <div className='h-full grid place-items-center'>
                  <Brain className='size-6' />
                </div>
              </WithTooltip>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="waterfall" forceMount className='data-[state=inactive]:hidden mt-0'>
            <WaterfallGraph values={waterfallSV} />
          </TabsContent>
          <TabsContent value="glassbrain" forceMount className='data-[state=inactive]:hidden mt-0'>
            <GlassBrain values={brainSV} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ExplanationCard;