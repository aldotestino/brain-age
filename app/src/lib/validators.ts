import { z } from 'zod';
import { ModelFeatures } from './types';
import { modelFeatures } from './data';

const dataObject = modelFeatures.reduce((acc, key) => {
  acc[key as ModelFeatures] = z.number();
  return acc;
}, {} as Record<ModelFeatures, z.ZodNumber>);

export const dataSchema = z.object(dataObject);

export const updatePatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  sex: z.enum(['Male', 'Female']),
  age: z.coerce.number().int().gt(0),
  siteId: z.coerce.number().int().gt(0),
});

export const addPatientSchema = updatePatientSchema.extend({
  data: z.object(dataObject)
});
