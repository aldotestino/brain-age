'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { EDITABLE_FEATURE_1, editableFeaturesItems, features, modelFeatures, regions, regionsItems, regionsNamesAndDescription, sides, sidesItems } from '@/lib/data';
import { DataChangeSchema, DataSchema, ModelFeatures, Regions, Sides } from '@/lib/types';
import { getModelFeatureName, updateData, updatePercentages, updateAllDataAndPercentages } from '@/lib/utils';
import { dataChangeSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import EasyComboBox from './EasyComboBox';
import EasySelect from './EasySelect';
import { Button } from './ui/button';
import { Label } from './ui/label';
import Spinner from './ui/spinner';
import { predictAndExplain } from '@/server/actions';
import DependantFeature from './DependantFeature';
import { useToast } from './ui/use-toast';
import EditedRegionsAlert from './EditedRegionsAlert';
import { Brain, Hexagon } from 'lucide-react';
import SubmitButton from '@/components/SubmitButton';

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

function SimulationForm({
  patientId,
  baseData,
  dataChange
}: {
  patientId: number;
  baseData: DataSchema;
  dataChange?: DataChangeSchema
}) {

  const { toast } = useToast();

  const [side, setSide] = useState('');
  const [region, setRegion] = useState('');

  const form = useForm<DataChangeSchema>({
    defaultValues: dataChange || dataChangeZero,
    resolver: zodResolver(dataChangeSchema),
  });

  const liveForm = form.watch();

  const [updatedData, setUpdatedData] = useState<DataSchema>(baseData);
  const [percentages, setPercentages] = useState<DataSchema>(percentagesZero);

  // Function to reset the form to the defaults of the selected prediction
  const reset = useCallback(() => {
    if(dataChange) {
      form.reset(dataChange);
      
      const { updatedPercentages, updatedData: returnedUpdatedData } = updateAllDataAndPercentages({
        baseData,
        dataChange
      });

      setPercentages(updatedPercentages);
      setUpdatedData(returnedUpdatedData);
    } else {
      form.reset(dataChangeZero);
      setPercentages(percentagesZero);
      setUpdatedData(baseData);
    }
  }, [baseData, dataChange, form]);

  // Reset the form to the new data
  useEffect(reset, [reset]);

  function onPercentageUpdate() {
    const updatedPercentags = updatePercentages({
      side: side as Sides,
      region: region as Regions,
      featureChanged: liveForm[side as Sides][region as Regions].featureChanged,
      percentage: liveForm[side as Sides][region as Regions].percentage
    });

    const returnedUpdatedData = updateData({
      baseData,
      percentages: updatedPercentags
    });

    setPercentages(pv => ({
      ...pv,
      ...updatedPercentags
    }));

    setUpdatedData(pv => ({
      ...pv,
      ...returnedUpdatedData
    }));
  }

  async function handleOnSubmit(dataChange: DataChangeSchema) {
    const err = await predictAndExplain({
      patientId,
      dataChange
    });
    if(err) {
      toast({
        title: 'Error',
        description: err,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Sucess',
        description: 'Prediction created successfully',
      });
    }
  }

  function onSelectEditedRegion(side: Sides, region: Regions) {
    setSide(side);
    setRegion(region);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOnSubmit)} className="h-full grid grid-rows-[1fr,auto] overflow-y-hidden divide-y">
        <div className='p-4 overflow-y-auto space-y-4'>
          {dataChange && <EditedRegionsAlert dataChange={dataChange} onSelect={onSelectEditedRegion} />}
          <div className='space-y-2'>
            <Label className='inline-flex'>
              <Brain className='size-4 mr-2' />
              Emisphere
            </Label>
            <EasySelect items={sidesItems} value={side} onValueChange={setSide} placeholder='Select a emisphere' />
          </div>
          <div className='flex flex-col space-y-2'>
            <Label className='inline-flex'>
              <Hexagon className="size-4 mr-2" />
              Region
            </Label>
            <EasyComboBox emptyText='No region found.' placeholder='Select a region' value={region} onValueChange={setRegion} items={regionsItems} />
            {region && <FormDescription className='text-muted-foreground text-sm'>{regionsNamesAndDescription[region as Regions].description}</FormDescription>}
          </div>

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
                        <EasySelect 
                          items={editableFeaturesItems} 
                          value={field.value} 
                          onValueChange={v => {
                            field.onChange(v);
                            form.setValue(`${side as Sides}.${region as Regions}.percentage`, 0);
                            onPercentageUpdate();
                          }} 
                        />
                      </FormControl>
                      <div className='flex items-center justify-between'>
                        <Label>Value</Label>
                        <p className='text-lg font-semibold text-muted-foreground'>{updatedData[getModelFeatureName(field.value, side, region)].toFixed(2)}</p>
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
                          <Slider 
                            min={-100} 
                            max={100} 
                            value={[field.value]} 
                            onValueChange={v => {
                              field.onChange(v[0]);
                              onPercentageUpdate();  
                            }} 
                          />
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
                    <DependantFeature key={modelFeatureName} featureName={f} calcData={updatedData[modelFeatureName]} percentage={percentages[modelFeatureName]} />
                  );
                })}
            </>
          }
        </div>
        
        <div className="p-4 flex gap-2 justify-end">
          <Button type='button' onClick={reset} variant="outline" className='space-x-2'>
            Reset
          </Button>
          <SubmitButton>Simulate</SubmitButton>
        </div>
      </form>
    </Form>
  );
}

export default SimulationForm;