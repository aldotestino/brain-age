'use client';

import PredExp from '@/components/PredExp';
import Sidebar from '@/components/Sidebar';
import { PredictionWithExplanation, Values } from '@/lib/types';
import { predictAndExplain } from '@/server/actions';
import { useState } from 'react';

export default function Home() {

  const [predictionWithExplanation, setPredictionWithExplanation] = useState<PredictionWithExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: Values) {
    setIsLoading(true);
    const data = await predictAndExplain(values);
    setPredictionWithExplanation(data);
    setIsLoading(false);
  }

  return (
    <div className="h-screen grid grid-cols-[auto,1fr]">
      <Sidebar onSubmit={onSubmit} isLoading={isLoading} />
      <PredExp predictionWithExplanation={predictionWithExplanation} />
    </div>
  );
}
