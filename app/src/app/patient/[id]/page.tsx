import PredExp, { EmptyPredExp } from '@/components/PredExp';
import PredictionsList from '@/components/PredictionsList';
import Sidebar from '@/components/Sidebar';
import { DataSchema, PredictionWithExplanation } from '@/lib/types';
import { getPatient, getPrediction } from '@/server/queries';

async function PatientPage({ params, searchParams }: {params: {id: string}, searchParams: {predId?: string}}) {

  const patientPromise = getPatient(params.id);
  const predictionPromise = searchParams.predId ? getPrediction(searchParams.predId) : null;

  const [patient, prediction] = await Promise.all([patientPromise, predictionPromise]);

  return (
    <div className="h-screen grid grid-cols-[auto,auto,1fr]">
      <Sidebar
        email={patient.email}
        firstName={patient.firstName}
        lastName={patient.lastName}
        patientId={patient.id}
        baseData={patient.data} 
        basePercentages={prediction?.percentages || null} 
        baseCalculatedData={prediction?.calculatedData || null} 
      />
      <PredictionsList predictions={patient.predictions} />
      {prediction ?
        <PredExp
          id={prediction.id}
          parametersChanged={prediction.parametersChanged}
          prediction={prediction.prediction} 
          brainSV={prediction.brainSV as PredictionWithExplanation['brain_sv']}
          waterfallSV={prediction.waterfallSV as PredictionWithExplanation['waterfall_sv']} 
        /> : 
        <EmptyPredExp />
      }
    </div>
  );
}

export default PatientPage;