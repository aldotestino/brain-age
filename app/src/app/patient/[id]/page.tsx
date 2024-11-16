import PredExp, { EmptyPredExp } from '@/components/PredExp';
import PredictionsList from '@/components/PredictionsList';
import Sidebar from '@/components/Sidebar';
import { PredictionWithExplanation } from '@/lib/types';
import { getPatient, getPrediction } from '@/server/queries';
import { patientParamsCache } from './patient-params';

async function PatientPage({ 
  params, 
  searchParams 
}: {
  params: {id: string}, 
  searchParams: Record<string, string | string[] | undefined>
}) {

  const { predId } = patientParamsCache.parse(searchParams);

  const patientPromise = getPatient(params.id);
  const predictionPromise = predId ? getPrediction(predId) : null;

  const [patient, prediction] = await Promise.all([patientPromise, predictionPromise]);

  return (
    <div className="h-screen grid grid-cols-[auto,auto,1fr]">
      <Sidebar
        taxIdCode={patient.taxIdCode}
        firstName={patient.firstName}
        lastName={patient.lastName}
        patientId={patient.id}
        baseData={patient.data}
        dataChange={prediction?.dataChange}
      />
      <PredictionsList predictions={patient.predictions} />
      {prediction ?
        <PredExp
          id={prediction.id}
          age={patient.age}
          sex={patient.sex}
          siteId={patient.siteId}
          isBase={prediction.isBase}
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