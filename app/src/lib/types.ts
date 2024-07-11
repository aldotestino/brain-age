import { z } from 'zod';
import { patientSchema, dataSchema } from './validators';
import { features, regions, sides } from './data';

export type Sides = typeof sides[number];
export type Regions = typeof regions[number];
export type Features = typeof features[number];

export type ModelFeatures = `${Features}_${Sides}-${Regions}`;
export type GlassBrainRegions = `${Sides}.pial.DK.${Regions}`;

export type DataSchema = z.infer<typeof dataSchema>;
export type PatientSchema = z.infer<typeof patientSchema>;

export type WaterfallSVItem = {
  value: number;
  data: number | null;
  name: string;
  range: [number, number];
}

export type BrainSVItem = {
  regions: {
    [key in GlassBrainRegions]: number;
  };
  min: number,
  max: number,
}

export type PredictionWithExplanation = {
  id: string;
  prediction: number;
  waterfall_sv: WaterfallSVItem[];
  brain_sv: {
    [key in Features]: BrainSVItem;
  };
}

export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}