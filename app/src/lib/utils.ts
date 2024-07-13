import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import colormap from 'colormap';
import { EDITABLE_FEATURE_1, EDITABLE_FEATURE_2, GLASS_BRAIN_SHADES, modelFeatures } from './data';
import { DataSchema, GlassBrainRegions, ModelFeatures, Regions, Sides } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dataZero = modelFeatures.reduce((acc, key) => {
  acc[key as ModelFeatures] = 0;
  return acc;
}, {} as Record<ModelFeatures, number>);

export function isFeatureEditable(feature: string) {
  return feature === EDITABLE_FEATURE_1 || feature === EDITABLE_FEATURE_2;
}

export function updateFeatures({
  side,
  region,
  feature1Percentage,
  feature2Percentage,
  baseValues,
}: {
  side: Sides,
  region: Regions,
  feature1Percentage: number,
  feature2Percentage: number,
  baseValues: DataSchema
}) {

  const relations = {
    surface_area: {
      [EDITABLE_FEATURE_1]: 2,
      [EDITABLE_FEATURE_2]: 1.5,
    },
    mean_curv: {
      [EDITABLE_FEATURE_1]: 0.2,
      [EDITABLE_FEATURE_2]: -0.6,
    },
    intrinsic_cur_index: {
      [EDITABLE_FEATURE_1]: -1.2,
      [EDITABLE_FEATURE_2]: 0.7,
    },
    gaussian_curv: {
      [EDITABLE_FEATURE_1]: 0.8,
      [EDITABLE_FEATURE_2]: 1.4,
    },
    thickness_stddev: {
      [EDITABLE_FEATURE_1]: -0.5,
      [EDITABLE_FEATURE_2]: 0.3,
    },
  };

  const values: Partial<DataSchema> = {};
  const percentages: Partial<DataSchema> = {};

  const FULL_EDITABLE_FEATURE_1 = `${EDITABLE_FEATURE_1}_${side}-${region}` as ModelFeatures;
  const FULL_EDITABLE_FEATURE_2 = `${EDITABLE_FEATURE_2}_${side}-${region}` as ModelFeatures;

  const baseFeature1 = baseValues[FULL_EDITABLE_FEATURE_1];
  const baseFeature2 = baseValues[FULL_EDITABLE_FEATURE_2];

  values[FULL_EDITABLE_FEATURE_1] = baseFeature1 + baseFeature1 / 100 * feature1Percentage;
  values[FULL_EDITABLE_FEATURE_2] = baseFeature2 + baseFeature2 / 100 * feature2Percentage;

  for (const [relatedFeature, factor] of Object.entries(relations)) {
    const relatedFeatureName = `${relatedFeature}_${side}-${region}` as ModelFeatures;
    const relatedFeatureValue = baseValues[relatedFeatureName];

    const totalPercentage = factor.GM_vol * feature1Percentage + factor.average_thickness * feature2Percentage;

    const updatedValue = relatedFeatureValue + relatedFeatureValue / 100 * totalPercentage;

    values[relatedFeatureName] = updatedValue;
    percentages[relatedFeatureName] = totalPercentage;
  }

  return { values, percentages };
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function valueToColor(value: number, min: number, max: number) {
  const colors = colormap({
    colormap: 'RdBu',
    nshades: GLASS_BRAIN_SHADES,
    format: 'hex'
  });

  const colorIndex = Math.round(mapRange(value, min, max, 0, colors.length - 1));
  return colors[colorIndex];
}

export function getGlassBrainRegion(modelChildName: string) {
  return modelChildName.replace('pial.DK.', '') as GlassBrainRegions;
}