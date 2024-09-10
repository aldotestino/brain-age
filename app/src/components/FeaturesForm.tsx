'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { EDITABLE_FEATURE_1, editableFeaturesItems, features, modelFeatures, regions, regionsItems, sides, sidesItems } from '@/lib/data';
import { DataChangeSchema, DataSchema, ModelFeatures, Regions, Sides } from '@/lib/types';
import { getModelFeatureName, updateData, updatePercentages } from '@/lib/utils';
import { dataChangeSchema, dataSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import EasyComboBox from './EasyComboBox';
import EasySelect from './EasySelect';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import Spinner from './ui/spinner';
import { predictAndExplain } from '@/server/actions';
import DependantFeature from './DependantFeature';

const percentagesZero = modelFeatures.reduce((acc, key) => {
  acc[key as ModelFeatures] = 0;
  return acc;
}, {} as Record<ModelFeatures, number>);

const dataChangeZero: DataChangeSchema = sides.reduce((acc, side) => {
  acc[side] = regions.reduce((acc, region) => {
    acc[region] = {
      featureChanged: EDITABLE_FEATURE_1,
      percentage: 0
    };
    return acc;
  }, {} as any);
  return acc;
}, {} as any);

function FeaturesForm({
  patientId,
  data,
  dataChange
}: {
  patientId: number;
  data: DataSchema;
  dataChange?: DataChangeSchema
}) {

  const [side, setSide] = useState('');
  const [region, setRegion] = useState('');

  const form = useForm<DataChangeSchema>({
    defaultValues: dataChange || dataChangeZero,
    resolver: zodResolver(dataChangeSchema),
  });

  const liveForm = form.watch();

  const [calcData, setCalcData] = useState<DataSchema>(data);
  const [percentages, setPercentages] = useState<DataSchema>(percentagesZero);

  function onPercentageUpdate() {
    const updatedPercentags = updatePercentages({
      side: side as Sides,
      region: region as Regions,
      featureChanged: liveForm[side as Sides][region as Regions].featureChanged,
      percentage: liveForm[side as Sides][region as Regions].percentage
    });

    const updatedData = updateData({
      data,
      percentages: updatedPercentags
    });

    setPercentages(pv => ({
      ...pv,
      ...updatedPercentags
    }));

    setCalcData(pv => ({
      ...pv,
      ...updatedData
    }));
  }

  async function handleOnSubmit(dataChange: DataChangeSchema) {
    console.log(dataChange);
    // await predictAndExplain({
    //   patientId,
    //   dataChange
    // });
  }

  function reset() {
    form.reset();
    setPercentages(percentagesZero);
    setCalcData(data);
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
        <div className='p-4 flex flex-col gap-4 overflow-scroll'>
          {!side ? 
            <p className='text-muted-foreground'>Select a side</p> : 
            !region ? 
              <p className='text-muted-foreground'>Select a region</p> : 
              <p className='text-lg font-semibold text-muted-foreground'>Features</p>
          }
          {(side && region) &&
            <>
              <div className='space-y-2'>
                <FormField
                  control={form.control}
                  name={`${side as Sides}.${region as Regions}.featureChanged`}
                  key={`${side as Sides}.${region as Regions}.featureChanged`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Editable Feature</FormLabel>
                      <FormControl>
                        <EasySelect items={editableFeaturesItems} value={field.value} onValueChange={v => {
                          field.onChange(v);
                          onPercentageUpdate();
                        }} />
                      </FormControl>
                      <div className='flex items-center justify-between'>
                        <Label>Value</Label>
                        <p className='text-lg font-semibold text-muted-foreground'>{calcData[getModelFeatureName(field.value, side, region)].toFixed(2)}</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${side as Sides}.${region as Regions}.percentage`}
                  key={`${side as Sides}.${region as Regions}.percentage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='grid grid-cols-[1fr,auto] gap-1'>
                          <Slider min={-100} max={100} value={[field.value]} onValueChange={v => {
                            field.onChange(v[0]);
                            onPercentageUpdate();  
                          }} />
                          <span className='w-20 text-right'>{field.value >= 0 && '+'}{field.value.toFixed(2)}%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {features
                .filter(f => f !== liveForm[side as Sides][region as Regions].featureChanged) // exclude the editable feature
                .map(f => {
                  const modelFeatureName = getModelFeatureName(f, side, region);
                  return (
                    <DependantFeature key={modelFeatureName} featureName={f} calcData={calcData[modelFeatureName]} percentage={percentages[modelFeatureName]} />
                  );
                })}
            </>
          }
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