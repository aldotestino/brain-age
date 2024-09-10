import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import colormap from 'colormap';
import { EDITABLE_FEATURE_1, EDITABLE_FEATURE_2, GLASS_BRAIN_SHADES, modelFeatures, regions, sides } from './data';
import { DataChangeSchema, DataSchema, EditableFeatures, GlassBrainRegions, ModelFeatures, Regions, Sides } from './types';
import fullRelations from './fullRelations.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFeatureEditable(feature: string) {
  return feature === EDITABLE_FEATURE_1 || feature === EDITABLE_FEATURE_2;
}

export function createDashboardPaginationURL({ p, q, n }: { p: number, q: string, n: number }) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('p', p.toString());
  urlSearchParams.set('n', n.toString());
  if (q) {
    urlSearchParams.set('q', q);
  }
  return `/dashboard?${urlSearchParams.toString()}`;
}

export function updateWholeDataAndPercentages({
  data,
  dataChange
}: {
  data: DataSchema,
  dataChange: DataChangeSchema
}) {
  const percentages = sides.reduce((acc, side) => {
    acc = {
      ...acc,
      ...regions.reduce((acc, region) => {
        acc = {
          ...acc,
          ...updatePercentages({
            side,
            region,
            featureChanged: dataChange[side][region].featureChanged,
            percentage: dataChange[side][region].percentage
          })
        };
        return acc;
      }, {} as any)
    };
    return acc;
  }, {} as any) as DataSchema;

  const updatedData = updateData({
    data,
    percentages
  }) as DataSchema;

  return { percentages, updatedData };
}

export function updatePercentages({
  side,
  region,
  featureChanged,
  percentage
}: {
  side: Sides,
  region: Regions,
  featureChanged: EditableFeatures,
  percentage: number
}) {
  const percentages: Partial<DataSchema> = {};

  // add itself
  percentages[getModelFeatureName(featureChanged, side, region)] = percentage;

  const relations = fullRelations[featureChanged][side][region];

  Object.entries(relations).forEach(([feature, relation]) => {
    percentages[getModelFeatureName(feature, side, region)] = percentage * relation;
  });

  return percentages;
}

export function updateData({
  data,
  percentages
}: {
  data: Partial<DataSchema>
  percentages: Partial<DataSchema>
}) {
  const updatedData: Partial<DataSchema> = {};

  Object.entries(percentages).forEach(([modelFeature, percentage]) => {
    const baseData = data[modelFeature as ModelFeatures];
    updatedData[modelFeature as ModelFeatures] = baseData! + baseData! * percentage / 100;
  });

  return updatedData;
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

export function getModelFeatureName(feature: string, side: string, region: string) {
  return `${feature}_${side}-${region}` as ModelFeatures;
}
