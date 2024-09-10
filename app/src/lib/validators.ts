import { z } from 'zod';
import { Features, ModelFeatures, Regions, Sides } from './types';
import { EDITABLE_FEATURE_1, EDITABLE_FEATURE_2, modelFeatures, regions, sides } from './data';

const dataObject = modelFeatures.reduce((acc, key) => {
  acc[key as ModelFeatures] = z.number();
  return acc;
}, {} as Record<ModelFeatures, z.ZodNumber>);

export const dataSchema = z.object(dataObject);

export const updatePatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  sex: z.string(),
  age: z.coerce.number().int().gt(0),
  siteId: z.coerce.number().int().gt(0),
});

export const addPatientSchema = updatePatientSchema.extend({
  data: z.object(dataObject)
});

/* Data Change Schema */

const regionChangeObject = {
  featureChanged: z.enum([EDITABLE_FEATURE_1, EDITABLE_FEATURE_2]).default(EDITABLE_FEATURE_1),
  percentage: z.number().default(0),
};

const regionChangeSchema = z.object(regionChangeObject);

const sideChangeObject = regions.reduce((acc, region) => {
  acc[region] = regionChangeSchema;
  return acc;
}, {} as Record<Regions, z.ZodObject<typeof regionChangeObject>>);

const sideChangeSchema = z.object(sideChangeObject);

const dataChangeObject = sides.reduce((acc, side) => {
  acc[side] = sideChangeSchema;
  return acc;
}, {} as Record<Sides, z.ZodObject<typeof sideChangeObject>>);

export const dataChangeSchema = z.object(dataChangeObject);