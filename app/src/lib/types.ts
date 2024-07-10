import { z } from 'zod';
import { featuresSchema, patientSchema, percentagesSchema, regionsSchema } from './validators';

export type PercentagesSchema = z.infer<typeof percentagesSchema>;
export type PatientSchema = z.infer<typeof patientSchema>;

export type FeaturesKeys = keyof typeof featuresSchema.shape;
export type RegionsKeys = keyof typeof regionsSchema.shape;
export type SideKeys = keyof typeof percentagesSchema.shape;
export type PercentagesNames = `${SideKeys}.${RegionsKeys}.${FeaturesKeys}`;
export type FullRegionsKeys = `${SideKeys}.${RegionsKeys}`;
export type ModelNames = `${FeaturesKeys}_${SideKeys}-${RegionsKeys}`

export type Features = {
  [key in FeaturesKeys]: {
    label: string
    editable: boolean
  }
}

export type Percentages = {
  [key in PercentagesNames]: number
}

export type Values = {
  [key in ModelNames]: number
}

export type WaterfallSVItem = {
  value: number;
  data: number | null;
  name: string;
  range: [number, number];
}

export type BrainSVItem = {
  regions: {
    [key in FullRegionsKeys]: number;
  };
  min: number,
  max: number,
}

export type PredictionWithExplanation = {
  id: string;
  prediction: number;
  waterfall_sv: WaterfallSVItem[];
  brain_sv: {
    [key in FeaturesKeys]: BrainSVItem;
  };
}

export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}