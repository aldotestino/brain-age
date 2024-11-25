'use client';

import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PredictionWithExplanation } from '@/lib/types';
import { formatChartLabel } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

function ShapValuesLegend() {
  return <div className='flex justify-center text-sm pt-3'>
    <div className='flex items-center mr-4'>
      <div className='size-4 rounded-sm mr-2 bg-red-600' />
      <span>Increase Age</span>
    </div>
    <div className='flex items-center'>
      <div className='size-4 rounded-sm mr-2 bg-green-600' />
      <span>Decrease Age</span>
    </div>
  </div>;
}

const chartConfig = {
  name: {
    label: 'Feature Name',
  },
  value: {
    label: 'Shap Value',
  },
} satisfies ChartConfig;

function TornadoPlot({ values }: {values: PredictionWithExplanation['tornado_sv']}) {

  return (
    <div className='h-full flex justify-center overflow-hidden'>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={values} layout='vertical'>
          <CartesianGrid vertical={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent labelFormatter={formatChartLabel} className='w-52' colorFn={value => !isNaN(value) ? value < 0 ? '#15A34A' : '#DC2626' : '#fff'} />}
          />
          <ChartLegend content={<ShapValuesLegend />} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            width={200}
            tickFormatter={formatChartLabel}
          />
          <XAxis 
            dataKey='value'
            type='number'
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="value" radius={5}>
            {values.map((item) => (
              <Cell
                key={item.name}
                fill={
                  item.value > 0
                    ? 'hsl(var(--chart-1))'
                    : 'hsl(var(--chart-2))'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default TornadoPlot;