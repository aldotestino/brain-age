'use client';

import { ModelFeatures, PredictionWithExplanation } from '@/lib/types';
import { Bar } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Title, Tooltip, PointElement, Legend } from 'chart.js';
import { useMemo } from 'react';
import { barOptions, graphColors } from '@/lib/data';
import { formatWaterfallLabel } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PointElement,
  Legend
);

function WaterfallGraph({
  values
}: {
  values: PredictionWithExplanation['waterfall_sv'];
}) {

  const { labels, borderColor, backgroundColor, data } = useMemo(() => {
    return {
      labels: values.map(({ name }, i, arr) => i === arr.length - 1 ? name : formatWaterfallLabel(name as ModelFeatures)), // raname all labels but the last one
      borderColor: values.map(({ value }) => value < 0 ? graphColors.stroke.green : graphColors.stroke.red),
      backgroundColor: values.map(({ value }) => value < 0 ? graphColors.fill.green : graphColors.fill.red),
      data: values.map(({ range }) => range),
    };
  }, [values]);

  return (
    <div className='h-full flex justify-center'>
      <Bar 
        data={{
          labels,
          datasets: [{
            data,
            borderColor,
            backgroundColor,
            borderSkipped: false
          }]
        }} 
        options={barOptions} 
        className='h-full w-auto max-w-screen-lg' 
      />
    </div>
  );
}

export default WaterfallGraph;