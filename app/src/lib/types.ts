import { z } from 'zod';
import { updatePatientSchema, addPatientSchema, dataSchema, dataChangeSchema } from './validators';
import { editableFeatures, features, regions, sides } from './data';

export type Sides = typeof sides[number];
export type Regions = typeof regions[number];
export type Features = typeof features[number];

export type EditableFeatures = typeof editableFeatures[number]

export type ModelFeatures = `${Features}_${Sides}-${Regions}`;
export type GlassBrainRegions = `${Sides}.${Regions}`;

export type DataSchema = z.infer<typeof dataSchema>;

export type DataChangeSchema = z.infer<typeof dataChangeSchema>;
export type UpdatePatientSchema = z.infer<typeof updatePatientSchema>;
export type AddPatientSchema = z.infer<typeof addPatientSchema>;

type WaterfallSVItem = {
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

export type BrainSV = {
  [key in Features]: BrainSVItem;
}

export type PredictionWithExplanation = {
  prediction: number;
  waterfall_sv: WaterfallSVItem[];
  brain_sv: BrainSV
}