import { PredictionWithExplanation } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { Bar } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Title, Tooltip, PointElement, Legend } from 'chart.js';
import { useMemo } from 'react';
import { barOptions, graphColors } from '@/lib/data';

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
      labels: values.map(({ name }) => name),
      borderColor: values.map(({ value }) => value < 0 ? graphColors.stroke.blue : graphColors.stroke.red),
      backgroundColor: values.map(({ value }) => value < 0 ? graphColors.fill.blue : graphColors.fill.red),
      data: values.map(({ range }) => range),
    };
  }, [values]);

  return (
    <Card className='h-full'>
      <CardContent className='p-6 h-full grid place-items-center'>
        <Bar data={{
          labels,
          datasets: [{
            data,
            borderColor,
            backgroundColor,
            borderSkipped: false
          }]
        }} options={barOptions} className='w-full max-w-screen-md' />
      </CardContent>
    </Card>
  );
}

export default WaterfallGraph;