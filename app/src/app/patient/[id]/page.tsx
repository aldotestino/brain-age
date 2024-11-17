import { getCachedPatient, getCachedPrediction } from '@/server/queries';
import { patientParamsCache } from './patient-params';
import SimulationForm from '@/components/SimulationForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import History from '@/components/History';
import InfoCard from '@/components/InfoCard';
import ResultCard from '@/components/ResultCard';
import ExplanationCard from '@/components/ExplanationCard';
import PredictionActions from '@/components/PredictionActions';

async function PatientPage({ 
  params, 
  searchParams 
}: {
  params: {id: string}, 
  searchParams: Record<string, string | string[] | undefined>
}) {

  const { predId } = patientParamsCache.parse(searchParams);

  const [patient, prediction] = await Promise.all([
    getCachedPatient(params.id),
    getCachedPrediction({ patientId: params.id, predictionId: predId })
  ]);

  return (
    <main className='h-screen grid grid-cols-[1fr,auto]'>
      
      <div className='h-full grid grid-rows-[auto,1fr] gap-4 p-4'>
        
        <div className='grid grid-cols-5 gap-4'>
          <InfoCard {...patient} />
          <ResultCard prediction={prediction.prediction} age={patient.age} />
        </div>
        
        <ExplanationCard waterfallSV={prediction.waterfallSV} brainSV={prediction.brainSV} />
      </div>
      
      <div className='h-full w-80 bg-neutral-50 border-l grid grid-rows-[auto,1fr] overflow-y-hidden'>

        <div className='p-4 gap-2 grid grid-cols-[auto,auto,1fr,auto] items-center'>
          <Link href="/dashboard" className={buttonVariants({ size:'icon', variant:'ghost', className:'w-8 h-8 p-0' })}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-semibold">Prediction</h1>
          <span/> {/* Spacer */}
          <PredictionActions predictionId={prediction.id} isBase={prediction.isBase} />
        </div>

        <Tabs defaultValue='simulation' className='h-full grid grid-rows-[auto,1fr] overflow-y-hidden'>
          <div className='px-4'>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="simulation" className='overflow-y-hidden'>
            <SimulationForm 
              patientId={patient.id}
              baseData={patient.data}
              dataChange={prediction.dataChange}
            />
          </TabsContent>
          <TabsContent value='history' className='overflow-y-hidden'>
            <History predictions={patient.predictions} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default PatientPage;