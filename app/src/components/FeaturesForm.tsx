'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { EDITABLE_FEATURE_1, EDITABLE_FEATURE_2, featuresItems, regionsItems, sidesItems } from '@/lib/data';
import { DataSchema, ModelFeatures, Regions, Sides } from '@/lib/types';
import { cn, dataZero, isFeatureEditable, updateFeatures } from '@/lib/utils';
import { dataSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import EasyComboBox from './EasyComboBox';
import EasySelect from './EasySelect';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import Spinner from './ui/spinner';
import { predictAndExplain } from '@/server/actions';

function FeaturesForm({
  patientId,
  baseData,
  basePercentages,
  baseCalculatedData,
}: {
  patientId: number;
  baseData: DataSchema;
  basePercentages: DataSchema | null;
  baseCalculatedData: DataSchema | null;
}) {

  const [side, setSide] = useState('');
  const [region, setRegion] = useState('');

  const [baseValues] = useState<DataSchema>(baseData);
  const [calculatedData, setCalculatedData] = useState<DataSchema>(baseCalculatedData || baseData);

  const form = useForm<DataSchema>({
    defaultValues: basePercentages || dataZero,
    resolver: zodResolver(dataSchema),
  });

  useEffect(() => {
    if(baseCalculatedData) {
      setCalculatedData(baseCalculatedData);
    }

    if(basePercentages) {
      form.reset(basePercentages);
    }
  }, [baseCalculatedData, basePercentages, form]);

  function onPercentageUpdate() {
    const { values, percentages } = updateFeatures({
      side: side as Sides,
      region: region as Regions,
      feature1Percentage: form.getValues(`${EDITABLE_FEATURE_1}_${side}-${region}` as ModelFeatures),
      feature2Percentage: form.getValues(`${EDITABLE_FEATURE_2}_${side}-${region}` as ModelFeatures),
      baseValues
    });

    setCalculatedData(p => ({
      ...p,
      ...values
    }));

    Object.entries(percentages).forEach(([relatedFeature, relatedPercentage]) => {
      form.setValue(relatedFeature as ModelFeatures, relatedPercentage);
    });
  }

  async function handleOnSubmit(percentages: DataSchema) {
    await predictAndExplain({
      patientId,
      percentages,
      calculatedData
    });
  }

  function reset() {
    form.reset();
    setCalculatedData(baseCalculatedData || baseData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOnSubmit)} className="grid grid-rows-[auto,1fr,auto] overflow-y-hidden">
        <div>
          <div className='p-4 grid gap-4'>
            <div className='space-y-2'>
              <Label>Side</Label>
              <EasySelect items={sidesItems} value={side} onValueChange={setSide} placeholder='Select a side' />
            </div>
            <div className='flex flex-col space-y-2'>
              <Label>Region</Label>
              <EasyComboBox emptyText='No region found.' placeholder='Select a region' value={region} onValueChange={setRegion} items={regionsItems} />
            </div>
          </div>
          <Separator />
        </div>
        <div className='p-4 grid gap-4 overflow-scroll'>
          {!side ? 
            <p className='text-muted-foreground'>Select a side</p> : 
            !region ? 
              <p className='text-muted-foreground'>Select a region</p> : 
              <p className='text-lg font-semibold text-muted-foreground'>Features</p>}
          {(side && region) && 
            featuresItems.map(({ value: feature, label }) => (
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
                      <p className='text-lg font-semibold text-muted-foreground'>{calculatedData[`${feature}_${side}-${region}` as ModelFeatures].toFixed(2)}</p>
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
            ))}
        </div>
        <div className="p-4 border-t flex gap-2 justify-end">
          <Button type='button' onClick={reset} variant="outline" className='space-x-2'>
            Reset
          </Button>
          <Button type='submit' className='space-x-2' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            <span>Predict</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FeaturesForm;