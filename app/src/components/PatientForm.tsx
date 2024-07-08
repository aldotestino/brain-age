'use client';

import { useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EasySelect from './EasySelect';
import EasyComboBox from './EasyComboBox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload } from 'lucide-react';
import { cn, defaultValueFromSchema, startingValues, updateFeatures } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { FeaturesKeys, FormNames, FormSchema, ModelNames, RegionsKeys, SideKeys, Values } from '@/lib/types';
import { formSchema } from '@/lib/validators';
import { features, regions, sidesItems } from '@/lib/data';
import Spinner from './ui/spinner';

function PatientForm({
  onSubmit,
  isLoading
}: {
  onSubmit: (values: Values) => Promise<void>;
  isLoading: boolean;
}) {

  const [side, setSide] = useState('');
  const [region, setRegion] = useState('');

  const [baseValues, setBaseValues] = useState<Values>(startingValues);
  const [calculatedValues, setCalculatedValues] = useState<Values>(startingValues);

  const form = useForm<FormSchema>({
    defaultValues: defaultValueFromSchema(formSchema),
    resolver: zodResolver(formSchema),
  });

  function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const json: Values = JSON.parse(e.target?.result as string);
          setBaseValues(json);
          setCalculatedValues(json);
          form.reset();
        } catch (error) {
          console.log('error');
        }
      };
      reader.readAsText(file);
    }
  }

  function onPercentageUpdate() {
    const { values, percentages } = updateFeatures({
      side: side as SideKeys,
      region: region as RegionsKeys,
      feature1Percentage: form.getValues(`${side}.${region}.GM_vol` as FormNames),
      feature2Percentage: form.getValues(`${side}.${region}.average_thickness` as FormNames),
      baseValues
    });

    setCalculatedValues(p => ({
      ...p,
      ...values
    }));

    Object.entries(percentages).forEach(([relatedFeature, relatedPercentage]) => {
      form.setValue(relatedFeature as FormNames, relatedPercentage);
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
            <input type="file" id="actual-btn" hidden onChange={onFileUpload}/>
            <label htmlFor="actual-btn" className={buttonVariants({ className: 'cursor-pointer space-x-2' })}>
              <Upload className="w-4 h-4" />
              <span>Upload Data</span>
            </label>
            <div className='space-y-2'>
              <Label>Side</Label>
              <EasySelect items={sidesItems} value={side} onValueChange={setSide} />
            </div>
            <div className='flex flex-col space-y-2'>
              <Label>Region</Label>
              <EasyComboBox emptyText='No region found.' placeholder='Select a region' value={region} onValueChange={setRegion} items={regions} />
            </div>
          </div>
          <Separator />
        </div>
        <ScrollArea>
          <div className='p-4 grid gap-4'>
            <p className='text-lg font-semibold text-muted-foreground'>Features</p>
            {(side && region) && 
            Object.keys(formSchema.shape[side as SideKeys].shape[region as RegionsKeys].shape)
              .map(f => ({ formName: `${side}.${region}.${f}`as FormNames, modelName: `${f}_${side}-${region}` as ModelNames, name: f as FeaturesKeys }))
              .map(f =>
                <FormField
                  key={f.formName}
                  control={form.control}
                  name={f.formName}
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-baseline justify-between'>
                        <FormLabel>
                          {features[f.name].label}
                        </FormLabel>
                        <p className='text-lg font-semibold text-muted-foreground'>{calculatedValues[f.modelName].toFixed(2)}</p>
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
                            className={cn(!features[f.name].editable && 'opacity-50')} 
                            disabled={!features[f.name].editable} 
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
        </ScrollArea>
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

export default PatientForm;