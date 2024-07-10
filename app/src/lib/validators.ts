import { z } from 'zod';

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

export const patientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});