'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { EDITABLE_FEATURE_1, EDITABLE_FEATURE_2, featuresItems, regionsItems, sidesItems } from '@/lib/data';
import { DataSchema, ModelFeatures, Regions, Sides } from '@/lib/types';
import { cn, dataZero, isFeatureEditable, updateFeatures } from '@/lib/utils';
import { dataSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import EasyComboBox from './EasyComboBox';
import EasySelect from './EasySelect';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import Spinner from './ui/spinner';

function FeaturesForm({
  onSubmit,
  isLoading
}: {
  onSubmit: (values: DataSchema) => Promise<void>;
  isLoading: boolean;
}) {

  const [side, setSide] = useState('');
  const [region, setRegion] = useState('');

  const [baseValues] = useState<DataSchema>(dataZero);
  const [calculatedValues, setCalculatedValues] = useState<DataSchema>(dataZero);

  const form = useForm<DataSchema>({
    defaultValues: dataZero,
    resolver: zodResolver(dataSchema),
  });

  function onPercentageUpdate() {
    const { values, percentages } = updateFeatures({
      side: side as Sides,
      region: region as Regions,
      feature1Percentage: form.getValues(`${EDITABLE_FEATURE_1}_${side}-${region}` as ModelFeatures),
      feature2Percentage: form.getValues(`${EDITABLE_FEATURE_2}_${side}-${region}` as ModelFeatures),
      baseValues
    });

    setCalculatedValues(p => ({
      ...p,
      ...values
    }));

    Object.entries(percentages).forEach(([relatedFeature, relatedPercentage]) => {
      form.setValue(relatedFeature as ModelFeatures, relatedPercentage);
    });
  }

  function handleOnSubmit() {
    onSubmit(calculatedValues);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOnSubmit)} className="grid grid-rows-[auto,1fr,auto] overflow-y-hidden">
        <div>
          <div className='p-4 grid gap-4'>
            <div className='space-y-2'>
              <Label>Side</Label>
              <EasySelect items={sidesItems} value={side} onValueChange={setSide} />
            </div>
            <div className='flex flex-col space-y-2'>
              <Label>Region</Label>
              <EasyComboBox emptyText='No region found.' placeholder='Select a region' value={region} onValueChange={setRegion} items={regionsItems} />
            </div>
          </div>
          <Separator />
        </div>
        <div className='p-4 grid gap-4 overflow-scroll'>
          <p className='text-lg font-semibold text-muted-foreground'>Features</p>
          {(side && region) && 
            featuresItems.map(({ value: feature, label }) =>
              <FormField
                key={`${feature}_${side}-${region}`}
                control={form.control}
                name={`${feature}_${side}-${region}` as ModelFeatures}
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-baseline justify-between'>
                      <FormLabel>
                        {label}
                      </FormLabel>
                      <p className='text-lg font-semibold text-muted-foreground'>{calculatedValues[`${feature}_${side}-${region}` as ModelFeatures].toFixed(2)}</p>
                    </div>
                    <FormControl>
                      <div className='grid grid-cols-[1fr,auto]'>
                        <Slider 
                          min={-100} 
                          max={100} 
                          value={[field.value]} 
                          onValueChange={(value) => {
                            field.onChange(value[0]);
                            onPercentageUpdate();
                          }} 
                          className={cn(!isFeatureEditable(feature) && 'opacity-50')} 
                          disabled={!isFeatureEditable(feature)} 
                        />
                        <p className='w-20 text-right'>{field.value >= 0 && '+'}{field.value.toFixed(2)}%</p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
        </div>
        <div className="p-4 border-t flex justify-end">
          <Button type='submit' className='space-x-2' disabled={isLoading}>
            {isLoading && <Spinner />}
            <span>Predict</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FeaturesForm;