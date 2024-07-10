import { z } from 'zod';
import { ModelNames } from './types';

export const featuresSchema = z.object({
  surface_area: z.number(),
  mean_curv: z.number(),
  intrinsic_cur_index: z.number(),
  GM_vol: z.number(),
  gaussian_curv: z.number(),
  average_thickness: z.number(),
  thickness_stddev: z.number(),
});

export const regionsSchema = z.object({
  bankssts: featuresSchema,
  caudalanteriorcingulate: featuresSchema,
  caudalmiddlefrontal: featuresSchema,
  cuneus: featuresSchema,
  entorhinal: featuresSchema,
  fusiform: featuresSchema,
  inferiorparietal: featuresSchema,
  inferiortemporal: featuresSchema,
  isthmuscingulate: featuresSchema,
  lateraloccipital: featuresSchema,
  lateralorbitofrontal: featuresSchema,
  lingual: featuresSchema,
  medialorbitofrontal: featuresSchema,
  middletemporal: featuresSchema,
  parahippocampal: featuresSchema,
  paracentral: featuresSchema,
  parsopercularis: featuresSchema,
  parsorbitalis: featuresSchema,
  parstriangularis: featuresSchema,
  pericalcarine: featuresSchema,
  postcentral: featuresSchema,
  posteriorcingulate: featuresSchema,
  precentral: featuresSchema,
  precuneus: featuresSchema,
  rostralanteriorcingulate: featuresSchema,
  rostralmiddlefrontal: featuresSchema,
  superiorfrontal: featuresSchema,
  superiorparietal: featuresSchema,
  superiortemporal: featuresSchema,
  supramarginal: featuresSchema,
  frontalpole: featuresSchema,
  temporalpole: featuresSchema,
  transversetemporal: featuresSchema,
  insula: featuresSchema
});

export const percentagesSchema = z.object({
  lh: regionsSchema,
  rh: regionsSchema,
});

export const featuresValues = Object.keys(featuresSchema.shape);
export const regionsValues = Object.keys(regionsSchema.shape);
export const sidesValues = Object.keys(percentagesSchema.shape);

export const modelFeatures = sidesValues.flatMap((s) =>
  regionsValues.flatMap((r) =>
    featuresValues.map((f) => `${f}_${s}-${r}`)
  )
) as ModelNames[];

const dataObject = modelFeatures.reduce((acc, key) => {
  acc[key] = z.number();
  return acc;
}, {} as Record<ModelNames, z.ZodNumber>);

export const patientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  data: z.object(dataObject)
});